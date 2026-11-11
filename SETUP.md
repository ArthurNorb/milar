# Ambiente de desenvolvimento — Milar Arquitetura

## Requisitos

- Node.js 20+ (testado com 24)
- Docker (para o Postgres de dev)

Docker no WSL (Ubuntu/Debian):

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"   # feche e reabra o terminal
sudo service docker start
```

## Rodar

```bash
./run
```

O script instala as dependências (se precisar), gera `.env.development.local`, sobe o Postgres em Docker, aplica as migrations, popula dados de exemplo e inicia o `next dev` com hot reload.

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin — `admin@milar.local` / `milar-dev`

Para começar do zero (apaga banco e fotos de dev): `./run reset`.

## Onde ficam os dados de dev

- Banco: volume Docker `milar-dev-db` (Postgres em `127.0.0.1:54329`).
- Fotos enviadas pelo admin: `.data/uploads/` (fora do git).

## Mudar o schema do banco

1. Edite `lib/db/schema.ts` (e `lib/types.ts`).
2. `npm run db:generate` e revise o SQL em `drizzle/`.
3. `npm run db:migrate` (o `./run` também aplica).

## Variáveis de ambiente (produção)

Veja `.env.example`. Gere o hash da senha do admin com:

```bash
npm run hash-password -- "senha-forte"
```

E o segredo da sessão com `openssl rand -base64 48`.

## Solução de problemas

- **"Docker não encontrado" / daemon não responde**: instale ou inicie o Docker (acima).
- **Porta 54329 ocupada**: troque a porta em `compose.dev.yml` e em `DATABASE_URL`.
- **Login não funciona depois de editar o `.env.development.local`**: reinicie o `./run`.
- **Erro de upload**: fotos até 15 MB; formatos JPG, PNG, WebP, AVIF e HEIC.
