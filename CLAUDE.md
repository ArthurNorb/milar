# Milar Arquitetura — Guia para Claude Code

Site de portfólio e captação da arquiteta Giovanna Lima (neuroarquitetura). Next.js 16 + Supabase.

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
- **Módulo de orçamento está em descontinuação** — não corrigir nem melhorar:
  `app/solicitar-projeto/**`, `app/api/simulacao/**`, `app/api/admin/orcamento/**`,
  `solicitacoes-manager.tsx`, `lib/orcamento-types.ts`, `lib/email-template.ts`

## Quando usar cada skill

Invoque a skill do tópico **antes** de editar:

- **Mexer em UI, componentes, classes Tailwind, cores, fontes ou imagens** → `milar-design-system`
- **Mexer em banco, auth, RLS, Storage, migrations, queries ou tipos** → `milar-supabase`
- **Criar rota, layout, metadata, sitemap/robots, proxy ou route handler** → `milar-nextjs16`
- **Mexer no painel `/admin` ou adicionar uma aba/gerenciador** → `milar-admin`
- **Antes de dizer que terminou ou sugerir a mensagem de commit** → `milar-verify`

## Comandos

```bash
npm run dev         # servidor de desenvolvimento
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (ignora o módulo de orçamento)
npm run build       # build de produção
npm run seed        # popula projetos/depoimentos (usa .env.local + service role)
```

## Stack

- **Next.js 16** (App Router, `proxy.ts`) + **TypeScript** estrito
- **Tailwind CSS v4** + **Shadcn UI** sobre `@base-ui/react` (NÃO Radix)
- **Supabase** (auth + DB + storage) via `@supabase/ssr`
- **Lucide React** para ícones

## Mapa do Projeto

```text
app/
  page.tsx                  # Home (SSR, depoimentos aprovados)
  portfolio/                # SSR paginado (5/página) + carrossel de fotos
  admin/page.tsx            # Login
  admin/dashboard/          # Abas: portfolio | testimonials (+ solicitações, em descontinuação)
  auth/signout/route.ts     # Logout server-side
  sitemap.ts, robots.ts     # SEO
components/
  layout/                   # header, footer, conditional-layout (esconde em /admin)
  ui/                       # primitivos shadcn/base-ui
  testimonial-form.tsx      # Formulário público de depoimento
lib/
  supabase.ts               # Cliente browser
  supabase-server.ts        # Cliente server (cookies)
  queries.ts                # Leituras públicas (testimonials, projects)
  types.ts                  # Project, Testimonial
  site-config.ts            # Contato, CAU, URL do site, WhatsApp
  utils.ts                  # cn(), getErrorMessage()
proxy.ts                    # Protege /admin/dashboard/**
supabase-schema.sql         # Schema completo
supabase/migrations/        # Migrations incrementais (rodar no SQL Editor)
```

## Banco de Dados

| Tabela | Colunas principais |
|---|---|
| `projects` | id, title, description, image_url, image_urls (text[]), tags (text[]), display_order, created_at |
| `testimonials` | id, client_name, text, is_approved, created_at |

Buckets: `project-images` (público). Detalhes de RLS, migrations e Storage → skill `milar-supabase`.

## Variáveis de Ambiente

Modelo em `.env.example`. Obrigatórias: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
`SUPABASE_SERVICE_ROLE_KEY` só para seed/servidor. `NEXT_PUBLIC_SITE_URL` para sitemap/OG.
