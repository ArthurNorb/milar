# Deploy em produção — VPS Oracle (já existente) + Cloudflare

Cenário: a VPS e a VCN já existem e já servem **outro site** pelo **Nginx do host**
(DNS direto no IP, sem Cloudflare). O Milar entra como mais um site nessa mesma VPS,
sem mexer no que já funciona.

```text
Visitante ─HTTPS─> Cloudflare (WAF, DDoS) ─HTTPS + mTLS─> VPS :443  Nginx do host
                                                                 ├─ outro site (como já está)
                                                                 └─ milararquitetura.com
                                                                      │ 127.0.0.1:3010
                                                                Docker: Next (usuário node)
                                                                      │ rede interna
                                                                Docker: Postgres (sem porta)
```

Proteções do Milar:
- **Authenticated Origin Pulls (mTLS)**: no domínio do Milar, o Nginx só aceita conexões
  com o certificado de cliente do Cloudflare. Quem descobrir o IP da VPS não chega no Milar
  sem passar pelo Cloudflare. O outro site não é afetado.
- O app só escuta em `127.0.0.1`. O banco não tem porta publicada.
- No app: headers de segurança, rate limit no login e nos depoimentos, `requireAdmin()`.

---

## 0. Descobrir IPs (você fora de casa)

**O seu IP público agora** (para liberar o SSH na VCN a partir de onde você está):

```bash
curl -4 ifconfig.me ; echo
```

Ou abra <https://ifconfig.me> no navegador do celular/notebook. Anote: é o `SEU.IP`.

> IP de 4G/5G, hotel ou café muda com frequência. Se o SSH parar de responder, rode de
> novo e atualize a regra (passo 2). Quando voltar para casa, troque pelo IP de casa.

**O IP da VPS:** console da Oracle → *☰ → Compute → Instances* → clique na instância →
campo **Public IP address**. Ou, se já estiver dentro da VPS: `curl -4 ifconfig.me`.

## 1. Reconhecer a VPS

```bash
ssh ubuntu@IP_DA_VPS          # ou o usuário que você usa (opc, se for Oracle Linux)

uname -m; nproc; free -h; df -h /           # arquitetura, CPU, RAM, disco
sudo ss -ltnp | grep -E ':(80|443|3010) '   # quem escuta nas portas
ls /etc/nginx/sites-enabled/                # sites do Nginx (se aparecer, é Nginx mesmo)
docker --version; docker compose version    # Docker já instalado?
```

O que esperar e o que fazer:

- **80/443 com `nginx`**: é o cenário deste guia. Se aparecer `caddy`, `apache2` ou
  `docker-proxy`, pare e me chame: a config do passo 8 é diferente.
- **Nada na 3010**: ótimo. Se tiver algo, escolha outra porta (ex.: 3020) e troque em
  `APP_PORT` (passo 6) e no `upstream` de `deploy/nginx/milar.conf`.
- **RAM**: em `free -h`, se a VPS tiver ~1 GB (shape **E2.1.Micro**, x86_64), o build **não**
  roda nela: as imagens são feitas na sua máquina e enviadas por SSH (passo 7). Crie **2 GB de
  swap** (abaixo) como folga para picos. Em ARM A1 com 6 GB ou mais, o build pode rodar na VPS.
- **Disco**: precisa de uns 5 GB livres para imagens Docker, banco e fotos.

> **VPS atual (`vnic-portal`)**: E2.1.Micro x86_64, 2 vCPU, 952 MB de RAM (~285 MB livres com
> o `portal` rodando), sem swap, 41 GB livres, Nginx com o site `portal`, porta 3010 livre,
> sem Docker. Ou seja: swap obrigatório, Docker a instalar, build pela sua máquina.
>
> Medido localmente com os limites do `compose.prod.yml`: app ~75 MB e Postgres ~32 MB depois
> de 150 requisições simultâneas (tetos de 448 MB e 256 MB). Cabe, mas o espaço é curto. Veja
> quem mais consome com `ps aux --sort=-rss | head -8`. Se ficar apertado, a Oracle também dá de
> graça instâncias **Ampere A1** (até 4 OCPU / 24 GB), muito mais folgadas, só que nem sempre há
> capacidade disponível na região.

Swap (só se `free -h` mostrar `Swap: 0B`):

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
# Usa swap só quando precisa (o padrão 60 joga coisa no disco cedo demais)
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swap.conf && sudo sysctl -p /etc/sysctl.d/99-swap.conf
free -h   # agora deve mostrar Swap: 2.0Gi
```

## 2. VCN — Security List

Console da Oracle → *Networking → Virtual Cloud Networks* → sua VCN → *Security Lists* →
a lista da sub-rede da VPS (normalmente *Default Security List*).

**Para o Milar não precisa abrir nada novo**: o outro site já usa 80/443.

Sobre o **SSH (22)**, veja como está a regra hoje:

- Se estiver `0.0.0.0/0` e você quiser travar no seu IP: **Add Ingress Rules** →
  *Source CIDR* `SEU.IP/32`, *IP Protocol* TCP, *Destination Port* `22`. Salve,
  **teste o SSH numa nova janela** e só então apague a regra `0.0.0.0/0` da 22.
- Se você vai ficar trocando de rede (viagem), é aceitável deixar a 22 aberta **desde que**
  o SSH aceite só chave e o fail2ban esteja ligado (passo 3).
- Sem SSH nenhum? O console da Oracle tem **Cloud Shell** (ícone `>_` no topo) e
  *Instance → Console connection*, que funcionam sem a porta 22.

**Não restrinja a 443 às faixas do Cloudflare ainda**: o outro site está com DNS direto e
cairia. Isso fica para depois que ele também passar pelo Cloudflare (passo 11).

## 3. Endurecer o sistema (só o que faltar)

Esses passos são seguros para o outro site. Pule o que já estiver feito.

```bash
# Atualizações de segurança automáticas
sudo apt update && sudo apt install -y unattended-upgrades fail2ban git
sudo dpkg-reconfigure -plow unattended-upgrades
```

**SSH só com chave.** Antes, confirme que você entra com chave (se o `ssh` não pediu senha,
é chave). Depois:

```bash
sudo tee /etc/ssh/sshd_config.d/99-hardening.conf >/dev/null <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
MaxAuthTries 3
LoginGraceTime 20
X11Forwarding no
EOF
sudo sshd -t && sudo systemctl reload ssh
```

**Abra outra janela e confirme que o SSH ainda entra** antes de fechar a atual.

**fail2ban** para o SSH:

```bash
sudo tee /etc/fail2ban/jail.d/sshd.local >/dev/null <<'EOF'
[sshd]
enabled = true
backend = systemd
maxretry = 4
findtime = 10m
bantime = 1h
EOF
sudo systemctl enable --now fail2ban
```

**Firewall do host:** a imagem Ubuntu da Oracle usa `iptables` em `/etc/iptables/rules.v4`.
Como o outro site já funciona, 80/443 já estão liberadas ali. **Não instale UFW.** O app do
Milar escuta só em `127.0.0.1`, então não precisa de regra nova.

## 4. Docker (se ainda não tiver)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER      # saia e entre de novo no SSH

sudo tee /etc/docker/daemon.json >/dev/null <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "5" },
  "live-restore": true,
  "no-new-privileges": true
}
EOF
sudo systemctl restart docker
```

> O Docker cria regras próprias no iptables. **Não rode `netfilter-persistent save`**
> com o Docker ligado, senão as regras dele ficam salvas duplicadas no boot.
> Estar no grupo `docker` equivale a ser root: só o seu usuário deve estar nele.

## 5. Cloudflare (só o domínio do Milar)

1. Adicione `milararquitetura.com` no Cloudflare (plano Free). Ele importa os registros
   atuais. **Mantenha `MX` e `TXT`** (e-mail, verificações).
2. **DNS**: `A @ → IP_DA_VPS` e `A www → IP_DA_VPS`, **proxy ligado (nuvem laranja)**.
   Se o domínio ainda está na Vercel, siga o `MIGRACAO.md`, que diz quando trocar os nameservers.
3. **SSL/TLS → Overview**: **Full (strict)**.
4. **SSL/TLS → Edge Certificates**: *Always Use HTTPS* ligado, *Minimum TLS* 1.2, HSTS ligado.
5. **SSL/TLS → Origin Server → Create Certificate**: RSA, hosts `milararquitetura.com` e
   `*.milararquitetura.com`, 15 anos. Guarde o certificado e a chave.
6. **SSL/TLS → Origin Server → Authenticated Origin Pulls**: **ligar**.
7. **Security → WAF → Rate limiting rules**: `URI Path starts with /admin` e método `POST`
   → 10 req/min por IP → *Block* 10 min.
8. **Security → Bots**: *Bot Fight Mode* ligado.
9. **Caching → Cache Rules**: *Bypass cache* para `/admin` e `/api/`.
10. (Opcional) **Zero Trust → Access**: proteja `milararquitetura.com/admin*` com o e-mail da arquiteta.

Na VPS, os certificados (do root, só o root lê):

```bash
sudo mkdir -p /etc/milar/certs
sudo nano /etc/milar/certs/origin.pem    # cole o certificado de origem
sudo nano /etc/milar/certs/origin.key    # cole a chave privada
sudo curl -fsSL -o /etc/milar/certs/cloudflare-origin-pull-ca.pem \
  https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem
sudo chmod 700 /etc/milar/certs && sudo chmod 600 /etc/milar/certs/*
```

## 6. Código e segredos

Na **sua máquina**, gere o hash da senha do admin (senha longa, 16+ caracteres):

```bash
npm run hash-password -- "uma-frase-longa-e-unica"
```

Na **VPS**:

```bash
sudo mkdir -p /opt/milar && sudo chown $USER:$USER /opt/milar
git clone -b dev <url-do-repo> /opt/milar && cd /opt/milar
cp deploy/env.production.example .env.production
chmod 600 .env.production
openssl rand -hex 32      # → POSTGRES_PASSWORD
openssl rand -base64 48   # → SESSION_SECRET
nano .env.production      # preencha tudo (ADMIN_EMAIL, ADMIN_PASSWORD_HASH, APP_PORT...)
```

Repositório privado: crie uma *deploy key* só leitura (`ssh-keygen -t ed25519 -f ~/.ssh/milar_deploy`)
e cadastre em *GitHub → Settings → Deploy keys*.

O app **se recusa a subir** com segredo fraco, hash inválido ou `NEXT_PUBLIC_SITE_URL` sem
https (ver `instrumentation.ts`).

## 7. Subir o app

Na E2.1.Micro o build é feito **na sua máquina** (que também é x86_64) e a imagem pronta vai
por SSH. Na VPS ficam só o código (compose, Nginx, scripts) e o `.env.production`.

**Na sua máquina**, na pasta do projeto, com tudo commitado e com `git push` feito:

```bash
./deploy/ship.sh ubuntu@IP_DA_VPS
```

O script:
1. recusa rodar com mudanças não commitadas ou não enviadas (a VPS faz `git pull`);
2. confere se a arquitetura local é igual à da VPS;
3. faz o build das imagens `milar-app` e `milar-migrate`;
4. envia as duas por SSH (~120 MB comprimidos; as camadas em comum vão uma vez só);
5. na VPS, roda `git pull` e `./deploy/deploy.sh`, que aplica as migrations e sobe banco e app.

Na VPS, confira:

```bash
cd /opt/milar
./deploy/deploy.sh ps     # app em 127.0.0.1:3010->3000/tcp, migrate com exit 0
curl -sI http://127.0.0.1:3010/ | head -1   # HTTP/1.1 200 OK
free -h                   # ver como ficou a memória com tudo rodando
```

O `deploy.sh` percebe sozinho que a VPS tem pouca RAM e **não tenta buildar**. Se as imagens
não estiverem lá, ele avisa para usar o `ship.sh`. Em VPS com 2 GB ou mais, ele faz o build ali
mesmo (ou force com `FORCE_BUILD=1 ./deploy/deploy.sh`).

Limites de memória (em `compose.prod.yml`): Postgres 256 MB, app 448 MB. Se algum estourar, o
Docker reinicia só aquele container, sem o kernel derrubar o Nginx ou o `portal`.

## 8. Nginx: adicionar o site do Milar

```bash
cd /opt/milar
sudo cp deploy/nginx/milar-tls.conf /etc/nginx/snippets/milar-tls.conf
sudo cp deploy/nginx/milar.conf /etc/nginx/sites-available/milar.conf
sudo ln -s /etc/nginx/sites-available/milar.conf /etc/nginx/sites-enabled/milar.conf

sudo nginx -t                    # TEM que dar "syntax is ok" e "test is successful"
sudo systemctl reload nginx      # reload não derruba o outro site
```

Se o `nginx -t` falhar, **não recarregue**. O Nginx continua rodando com a config antiga,
então o outro site não cai. Erros comuns:

| Erro | Solução |
|---|---|
| `duplicate listen options for [::]:443` | o outro site declara `[::]:443` com opções (`ipv6only`, `default_server`); apague as linhas `listen [::]:...` do `milar.conf` |
| `cannot load certificate "/etc/milar/certs/..."` | refaça o passo 5 (arquivos e permissões) |
| `unknown directive "set_real_ip_from"` | `sudo apt install libnginx-mod-http-realip` (raro no Ubuntu) |

Para desfazer: `sudo rm /etc/nginx/sites-enabled/milar.conf && sudo systemctl reload nginx`.

## 9. Backup local

```bash
sudo cp /opt/milar/deploy/systemd/milar-backup.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now milar-backup.timer
sudo systemctl start milar-backup.service && sudo ls -lh /var/backups/milar
```

Diário às 03:30, retenção de 14 dias em `/var/backups/milar` (só root lê).
**Não protege contra perda da VM**: copie de vez em quando para fora
(`sudo tar -C /var/backups -czf - milar | ssh sua-maquina 'cat > milar-backups.tgz'`, ou `scp`).

### Restaurar

```bash
cd /opt/milar
C="docker compose --env-file .env.production -f compose.prod.yml"
$C stop app
$C exec -T db pg_restore -U milar -d milar --clean --if-exists < /var/backups/milar/db-AAAA-MM-DD-HHMM.dump
sudo docker run --rm -i -v milar_uploads:/data alpine \
  sh -c 'tar -xzf - -C /data && chown -R 1000:1000 /data' \
  < /var/backups/milar/uploads-AAAA-MM-DD-HHMM.tar.gz
$C start app
```

## 10. Checklist

De **fora** da VPS (sua máquina):

```bash
# Via Cloudflare: headers de segurança e "server: cloudflare"
curl -sI https://milararquitetura.com | grep -iE 'server|strict-transport|content-security|x-frame'

# Direto no IP com o domínio do Milar, sem o certificado do Cloudflare → 400
curl -sk -o /dev/null -w '%{http_code}\n' --resolve milararquitetura.com:443:IP_DA_VPS https://milararquitetura.com/

# Porta do app e do banco fechadas de fora (devem dar timeout/recusado)
nc -vz -w 3 IP_DA_VPS 3010; nc -vz -w 3 IP_DA_VPS 5432
```

Na VPS:

```bash
./deploy/deploy.sh ps                                      # app em 127.0.0.1:3010
docker compose --env-file .env.production -f compose.prod.yml exec app id   # uid=1000(node)
sudo tail -f /var/log/nginx/milar.access.log               # IPs reais dos visitantes
sudo fail2ban-client status sshd
```

E confira que **o outro site continua no ar**.

No Milar: o login do admin funciona; 6 senhas erradas seguidas mostram "Muitas tentativas";
o depoimento enviado fica pendente; o upload de foto funciona.

## 11. Depois: outro site no Cloudflare e VCN fechada

Quando quiser passar o outro site pelo Cloudflare também:

1. Adicione o domínio dele no Cloudflare, `A → IP_DA_VPS`, nuvem laranja, SSL **Full (strict)**.
   Se ele usa Let's Encrypt (certbot), a renovação continua funcionando via Cloudflare.
   Opcionalmente, troque por um Origin Certificate como no Milar.
2. Com **os dois** sites atrás do Cloudflare, restrinja na Security List as portas **80 e 443**
   às faixas do Cloudflare (<https://www.cloudflare.com/ips-v4>) e apague as regras `0.0.0.0/0`
   dessas portas:

   ```text
   173.245.48.0/20  103.21.244.0/22  103.22.200.0/22  103.31.4.0/22
   141.101.64.0/18  108.162.192.0/18 190.93.240.0/20  188.114.96.0/20
   197.234.240.0/22 198.41.128.0/17  162.158.0.0/15   104.16.0.0/13
   104.24.0.0/14    172.64.0.0/13    131.0.72.0/22
   ```

Assim nenhum dos dois sites fica acessível sem passar pelo WAF/DDoS do Cloudflare.

## Manutenção

- Atualizar o Milar: commit e push, depois `./deploy/ship.sh ubuntu@IP_DA_VPS` na sua máquina.
  O Nginx não precisa de reload.
- Rode `npm audit --omit=dev` antes de cada deploy e atualize o que for crítico/alto.
- Derrubar todas as sessões do admin: troque `SESSION_VERSION` no `.env.production` e faça o deploy.
- Trocar a senha do admin: gere um novo hash, edite `ADMIN_PASSWORD_HASH` e faça o deploy.
- Revise as faixas do Cloudflare (`deploy/nginx/milar.conf` e VCN) a cada alguns meses.
- **Always Free**: a Oracle pode recuperar instâncias ociosas em contas sem *Pay As You Go*.
  Converter a conta para PAYG (sem custo se ficar no free tier) evita isso.
