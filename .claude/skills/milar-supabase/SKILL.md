---
name: milar-supabase
description: Use ao mexer em banco, auth, RLS, Storage, migrations, queries ou tipos de dados do Supabase no projeto Milar (tabelas projects e testimonials, buckets, policies, lib/queries.ts, lib/types.ts, seed).
---

# Supabase no Milar

## Qual cliente usar
| Contexto | Import |
|---|---|
| Server Component / Route Handler | `getSupabaseServerClient()` de `@/lib/supabase-server` (async) |
| Client Component (`"use client"`) | `supabase` de `@/lib/supabase` |
| Operações privilegiadas (seed, signed URLs) | `createClient(url, SUPABASE_SERVICE_ROLE_KEY)` — **só no servidor/scripts, jamais no browser** |

## Tabelas
- `projects`: id, title, description, image_url, image_urls (text[]), tags (text[]), display_order, created_at
- `testimonials`: id, client_name, text, is_approved, created_at

Tipos TypeScript em `lib/types.ts` (`Project`, `Testimonial`). Leituras públicas do servidor ficam em `lib/queries.ts` (colunas explícitas, nunca `select("*")`).

## RLS (resumo)
- Público: SELECT em `projects`; SELECT em `testimonials` só com `is_approved = true`; INSERT em `testimonials` só com `is_approved = false`.
- `authenticated` (admin): SELECT/INSERT/UPDATE/DELETE em tudo. Os DELETE e o SELECT-all de depoimentos vêm de `supabase/migrations/2026-11-11-admin-policies.sql`.

## Storage
- `project-images` (público): subpastas `projects/` e `cv/`. URL pública → path com `/storage/v1/object/public/project-images/`. Ao excluir projeto ou remover foto, **apague também o arquivo** (ver `removeFromStorage` em `portfolio-manager.tsx`).
- `orcamento-uploads` (privado): módulo de orçamento, em descontinuação.

## Mudou o schema? Checklist
1. Criar `supabase/migrations/AAAA-MM-DD-descricao.sql` **idempotente** (`DROP POLICY IF EXISTS` antes de `CREATE POLICY`, `ADD COLUMN IF NOT EXISTS`).
2. Refletir o resultado final em `supabase-schema.sql`.
3. Atualizar `lib/types.ts` e `lib/queries.ts`.
4. Avisar o usuário que a migration precisa ser executada manualmente no SQL Editor do Supabase.

## Auth
Login por `signInWithPassword` em `/admin`. O `proxy.ts` usa `supabase.auth.getUser()` (valida o JWT) — **nunca** `getSession()` para decidir acesso.

## Erros
Em `catch`, use `unknown` e `getErrorMessage(error)` de `@/lib/utils`. Nada de `any`.
