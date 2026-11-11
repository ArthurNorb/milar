# Migração: Vercel + Supabase → VPS Oracle

O que está no ar hoje (Vercel) é a versão antiga: dados no Postgres do Supabase,
fotos no Supabase Storage (bucket `project-images`), login pelo Supabase Auth.
A versão nova roda tudo na VPS: Postgres próprio, fotos em disco, login por
`ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`.

O que precisa ser levado:

| Item | Como |
|---|---|
| Projetos e depoimentos (inclusive pendentes) | `npm run import:supabase` |
| Fotos do Storage | o mesmo script baixa, converte para WebP e reescreve as URLs |
| Login da arquiteta | **não migra**: gere um hash novo (`npm run hash-password`) |
| Domínio | troca de DNS para o Cloudflare, no fim |
| Blog | não existia no Supabase; começa vazio |

Ordem: **ensaiar tudo na sua máquina → preparar a VPS → importar de verdade →
trocar o DNS → observar → desligar o antigo.** O site antigo fica no ar o tempo
todo, então sempre dá para voltar.

---

## 0. Cuidado com a Vercel antes de qualquer push na `main`

A Vercel faz deploy automático da `main`. Se a versão nova chegar lá, a Vercel vai
tentar subir ela sem `DATABASE_URL` e **o site atual cai**. Antes de fazer merge
de `dev` em `main`:

- Vercel → projeto → *Settings → Git* → **Disconnect** (ou *Ignored Build Step*
  com o comando `exit 0`).

A VPS pode clonar direto a branch `dev`, então dá para fazer a migração toda sem
mexer na `main`.

## 1. Pegar a conexão do Supabase

1. Supabase → seu projeto → botão **Connect** (topo) → aba *Connection string*.
2. Escolha **Session pooler** (a conexão "Direct" só funciona via IPv6).
3. Copie a URI: `postgresql://postgres.<ref>:[YOUR-PASSWORD]@aws-0-<região>.pooler.supabase.com:5432/postgres`
4. Não sabe a senha? *Project Settings → Database → Reset database password*.
   Pode resetar sem medo: o site antigo usa a API do Supabase (anon key), não essa senha.

Se o projeto estiver **pausado** (plano grátis pausa após 7 dias sem acesso), clique em *Restore*.

### Backup completo do Supabase (faça antes de tudo)

Guarde um dump inteiro, para o caso de precisar de algo depois de apagar o projeto:

```bash
docker run --rm -v "$PWD":/out postgres:17-alpine \
  pg_dump "postgresql://postgres.<ref>:<senha>@aws-0-<região>.pooler.supabase.com:5432/postgres" \
  -n public -Fc -f /out/supabase-completo.dump
```

> Ali também está a tabela `orcamento_solicitacoes` (formulário de orçamento antigo,
> removido da versão nova), com **dados pessoais de clientes**. Ela não é migrada.
> Decida com a Giovanna se guardam (o dump acima já guarda) ou se descartam (LGPD).
> Guarde o dump fora do repositório e fora de pastas sincronizadas.

## 2. Ensaio na sua máquina

```bash
./run reset          # banco e fotos de dev zerados (o seed cria exemplos; tudo bem)
```

Em **outro terminal**, com o `./run` de pé:

```bash
export SUPABASE_DB_URL='postgresql://postgres.<ref>:<senha>@aws-0-<região>.pooler.supabase.com:5432/postgres'
npm run import:supabase -- --replace
```

O `--replace` apaga os projetos e depoimentos de exemplo do seed e põe os reais no
lugar. O script:

- só faz `SELECT` no Supabase (não altera nada lá);
- mantém ids, ordem, tags, datas e o status de aprovação dos depoimentos;
- converte as fotos para WebP 1920px sem metadados (as do Storage são o original);
- grava tudo numa transação: se falhar no meio, o banco fica como estava e as fotos
  já convertidas são apagadas.

Agora confira em <http://localhost:3000>: home, `/projetos` (todas as páginas e
carrosséis), depoimentos. No `/admin` (login de dev), confira se os pendentes
apareceram para aprovação.

> Os posts de exemplo do seed continuam no banco de dev; eles **não** vão para a
> produção (o passo 4 só exporta projetos e depoimentos).

## 3. Preparar a VPS

Siga o [DEPLOY.md](DEPLOY.md) **até o passo 6** (instância, VCN, SSH, Docker,
certificados do Cloudflare, `.env.production`, `./deploy/deploy.sh`).

Diferenças por ser migração:

- No **passo 4 do DEPLOY.md (Cloudflare)**, ao adicionar o domínio, o Cloudflare
  importa os registros DNS atuais. **Não troque os nameservers ainda.** Só revise:
  - `A @` e `CNAME www` (hoje apontam para a Vercel, ex.: `76.76.21.21` /
    `cname.vercel-dns.com`) → troque para `A @ IP_DA_VPS` e `A www IP_DA_VPS`, nuvem laranja.
  - **Mantenha** `MX`, `TXT` (SPF/DKIM/verificações) e tudo o que for e-mail ou
    Google/Meta: se sumirem, o e-mail do domínio para.
- Para clonar: `git clone -b dev <url-do-repo> /opt/milar` (depois de dar push na `dev`).

Ao fim, o site estará rodando na VPS, vazio, mas ainda sem tráfego (o DNS continua na Vercel).

## 4. Importação de verdade

Avise a Giovanna para **não editar nada no painel antigo** a partir de agora.

Na sua máquina, repita a importação (pega o que entrou desde o ensaio) e exporte só
as tabelas migradas e as fotos:

```bash
./run reset                                   # terminal 1; deixe rodando
npm run import:supabase -- --replace          # terminal 2

docker compose -f compose.dev.yml exec -T db \
  pg_dump -U milar -d milar --data-only -t projects -t testimonials > migracao-dados.sql
tar -czf migracao-fotos.tar.gz -C .data/uploads .
scp migracao-dados.sql migracao-fotos.tar.gz ubuntu@IP_DA_VPS:/tmp/
```

Na VPS:

```bash
cd /opt/milar
C="docker compose --env-file .env.production -f compose.prod.yml"

# Dados (o banco de produção tem as tabelas vazias, criadas pelas migrations)
$C exec -T db psql -U milar -d milar -v ON_ERROR_STOP=1 < /tmp/migracao-dados.sql

# Fotos
sudo docker run --rm -i -v milar_uploads:/data alpine \
  sh -c 'tar -xzf - -C /data && chown -R 1000:1000 /data' < /tmp/migracao-fotos.tar.gz

# Zera o cache de páginas/dados do Next (pode ter guardado a versão vazia)
$C rm -sf app && docker volume rm milar_next-cache && ./deploy/deploy.sh

# Conferência
$C exec -T db psql -U milar -d milar -c "select count(*) from projects" -c "select count(*) from testimonials"
shred -u /tmp/migracao-dados.sql /tmp/migracao-fotos.tar.gz
```

Apague também os dois arquivos da sua máquina depois.

Teste a produção antes do DNS, de dentro da VPS (o Caddy só aceita o Cloudflare, então
o teste vai direto no app):

```bash
$C exec app wget -qO- http://127.0.0.1:3000/projetos | grep -o '<title>[^<]*'
```

## 5. Trocar o DNS

1. No **registro.br** (ou onde o domínio foi comprado) → *DNS* → *Alterar servidores DNS*
   → coloque os dois nameservers que o Cloudflare mostrou.
2. Cloudflare → *Overview* fica "Pending" até propagar (minutos a algumas horas;
   o registro.br pode levar até 24 h). Clique em *Check nameservers* para acelerar.
3. Durante a propagação parte dos visitantes ainda cai na Vercel. Os dois sites
   funcionam, então ninguém vê erro.

Quando o Cloudflare ficar **Active**:

```bash
curl -sI https://milararquitetura.com | grep -iE 'server|strict-transport|content-security'
# deve aparecer "server: cloudflare" e os headers de segurança
```

Faça o checklist do passo 8 do DEPLOY.md e peça para a Giovanna:

- entrar em `/admin` com o **login novo** (o e-mail/senha do Supabase não valem mais);
- aprovar um depoimento e enviar uma foto de teste.

## 6. Depois da troca

**Depoimentos que caíram no site antigo durante a propagação:** 1 ou 2 dias depois,
rode no Supabase (*SQL Editor*):

```sql
select id, client_name, text, created_at from testimonials
where created_at > '<data/hora da importação final>' order by created_at;
```

Se houver algum, cadastre manualmente (ou peça para a pessoa reenviar).

**Voltar atrás** (se algo der muito errado): Cloudflare → DNS → troque `A @` por
`CNAME @ cname.vercel-dns.com` e `www` igual, **nuvem cinza**. Volta em minutos,
porque a Vercel e o Supabase continuam lá.

**Desligar o antigo** (depois de ~2 semanas estável):

1. Vercel → projeto → *Settings → Domains* → remova o domínio; depois apague o projeto.
2. Supabase → confirme que tem o `supabase-completo.dump` → *Settings → General → Delete project*.
3. Remova da sua máquina e da Vercel as variáveis `NEXT_PUBLIC_SUPABASE_*` antigas.
4. Agora pode fazer merge de `dev` em `main` sem medo.
