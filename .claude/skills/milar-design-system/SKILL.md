---
name: milar-design-system
description: Use ao criar ou editar qualquer componente de UI, página ou classe Tailwind do projeto Milar (cores, fontes, botões, dialogs, formulários, componentes em components/ui). Define tokens do design, padrões do @base-ui/react e a regra de NÃO alterar o visual.
---

# Design System Milar

## Regra de ouro
O design está **finalizado**. Não altere cores, fontes, espaçamentos, raios ou layout. Só mexa em JSX/classes quando a tarefa exigir uma mudança **funcional** e, nesse caso, mantenha as classes visuais idênticas.

## Tokens (referência, não alterar)
| Uso | Valor |
|---|---|
| Fundo | `#e3d9ce` |
| Verde escuro (texto/fundos escuros) | `#2e3d30` |
| Terracota | `#87381e` (principal) / `#c3532e` (destaque) |
| Dourado | `#bfa086` |
| Cinza quente | `#756d47` |

Fontes: `font-serif`/`font-heading` → Playfair Display; `font-sans` → Inter; `font-['Spartan']` → League Spartan (labels, badges, botões). Os tokens ficam em `app/globals.css` — não editar.

## Base UI (NÃO é Radix)
Os componentes de `components/ui/` envolvem `@base-ui/react`.

- **Botão como link:** `<Button render={<Link href="/x" />} nativeButton={false}>Texto</Button>`. Nunca aninhe `<a>` dentro de `<button>`.
- **Estados:** use `data-checked:`, `data-disabled:` etc. **Não** use `data-[state=checked]` (isso é Radix e não funciona).
- **Dialog:** `DialogTrigger` aceita `render={<Button ... />}`.
- **Slider:** `Slider.Root > Control > Track > Indicator + Thumb`. Não existe `Slider.Range`.
- Novos componentes shadcn: `npx shadcn@latest add <nome>` (config em `components.json`), depois confira se o wrapper usa base-ui.

## Inventário ativo (`components/ui/`)
alert, avatar, badge, button, card, checkbox, dialog, input, label, logout-button, progress, select, textarea, whatsapp-button.
Usados só pelo módulo de orçamento (em descontinuação): file-upload, stepper, slider, radio-group, multi-select-chips — não evoluir.

## Imagens
`next/image` com `fill` exige `sizes`. Use `priority` apenas no que aparece acima da dobra (hero); texturas decorativas não levam `priority`. **Nunca ler/listar `public/`.**

## Dados de contato
Telefone, e-mail, Instagram, CAU e WhatsApp vêm de `lib/site-config.ts` — não hardcode em componentes.
