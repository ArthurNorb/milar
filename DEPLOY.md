# Deploy em produção — VPS Oracle Always Free + Cloudflare

Arquitetura:

```text
Visitante ──HTTPS──> Cloudflare (WAF, DDoS, cache) ──HTTPS + mTLS──> VPS :443
                                                                      │
                                         Caddy (Origin Cert, só aceita Cloudflare)
                                                                      │ rede "frontend"
                                                          Next (usuário node, sem caps)
                                                                      │ rede "backend" (sem internet)
                                                                  Postgres 17 (sem porta publicada)
```

Camadas de proteção: Security List da VCN (só Cloudflare na 443, SSH só do seu IP) →
Authenticated Origin Pulls (mTLS) no Caddy → headers de segurança, rate limit e
`requireAdmin()` no app → banco isolado em rede interna.

---

## 1. Criar a instância

- Shape **VM.Standard.A1.Flex** (Ampere, ARM64), ex.: 2 OCPU / 12 GB. Imagem **Ubuntu 24.04**.
- Cole sua **chave SSH pública ed25519** (`ssh-keygen -t ed25519`). Não use senha.
- Rede: VCN com sub-rede pública. Em *Reserved public IPs*, reserve um IP e associe à VNIC
  (o IP efêmero muda se a instância for recriada).
- Boot volume: o padrão (47 GB) basta; Always Free permite até 200 GB no total.

## 2. VCN — Security List (ou NSG)

Em *Networking → Virtual Cloud Networks → sua VCN → Security Lists → Default*:

**Remova** a regra padrão `0.0.0.0/0 TCP 22` e as regras ICMP abertas, se quiser.

**Ingress** (todas *stateful*, TCP):

| Origem | Porta | Motivo |
|---|---|---|
| `SEU.IP.PUBLICO/32` | 22 | SSH só da sua casa/escritório |
| cada faixa IPv4 do Cloudflare | 443 | HTTPS só via Cloudflare |

Faixas IPv4 do Cloudflare (confira em <https://www.cloudflare.com/ips-v4>):

```text
173.245.48.0/20  103.21.244.0/22  103.22.200.0/22  103.31.4.0/22
141.101.64.0/18  108.162.192.0/18 190.93.240.0/20  188.114.96.0/20
197.234.240.0/22 198.41.128.0/17  162.158.0.0/15   104.16.0.0/13
104.24.0.0/14    172.64.0.0/13    131.0.72.0/22
```

Mantenha também a regra ICMP tipo 3 código 4 (Path MTU) que vem por padrão.
**Egress**: `0.0.0.0/0` todos os protocolos (necessário para apt, Docker Hub e build).

> Seu IP de casa mudou e o SSH parou? Atualize a regra pelo console da Oracle, ou use o
> *Cloud Shell* / *Bastion* da própria Oracle (gratuitos) para entrar.

## 3. Sistema operacional

Entre como `ubuntu` (`ssh ubuntu@IP`) e rode:

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y unattended-upgrades fail2ban git
sudo timedatectl set-timezone America/Sao_Paulo

# Atualizações de segurança automáticas, com reboot às 04:30 se precisar
sudo dpkg-reconfigure -plow unattended-upgrades
sudo tee /etc/apt/apt.conf.d/52milar >/dev/null <<'EOF'
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:30";
EOF

# Swap de 2 GB (o build do Next consome memória)
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### SSH

```bash
sudo tee /etc/ssh/sshd_config.d/99-milar.conf >/dev/null <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey
MaxAuthTries 3
LoginGraceTime 20
X11Forwarding no
AllowAgentForwarding no
AllowUsers ubuntu
EOF
sudo sshd -t && sudo systemctl reload ssh
```

Abra **outra** sessão SSH para confirmar que ainda entra antes de fechar a atual.

### fail2ban

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

### Firewall do host (iptables da Oracle)

A imagem Ubuntu da Oracle já vem com `iptables` restritivo em `/etc/iptables/rules.v4`
(só 22 liberado, `REJECT` no fim). **Não instale UFW** (conflita com essas regras e com o
Docker) e **não precisa abrir a 443 ali**: porta publicada pelo Docker passa pela cadeia
`FORWARD`/`DOCKER`, não pela `INPUT`. Quem filtra a 443 é a VCN (passo 2) e o mTLS do Caddy.

Confira depois do deploy: `sudo iptables -L INPUT -n` deve continuar com só a 22.

### Docker (repositório oficial, ARM64)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu   # saia e entre de novo no SSH

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

> Estar no grupo `docker` equivale a ser root. Só o seu usuário deve estar nele.

## 4. Cloudflare

1. Adicione o domínio ao Cloudflare e troque os nameservers no registro.br.
2. **DNS**: registros `A` para `@` e `www` → IP reservado da VPS, **proxy ligado (nuvem laranja)**.
3. **SSL/TLS → Overview**: modo **Full (strict)**.
4. **SSL/TLS → Edge Certificates**: *Always Use HTTPS* ligado, *Minimum TLS* 1.2,
   *HSTS* ligado (max-age 12 meses, incluir subdomínios, preload só quando tiver certeza).
5. **SSL/TLS → Origin Server → Create Certificate**: RSA, hosts `milararquitetura.com` e
   `*.milararquitetura.com`, validade 15 anos. Salve o certificado e a chave.
6. **SSL/TLS → Origin Server → Authenticated Origin Pulls**: **ligar**.
   Baixe a CA: <https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem>
7. **Security → WAF → Rate limiting rules** (o plano grátis permite 1 regra):
   `URI Path starts with /admin` e método `POST` → 10 requisições / 1 min por IP → *Block* 10 min.
8. **Security → Bots**: *Bot Fight Mode* ligado.
9. (Opcional, recomendado) **Zero Trust → Access → Applications**: proteja
   `milararquitetura.com/admin*` exigindo e-mail da arquiteta (código por e-mail, grátis até 50 usuários).
   Assim o login do painel nem aparece para quem não passou pelo Access.
10. **Caching → Cache Rules**: *Bypass cache* para `URI Path starts with /admin` e `/api/`.

Na VPS, coloque os arquivos (só root lê a chave):

```bash
sudo mkdir -p /etc/milar/certs
sudo nano /etc/milar/certs/origin.pem    # certificado de origem
sudo nano /etc/milar/certs/origin.key    # chave privada
sudo curl -fsSL -o /etc/milar/certs/cloudflare-origin-pull-ca.pem \
  https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem
sudo chmod 700 /etc/milar/certs && sudo chmod 600 /etc/milar/certs/*
```

> O container do Caddy roda como root e consegue ler os arquivos `600` do root.

## 5. Segredos

Na **sua máquina** (dev), gere o hash da senha do admin (use uma senha longa, 16+ caracteres):

```bash
npm run hash-password -- "uma-frase-longa-e-unica"
```

Na **VPS**:

```bash
sudo mkdir -p /opt/milar && sudo chown ubuntu:ubuntu /opt/milar
git clone <url-do-repo> /opt/milar && cd /opt/milar
cp deploy/env.production.example .env.production
chmod 600 .env.production
openssl rand -hex 32      # → POSTGRES_PASSWORD
openssl rand -base64 48   # → SESSION_SECRET
nano .env.production      # preencha tudo
```

Se o repositório for privado, use uma *deploy key* só de leitura (`ssh-keygen -t ed25519 -f ~/.ssh/milar_deploy`)
cadastrada no GitHub em *Settings → Deploy keys*.

O app **se recusa a subir** se `SESSION_SECRET`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SITE_URL` (https)
etc. estiverem ausentes ou inválidos (ver `instrumentation.ts`).

## 6. Subir

```bash
cd /opt/milar
./deploy/deploy.sh        # build, migrations e sobe db + app + caddy
./deploy/deploy.sh ps     # status
./deploy/deploy.sh logs   # logs
```

Atualizar depois de um push: `git pull && ./deploy/deploy.sh`.

Fotos do seed (Unsplash) não são criadas em produção: o `npm run seed` não roda aqui.

## 7. Backup local

```bash
sudo cp deploy/systemd/milar-backup.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now milar-backup.timer
sudo systemctl start milar-backup.service && ls -lh /var/backups/milar
```

Diário às 03:30, retenção de 14 dias em `/var/backups/milar` (só root lê).
**O backup local não protege contra perda da VM** — copie de vez em quando para fora:
`scp ubuntu@IP:/var/backups/milar/* ./backups/` (precisa de `sudo chmod` ou rodar via `sudo`).

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

## 8. Checklist de verificação

De **fora** da VPS:

```bash
# Só a 443 (e a 22, a partir do seu IP) devem responder
nmap -Pn -p 22,80,443,3000,5432 IP_DA_VPS

# Acesso direto à origem, sem o certificado de cliente do Cloudflare → handshake recusado
curl -vk https://IP_DA_VPS/ --resolve milararquitetura.com:443:IP_DA_VPS

# Via Cloudflare: headers de segurança presentes e sem X-Powered-By
curl -sI https://milararquitetura.com | grep -iE 'strict-transport|content-security|x-frame|x-content-type|powered'
```

Na VPS:

```bash
./deploy/deploy.sh ps                       # só o caddy com 0.0.0.0:443
docker compose --env-file .env.production -f compose.prod.yml exec app id   # uid=1000(node)
sudo iptables -L INPUT -n                   # 443 não precisa estar aqui
sudo fail2ban-client status sshd
```

No site: login do admin funciona; 6 senhas erradas seguidas → "Muitas tentativas";
envio de depoimento funciona e fica pendente; upload de foto funciona.

## Manutenção

- `git pull && ./deploy/deploy.sh` também atualiza as imagens base (`--pull`).
- Rode `npm audit --omit=dev` antes de cada deploy e atualize o que for crítico/alto.
- Derrubar todas as sessões do admin: troque `SESSION_VERSION` no `.env.production` e rode o deploy.
- Trocar a senha do admin: gere novo hash, edite `ADMIN_PASSWORD_HASH`, rode o deploy.
- Revise as faixas do Cloudflare (VCN e `deploy/Caddyfile`) a cada alguns meses.
- **Always Free**: a Oracle pode recuperar instâncias A1 ociosas (CPU < 20% por 7 dias) em contas
  sem cartão "Pay As You Go". Converter a conta para PAYG (sem custo se ficar no free tier) evita isso.
