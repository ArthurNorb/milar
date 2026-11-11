---
name: milar-verify
description: Use antes de dar uma tarefa do Milar como concluída ou de sugerir mensagem de commit. Checklist de typecheck, lint, build e smoke test das rotas, com lembrete de migrations pendentes.
---

# Verificação antes de concluir

Nunca declare "pronto" sem ter rodado e lido a saída dos comandos abaixo.

## 1. Comandos (na raiz)
```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (módulo de orçamento está ignorado)
npm run build       # precisa de NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Sem `.env.local`, rode o build com valores fictícios:
`NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy npm run build`

Se o typecheck reclamar de rotas inexistentes em `.next/types`, apague `.next/` e rode de novo (cache antigo).

## 2. Smoke test manual (`npm run dev`)
- `/` — hero, seção "A Arquiteta", depoimentos (com e sem aprovados), enviar depoimento (form reseta sem erro no console)
- `/portfolio` e `/portfolio?page=2` — carrossel, paginação
- `/admin` — login; `/admin/dashboard` deslogado redireciona; abas mudam `?tab=`; logout
- `/robots.txt` e `/sitemap.xml`

## 3. Conferências
- Nenhuma classe Tailwind/cor/fonte alterada sem pedido (`git diff` nos arquivos de UI).
- Nenhum `any` novo; nenhum dado de contato hardcoded fora de `lib/site-config.ts`.
- Mudou schema? Há migration em `supabase/migrations/` **e** aviso ao usuário para executá-la no SQL Editor.

## 4. Entrega
Resuma o que foi feito e o que foi verificado (ou não). **Não commite.** Termine com a mensagem de commit sugerida: uma linha, resumida, prefixo `feat:`, `fix:`, `refactor:`, `chore:` ou `doc:`.
