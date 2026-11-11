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
- Supabase (auth, banco, storage) via `@supabase/ssr`
- Lucide React

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Configuração do Supabase em [SETUP.md](SETUP.md).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run seed` | Popula projetos e depoimentos de exemplo |

## Estrutura

```text
app/            rotas (/, /portfolio, /admin, /auth/signout, sitemap, robots)
components/     layout/ e ui/
lib/            clientes Supabase, queries, tipos, configuração do site
proxy.ts        proteção das rotas do painel
supabase/       migrations SQL
```

Guia para desenvolvimento com Claude Code em [CLAUDE.md](CLAUDE.md).

## Licença

Proprietário — todos os direitos reservados.
