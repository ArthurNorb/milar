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
- **Resend** (`resend` SDK) — envio de emails transacionais
- **Lucide React** para ícones

## Estrutura de Arquivos Relevantes
```
app/
  page.tsx                        # Home (SSR, busca testimonials)
  layout.tsx                      # Root layout, fontes
  globals.css                     # Tokens CSS (cores, fontes) — NÃO alterar
  portfolio/page.tsx              # SSR, busca projects
  curriculum/page.tsx             # SSR, busca curriculum + CV
  simulador/page.tsx              # Client, formulário multi-step "Quero um Projeto" (5 steps + review + success)
  simulador/layout.tsx            # Layout e metadata do simulador
  simulador/_components/
    ambientes-selector.tsx        # Chips com quantidade (+/−) por ambiente
    style-matrix.tsx              # Matriz de estilos (desktop tabular / mobile cards)
    importance-rank.tsx           # RadioGroup 1–3 por critério de importância
    review-section.tsx            # Resumo elegante de todas as respostas
  admin/page.tsx                  # Login Supabase Auth
  admin/dashboard/page.tsx        # Tabs: portfolio | testimonials | curriculum | solicitações
  admin/dashboard/portfolio-manager.tsx
  admin/dashboard/testimonials-manager.tsx
  admin/dashboard/curriculum-manager.tsx
  admin/dashboard/solicitacoes-manager.tsx  # Mini-dashboard + lista de solicitações de projeto
  admin/dashboard/layout.tsx
  api/simulacao/route.ts          # POST — valida, persiste no Supabase, envia email via Resend
  api/simulacao/upload/route.ts   # POST — upload de arquivo para bucket orcamento-uploads (service role)
  api/admin/orcamento/[id]/signed-url/route.ts  # GET protegido — gera signed URL de 1h para anexo
  auth/signout/route.ts           # Logout
components/
  layout/header.tsx               # Botão "Quero um Projeto" → /simulador
  layout/footer.tsx
  layout/conditional-layout.tsx   # Esconde header/footer em /admin
  testimonial-form.tsx            # Formulário público de depoimento
  ui/
    radio-group.tsx               # Wrapper @base-ui/react RadioGroup, estilo Milar
    slider.tsx                    # Wrapper @base-ui/react Slider (Root/Control/Track/Indicator/Thumb)
    multi-select-chips.tsx        # Chips toggleáveis — recebe options/value/onChange
    file-upload.tsx               # Drag-and-drop + preview; envia para /api/simulacao/upload
    stepper.tsx                   # Header de progresso (Progress + bullets numerados)
lib/
  supabase.ts                     # Cliente browser (createBrowserClient)
  supabase-server.ts              # Cliente server (createServerClient + cookies)
  utils.ts                        # cn()
  orcamento-types.ts              # Tipos compartilhados: OrcamentoFormData, AmbienteItem, etc.
  email-template.ts               # buildEmailHtml() e buildConfirmationEmailHtml()
middleware.ts                     # Proteção de rotas /admin
supabase-schema.sql               # Schema completo (tabelas, RLS, buckets, policies)
```

## Banco de Dados (Supabase)
Schema completo em `supabase-schema.sql`:

| Tabela | Colunas principais |
|---|---|
| `projects` | id, title, description, image_url, tags (text[]), created_at |
| `curriculum` | id, type ('education'\|'experience'\|'skill'), title, description, start_year, end_year |
| `testimonials` | id, client_name, text, is_approved (bool), created_at |
| `orcamento_solicitacoes` | id (uuid), created_at, status (enum), nome, email, telefone, tipo_projeto, tipo_imovel, ambientes (jsonb), investimento, estilos (jsonb), referencias (jsonb), prazo_data, aceite_minimo, aceite_lgpd, … |

**Status enum:** `nova` | `em_contato` | `concluida` | `descartada`

**Storage buckets:**
- `project-images` (público) — subpastas `projects/` e `cv/`
- `orcamento-uploads` (privado) — referências visuais dos clientes; acesso via signed URLs geradas pelo service role

**RLS em `orcamento_solicitacoes`:**
- INSERT: anon (form público)
- SELECT/UPDATE/DELETE: apenas `authenticated` (admin)

**Atenção:** Se a tabela ou o bucket ainda não existirem, rodar o bloco SQL correspondente em `supabase-schema.sql` via SQL Editor do Supabase.

## Tipos Importantes

```ts
// lib/orcamento-types.ts
interface AmbienteItem { nome: string; quantidade: number; }

interface OrcamentoFormData {
  ambientes: AmbienteItem[];   // NÃO string[] — tem quantidade por ambiente
  referencias: string[];       // paths no Storage (não URLs)
  // … demais campos
}
```

Em `solicitacoes-manager.tsx`, `ambientes` pode ser `string | AmbienteItem` (compatibilidade com registros antigos):
```ts
const nome = typeof a === "string" ? a : a.nome;
const qty  = typeof a === "string" ? 1  : a.quantidade;
```

## Padrões de Código

**Cliente Supabase:**
```ts
// Server Components / Route Handlers:
import { getSupabaseServerClient } from '@/lib/supabase-server'
const supabase = await getSupabaseServerClient()

// Client Components:
import { supabase } from '@/lib/supabase'

// Service role (storage privado / signed URLs):
import { createClient } from '@supabase/supabase-js'
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

**@base-ui/react — API correta do Slider:**
```tsx
// NÃO existe Slider.Range — a API é:
<Slider.Root><Slider.Control><Slider.Track><Slider.Indicator /><Slider.Thumb /></Slider.Track></Slider.Control></Slider.Root>
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

## Variáveis de Ambiente
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # obrigatório para uploads e signed URLs
RESEND_API_KEY=                   # obrigatório para envio de emails
RESEND_FROM_EMAIL=no-reply@milararquitetura.com
ARQUITETA_EMAIL=gioarqt.1@gmail.com
```
