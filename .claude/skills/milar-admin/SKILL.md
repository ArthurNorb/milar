---
name: milar-admin
description: Use ao alterar o painel administrativo do Milar (/admin, /admin/dashboard, portfolio-manager, testimonials-manager, abas, login, logout, proteção de rotas) ou ao adicionar uma nova seção gerenciável.
---

# Painel Admin

## Arquivos
```
app/admin/layout.tsx            # metadata noindex (sem UI)
app/admin/page.tsx              # login (client)
app/admin/dashboard/layout.tsx  # header/footer do painel
app/admin/dashboard/page.tsx    # abas, tab ativa em ?tab=
app/admin/dashboard/portfolio-manager.tsx
app/admin/dashboard/testimonials-manager.tsx
app/admin/actions.ts            # login / logout (Server Actions)
app/admin/dashboard/actions.ts  # escritas do admin (Server Actions, requireAdmin)
components/ui/logout-button.tsx # chama logout()
proxy.ts                        # protege /admin/dashboard/** (valida cookie)
```

## Padrões dos managers
- Client Component que chama as Server Actions de `dashboard/actions.ts` (cada uma faz `requireAdmin()`); uploads vão por `POST /api/admin/uploads`.
- Estado de feedback: `message: { type: "success" | "error"; text: string } | null`, exibido com `<Alert variant="success" | "destructive">`.
- Loading por ação (`actionLoading: number | null`) e `Loader2` animado; botões `disabled` durante a ação.
- Exclusão sempre com `confirm(...)` antes e atualização otimista do estado local.
- Erros: `catch (error: unknown)` + `getErrorMessage(error)`. Sem `any`.
- Tipos de `lib/types.ts`; não redeclare `Project`/`Testimonial` localmente.
- Fetch inicial em `useEffect` com `eslint-disable-next-line react-hooks/set-state-in-effect` justificado.
- Projeto removido ou foto retirada → o servidor apaga o arquivo do disco (`deleteUploadedImages`, dentro da action).

## Adicionar uma nova aba/seção
1. Criar `app/admin/dashboard/<nome>-manager.tsx` seguindo os padrões acima.
2. Em `dashboard/page.tsx`: incluir o id em `Tab`/`TABS`, um `<TabButton type="button" ...>` e a renderização condicional.
3. Se precisar de tabela: seguir a skill `milar-database` (schema Drizzle + migration + action com `requireAdmin()`).
4. Não alterar o visual de abas/cards existentes — copie as classes.

## Auth e proteção
- `proxy.ts` redireciona visitante sem sessão para `/admin` e usuário logado de `/admin` para `/admin/dashboard`, validando o cookie de sessão (`lib/session.ts`).
- A proteção real é o `requireAdmin()` em cada action/route; o proxy é só UX. Nunca confie apenas nele.
- `/admin/**` é `noindex` e bloqueado em `robots.ts`.
