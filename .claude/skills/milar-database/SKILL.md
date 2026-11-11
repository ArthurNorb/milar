---
name: milar-database
description: Use ao mexer em banco, auth, uploads de imagem, migrations, queries ou tipos no projeto Milar (Postgres + Drizzle, tabelas projects e testimonials, login do admin, lib/queries.ts, lib/types.ts, seed). Substitui o antigo Supabase.
---

# Banco, auth e imagens (sem Supabase)

## Peças
```
lib/db/schema.ts        # tabelas Drizzle (chaves em snake_case = lib/types.ts)
lib/db/index.ts         # cliente `db` (server-only, singleton em globalThis)
drizzle/                # migrations geradas — versionadas
lib/queries.ts          # leituras públicas (Server Components)
app/admin/dashboard/actions.ts   # escritas do admin (Server Actions)
app/actions/testimonials.ts      # escrita pública: submitTestimonial
lib/auth.ts             # checkCredentials, createSession, requireAdmin, isAdmin
lib/session.ts          # JWT (jose) — usável no proxy (sem server-only)
lib/password.ts         # scrypt: hashPassword / verifyPassword
lib/images.ts           # sharp + gravação/remoção em UPLOADS_DIR
app/api/admin/uploads/route.ts   # POST de 1 imagem (só admin)
app/uploads/[...path]/route.ts   # GET das fotos (só .webp, cache imutável)
```

## Regras
- **Não existe RLS.** Quem protege é o servidor: toda Server Action ou route handler de escrita do admin chama `await requireAdmin()` logo no início. O `proxy.ts` é só UX.
- Server Actions devolvem `{ ok: true, data } | { ok: false, error }` — não lance erros para o cliente (em produção a mensagem é removida).
- `lib/db` e `lib/auth.ts` importam `server-only`: nunca importe em Client Component. Scripts (`scripts/*.ts`) usam `postgres` direto e imports relativos.
- Depoimento público: `is_approved` é sempre `false` no servidor.
- Tipos: `lib/types.ts` (`Project`, `Testimonial`) bate com o schema; ao mudar coluna, atualize os dois.
- Após escrever, chame `revalidatePath("/")` / `revalidatePath("/portfolio")`.

## Mudar o schema
1. Edite `lib/db/schema.ts` (e `lib/types.ts`).
2. `npm run db:generate` → revise o SQL em `drizzle/`.
3. `npm run db:migrate` (o `./run` também aplica).
4. Nunca edite migration já aplicada; gere outra.

## Auth
- Env: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (formato `scrypt:<salt>:<hash>`, sem `$` por causa do dotenv do Next), `SESSION_SECRET` (≥32 chars).
- Gerar hash: `npm run hash-password -- "senha-forte"`.
- Cookie `milar_session`: httpOnly, sameSite=lax, secure em produção, 7 dias.

## Imagens
- Navegador reduz (`browser-image-compression`, 2560px) → `POST /api/admin/uploads` → `saveProjectImage` (rotate EXIF, sem metadados, 2560px, WebP q80) → URL `/uploads/projects/<uuid>.webp`.
- Remover foto de projeto ou excluir projeto → `deleteUploadedImages(urls)` (ignora URLs externas, ex.: Unsplash do seed).
- Pasta: `UPLOADS_DIR` (dev: `./.data/uploads`). Em produção, monte como volume e inclua no backup.
- `next/image` com `fill` exige `sizes`; fotos novas são `/uploads/...` (local, sem `remotePatterns`).
