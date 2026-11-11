# Milar Arquitetura — Guia para Claude Code

Site de portfólio e captação da arquiteta Giovanna Lima (neuroarquitetura). Next.js 16 + Postgres (Drizzle) + login próprio + imagens em disco.

## Fluxo de Trabalho (obrigatório)

- **Antes de começar qualquer tarefa**, invoque a skill `/context-mode:context-mode` (Skill `context-mode:context-mode`) e siga o roteamento dela para saídas grandes
- **Nunca faça commit** (nem `git commit`, nem push). Quem commita é o usuário
- **Ao terminar, sempre entregue uma mensagem de commit** sugerida, em uma linha, bem resumida, em PT-BR, com prefixo `feat:`, `fix:`, `refactor:`, `chore:` ou `doc:`
  - Exemplo: `fix: reset do formulário de depoimento após envio`
  - Se a tarefa misturar tipos, escolha o principal ou sugira uma mensagem por tipo

## Regras Críticas

- **NUNCA leia ou liste a pasta `public/`** — imagens pesadas, irrelevante para código
- **NÃO altere estilos, cores, fontes ou layout do frontend** — o design está finalizado
- Só toque em UI se a tarefa exigir explicitamente uma mudança funcional (e mantenha as classes visuais idênticas)
- TypeScript estrito; **nunca `any`** (use `unknown` + `getErrorMessage` de `lib/utils.ts`)
- Next.js 16 mudou APIs: leia `node_modules/next/dist/docs/` antes de usar uma API do framework (ver `AGENTS.md`)
- **Autorização é do servidor** (não há RLS): toda Server Action / route handler de escrita do admin começa com `requireAdmin()` (`lib/auth.ts`). Depoimento público entra sempre com `is_approved = false`
- O módulo de orçamento foi **removido** (era acoplado ao Supabase/Resend)

## Quando usar cada skill

Invoque a skill do tópico **antes** de editar:

- **Mexer em UI, componentes, classes Tailwind, cores, fontes ou imagens** → `milar-design-system`
- **Mexer em banco, auth, uploads de imagem, migrations, queries ou tipos** → `milar-database`
- **Criar rota, layout, metadata, sitemap/robots, proxy ou route handler** → `milar-nextjs16`
- **Mexer no painel `/admin` ou adicionar uma aba/gerenciador** → `milar-admin`
- **Antes de dizer que terminou ou sugerir a mensagem de commit** → `milar-verify`

## Comandos

```bash
./run               # dev completo: Postgres (Docker) + migrations + seed + next dev
./run reset         # idem, apagando antes o banco e as fotos de dev
npm run dev         # só o Next (banco já precisa estar de pé)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # build de produção
npm run seed        # popula projetos/depoimentos de exemplo (só em tabelas vazias)
npm run db:generate # gera migration a partir de lib/db/schema.ts
npm run db:migrate  # aplica migrations pendentes
npm run hash-password -- "senha"   # gera ADMIN_PASSWORD_HASH
```

Dev: requer Docker. Login do admin em dev: `admin@milar.local` / `milar-dev`.

## Stack

- **Next.js 16** (App Router, `proxy.ts`) + **TypeScript** estrito
- **Tailwind CSS v4** + **Shadcn UI** sobre `@base-ui/react` (NÃO Radix)
- **Postgres 17** + **Drizzle ORM** (`postgres.js`)
- **Auth própria**: cookie JWT assinado (`jose`), senha com scrypt
- **Imagens**: upload → `sharp` (WebP, 2560px, sem EXIF) → disco em `UPLOADS_DIR`
- **Lucide React** para ícones

## Mapa do Projeto

```text
app/
  page.tsx                  # Home (SSR, depoimentos aprovados)
  portfolio/                # SSR paginado (5/página) + carrossel de fotos
  actions/testimonials.ts   # Server Action pública: enviar depoimento
  admin/page.tsx            # Login (chama admin/actions.ts)
  admin/actions.ts          # login / logout
  admin/dashboard/          # Abas: portfolio | testimonials; actions.ts = escritas do admin
  api/admin/uploads/        # POST de imagem (sharp) — só admin
  uploads/[...path]/        # GET: serve as fotos de UPLOADS_DIR (cache imutável)
  sitemap.ts, robots.ts     # SEO
components/
  layout/                   # header, footer, conditional-layout (esconde em /admin)
  ui/                       # primitivos shadcn/base-ui
  testimonial-form.tsx      # Formulário público de depoimento
lib/
  db/schema.ts, db/index.ts # Tabelas Drizzle e cliente (server-only)
  auth.ts, session.ts, password.ts  # Sessão, JWT e hash de senha
  images.ts                 # Pipeline sharp + remoção de arquivos
  queries.ts                # Leituras públicas (testimonials, projects)
  types.ts                  # Project, Testimonial
  site-config.ts            # Contato, CAU, URL do site, WhatsApp
  utils.ts                  # cn(), getErrorMessage()
proxy.ts                    # Protege /admin/dashboard/** (valida o cookie)
drizzle/                    # Migrations geradas
compose.dev.yml             # Postgres de dev
run                         # Script de dev (ver Comandos)
```

## Banco de Dados

| Tabela | Colunas principais |
|---|---|
| `projects` | id, title, description, image_url, image_urls (text[]), tags (text[]), display_order, created_at |
| `testimonials` | id, client_name, text, is_approved, created_at |

Mudou o schema? Edite `lib/db/schema.ts`, rode `npm run db:generate` e `npm run db:migrate`. Detalhes → skill `milar-database`.

## Variáveis de Ambiente

Modelo em `.env.example`. Em dev o `./run` gera `.env.development.local` sozinho.
Obrigatórias: `DATABASE_URL`, `SESSION_SECRET` (≥32 chars), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `UPLOADS_DIR`.
`NEXT_PUBLIC_SITE_URL` para sitemap/OG.
