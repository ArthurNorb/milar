# Milar Arquitetura — Guia para Claude Code

## Regras Críticas
- **NUNCA leia ou liste a pasta `public/`** — contém imagens pesadas, é irrelevante para código
- **NÃO altere estilos, cores, fontes ou layout do frontend** — o design está finalizado
- Só toque em arquivos de UI se a tarefa exigir explicitamente uma mudança funcional de componente
- Sempre use TypeScript estrito; nunca use `any` sem justificativa

## Stack
- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **Shadcn UI** (base: `@base-ui/react`, NÃO Radix)
- **Supabase** (auth + DB + storage) via `@supabase/ssr`
- **Lucide React** para ícones

## Estrutura de Arquivos Relevantes
```
app/
  page.tsx                        # Home (SSR, busca testimonials)
  layout.tsx                      # Root layout, fontes
  globals.css                     # Tokens CSS (cores, fontes) — NÃO alterar
  portfolio/page.tsx              # SSR, busca projects
  curriculum/page.tsx             # SSR, busca curriculum + CV
  simulador/page.tsx              # Client, formulário multi-step
  simulador/layout.tsx            # Layout do simulador
  admin/page.tsx                  # Login Supabase Auth
  admin/dashboard/page.tsx        # Tabs: portfolio | testimonials | curriculum
  admin/dashboard/portfolio-manager.tsx
  admin/dashboard/testimonials-manager.tsx
  admin/dashboard/curriculum-manager.tsx
  admin/dashboard/layout.tsx
  api/simulacao/route.ts          # POST endpoint do simulador
  auth/signout/route.ts           # Logout
components/
  layout/header.tsx
  layout/footer.tsx
  layout/conditional-layout.tsx   # Esconde header/footer em /admin
  testimonial-form.tsx            # Formulário público de depoimento
  ui/                             # Componentes Shadcn customizados
lib/
  supabase.ts                     # Cliente browser (createBrowserClient)
  supabase-server.ts              # Cliente server (createServerClient + cookies)
  utils.ts                        # cn()
middleware.ts                     # Proteção de rotas /admin
```

## Banco de Dados (Supabase)
Três tabelas — ver schema completo em `supabase-schema.sql`:

| Tabela | Colunas principais |
|---|---|
| `projects` | id, title, description, image_url, tags (text[]), created_at |
| `curriculum` | id, type ('education'\|'experience'\|'skill'), title, description, start_year, end_year |
| `testimonials` | id, client_name, text, is_approved (bool), created_at |

**Storage:** bucket `project-images` (público) — subpastas `projects/` e `cv/`

## Padrões de Código

**Cliente Supabase:**
```ts
// Server Components / Route Handlers:
import { getSupabaseServerClient } from '@/lib/supabase-server'
const supabase = await getSupabaseServerClient()

// Client Components:
import { supabase } from '@/lib/supabase'
```

**Cores do design (apenas referência, não alterar):**
- Fundo: `#e3d9ce` | Verde escuro: `#2e3d30` | Terracota: `#87381e` / `#c3532e`
- Dourado: `#bfa086` | Cinza quente: `#756d47`

**Fontes:**
- `font-serif` / `font-heading` → Playfair Display
- `font-sans` → Inter
- `font-['Spartan']` → League Spartan (labels, badges, botões)

## Auth
- Login via `supabase.auth.signInWithPassword` em `/admin`
- Middleware em `middleware.ts` protege `/admin/dashboard/**`
- Logout via POST `/auth/signout` (redireciona para `/admin`)

## Variáveis de Ambiente Necessárias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## O Que NÃO Existe Ainda (futuro)
- Integração real com Resend (emails)
- Blog/News
- Dark mode
- Filtro de projetos por categoria