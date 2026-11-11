# Milar Arquitetura

Site de portfólio e captação da arquiteta Giovanna Lima, com foco em neuroarquitetura.

## Funcionalidades

- **Home**: hero, apresentação da arquiteta e depoimentos aprovados (com formulário público)
- **Portfólio**: projetos paginados com carrossel de fotos, ordem definida no painel
- **Painel admin** (`/admin`): gestão de projetos (upload, edição, ordenação por arrastar) e moderação de depoimentos
- **WhatsApp**: botão flutuante de contato
- **SEO**: metadata, Open Graph, `sitemap.xml` e `robots.txt`

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + Shadcn UI (base: `@base-ui/react`)
- Postgres + Drizzle ORM, login próprio (cookie JWT) e fotos em disco (`sharp`)
- Lucide React

## Como rodar

```bash
./run
```

Sobe o Postgres (Docker), aplica migrations e seed e inicia o servidor em [http://localhost:3000](http://localhost:3000). Detalhes e requisitos em [SETUP.md](SETUP.md).

## Scripts

| Comando | O que faz |
|---|---|
| `./run` | Ambiente de dev completo (banco + migrations + seed + Next) |
| `npm run dev` | Só o servidor do Next |
| `npm run build` | Build de produção |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run seed` | Popula projetos e depoimentos de exemplo |
| `npm run db:generate` / `db:migrate` | Gera / aplica migrations do Drizzle |
| `npm run hash-password -- "senha"` | Gera `ADMIN_PASSWORD_HASH` |

## Estrutura

```text
app/            rotas (/, /portfolio, /admin, /uploads, sitemap, robots)
components/     layout/ e ui/
lib/            db (Drizzle), auth, imagens, queries, tipos, configuração do site
proxy.ts        proteção das rotas do painel
drizzle/        migrations SQL (geradas)
```

Guia para desenvolvimento com Claude Code em [CLAUDE.md](CLAUDE.md).

## Licença

Proprietário — todos os direitos reservados.
