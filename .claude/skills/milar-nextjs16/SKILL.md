---
name: milar-nextjs16
description: Use ao criar rotas, layouts, metadata, sitemap/robots, proxy, route handlers, loading states ou configurar next/image no projeto Milar. Next.js 16 tem mudanças que quebram o que você conhece; consulte a doc local antes de codar.
---

# Next.js 16 no Milar

**Obrigatório:** antes de usar uma API do Next, leia a doc local em `node_modules/next/dist/docs/01-app/` (o `AGENTS.md` exige isso). Seu conhecimento prévio pode estar desatualizado.

## Convenções confirmadas neste projeto
- **`proxy.ts`** (raiz) substitui `middleware.ts` (deprecado). Exporta `proxy()` e `config.matcher`; roda em Node.js. Hoje protege `/admin/dashboard/**`.
- **APIs assíncronas:** `searchParams`, `params` e `cookies()` são `Promise` — use `await`.
- **App Router:** páginas são Server Components por padrão; `"use client"` só quando precisar de estado/efeitos/eventos. `useSearchParams` exige `<Suspense>`.
- **Metadata:** `export const metadata` em páginas/layouts server. Páginas `"use client"` (ex.: `/admin`) não exportam metadata — ponha no `layout.tsx` da pasta (ver `app/admin/layout.tsx`).
- **SEO:** `app/sitemap.ts`, `app/robots.ts`, `metadataBase` em `app/layout.tsx`. URL base vem de `lib/site-config.ts` (`NEXT_PUBLIC_SITE_URL`).
- **`next/image`:** domínio remoto liberado em `next.config.ts`: `images.unsplash.com` (seed); fotos enviadas são locais em `/uploads/...`. `fill` exige `sizes`.
- **Estrutura de rotas:** `/`, `/portfolio`, `/admin`, `/admin/dashboard`, `/uploads/[...path]` (fotos), `/api/admin/uploads`.
- **Loading:** `loading.tsx` ao lado da página (existem em `/` e `/portfolio`).
- Pastas `_components/` dentro de `app/` não viram rota.

## Fluxo
1. Ler a doc relevante em `node_modules/next/dist/docs`.
2. Implementar.
3. `npm run build` para pegar erros de tipo de rota/prerender.
