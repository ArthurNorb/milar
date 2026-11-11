---
name: milar-verify
description: Use antes de dar uma tarefa do Milar como concluída ou de sugerir mensagem de commit. Checklist de typecheck, lint, build e smoke test das rotas, com lembrete de migrations pendentes.
---

# Verificação antes de concluir

Nunca declare "pronto" sem ter rodado e lido a saída dos comandos abaixo.

## 1. Comandos (na raiz)
```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # precisa de DATABASE_URL e SESSION_SECRET (≥32 chars) no ambiente
```
O `./run` gera `.env.development.local`, que o Next carrega no build. Sem ele, use valores fictícios:
`DATABASE_URL=postgres://x:x@127.0.0.1:1/x SESSION_SECRET=$(printf 'x%.0s' {1..40}) npm run build`

Se o typecheck reclamar de rotas inexistentes em `.next/types`, apague `.next/` e rode de novo (cache antigo).

## 2. Smoke test manual (`npm run dev`)
- `/` — hero, seção "A Arquiteta", depoimentos (com e sem aprovados), enviar depoimento (form reseta sem erro no console)
- `/portfolio` e `/portfolio?page=2` — carrossel, paginação
- `/admin` — login (dev: admin@milar.local / milar-dev); `/admin/dashboard` deslogado redireciona; abas mudam `?tab=`; logout
- Admin: criar projeto com foto grande → arquivo `.webp` em `.data/uploads/projects/`; editar/remover foto e excluir projeto apagam o arquivo; reordenar persiste
- `/robots.txt` e `/sitemap.xml`

## 3. Conferências
- Nenhuma classe Tailwind/cor/fonte alterada sem pedido (`git diff` nos arquivos de UI).
- Nenhum `any` novo; nenhum dado de contato hardcoded fora de `lib/site-config.ts`.
- Mudou schema? Há migration nova em `drizzle/` (`npm run db:generate`) e `lib/types.ts` está em sincronia.
- Toda action/route de escrita do admin chama `requireAdmin()`.

## 4. Entrega
Resuma o que foi feito e o que foi verificado (ou não). **Não commite.** Termine com a mensagem de commit sugerida: uma linha, resumida, prefixo `feat:`, `fix:`, `refactor:`, `chore:` ou `doc:`.
