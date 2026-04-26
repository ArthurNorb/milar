import { OrcamentoFormData, AmbienteItem } from "./orcamento-types";

const THEME = {
  bg: "#f5f0eb",
  surface: "#ffffff",
  primary: "#2e3d30",
  accent: "#87381e",
  text: "#4a5245",
  textLight: "#756d47",
  border: "#eae1d8"
};

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td class="mobile-stack label" style="padding:14px 16px 14px 0; vertical-align:top; font-family:Arial, sans-serif; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${THEME.textLight}; width:35%; border-bottom:1px solid ${THEME.border};">
        ${label}
      </td>
      <td class="mobile-stack value" style="padding:14px 0; vertical-align:top; font-family:Georgia, serif; font-size:15px; color:${THEME.primary}; line-height:1.6; border-bottom:1px solid ${THEME.border};">
        ${value}
      </td>
    </tr>`;
}

function section(title: string, content: string) {
  return `
    <div style="margin-bottom:40px;">
      <h2 style="margin:0 0 16px; padding-bottom:12px; border-bottom:2px solid ${THEME.primary}; color:${THEME.primary}; font-family:Georgia, serif; font-size:18px; font-weight:400; letter-spacing:0.02em;">
        ${title}
      </h2>
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        ${content}
      </table>
    </div>`;
}

function chips(items: string[]) {
  if (!items.length) return "Nenhum selecionado";
  return items.join(" <span style='color:#bfa086'>&bull;</span> ");
}

function ambientesText(items: AmbienteItem[]) {
  if (!items.length) return "Nenhum selecionado";
  return items.map((a) => (a.quantidade > 1 ? `${a.nome} (×${a.quantidade})` : a.nome)).join(" <span style='color:#bfa086'>&bull;</span> ");
}

function formatImportancia(imp: OrcamentoFormData["importancia"]) {
  const labels: Record<string, string> = {
    funcionalidade: "Funcionalidade/Layout",
    estetica: "Estética/Beleza",
    conforto: "Conforto Térmico/Acústico",
    materiaisNobres: "Materiais Nobres",
    tecnologia: "Tecnologia/Automação",
    qualidadeVida: "Qualidade de Vida",
    auxilioCondicaoFisica: "Auxílio Condição Física/Psicológica",
  };
  return Object.entries(imp)
    .map(([k, v]) => `<strong>${labels[k] ?? k}:</strong> ${v}/3`)
    .join("<br>");
}

function formatEstilos(estilos: OrcamentoFormData["estilos"]) {
  const labels: Record<string, string> = {
    minimalista: "Minimalista",
    industrial: "Industrial",
    contemporaneo: "Contemporâneo",
    classicoLuxuoso: "Clássico/Luxuoso",
    rusticoNatural: "Rústico/Natural",
    escandinavo: "Escandinavo/Nórdico",
    vintageRetro: "Vintage/Retrô",
    abertoSugestoes: "Aberto a sugestões",
  };
  return Object.entries(estilos)
    .filter(([, v]) => v !== null)
    .map(([k, v]) => `<strong>${labels[k] ?? k}:</strong> ${v}`)
    .join("<br>") || "Não avaliado";
}

function formatSignedUrls(urls: { path: string; url: string }[]) {
  if (!urls.length) return "";
  return urls
    .map(
      ({ path, url }, i) =>
        `<a href="${url}" style="display:block; margin-bottom:10px; color:${THEME.accent}; font-family:Arial, sans-serif; font-size:13px; text-decoration:none; border-bottom:1px solid ${THEME.accent}; padding-bottom:4px; max-width: max-content;">
          📎 Referência ${i + 1}: ${path.split("/").pop()}
        </a>`
    )
    .join("");
}

const EMAIL_HEAD = `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; margin: 0 !important; }
      .content { padding: 24px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .label { padding-bottom: 4px !important; border-bottom: none !important; }
      .value { padding-top: 0 !important; padding-bottom: 16px !important; }
    }
  </style>
</head>`;

export function buildEmailHtml(
  form: OrcamentoFormData,
  signedUrls: { path: string; url: string }[]
) {
  const prazoFormatado = form.prazoData
    ? new Date(form.prazoData).toLocaleDateString("pt-BR")
    : null;

  const flexLabels: Record<number, string> = {
    1: "1 — Inegociável",
    2: "2 — Pouco flexível",
    3: "3 — Moderado",
    4: "4 — Flexível",
    5: "5 — Muito flexível",
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
${EMAIL_HEAD}
<body style="margin:0; padding:0; background-color:${THEME.bg}; font-family:Georgia, serif; -webkit-font-smoothing: antialiased;">
  <div class="container" style="max-width:680px; margin:40px auto; background:${THEME.surface}; border-radius:12px; overflow:hidden; box-shadow:0 8px 32px rgba(46,61,48,0.06);">

    <!-- Header -->
    <div style="background:${THEME.primary}; padding:40px; text-align:center;">
      <p style="margin:0 0 8px; font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:#bfa086; font-family:Arial, sans-serif;">Nova solicitação de projeto</p>
      <h1 style="margin:0; font-size:28px; color:#e3d9ce; font-weight:400; letter-spacing:0.02em;">Milar Arquitetura</h1>
    </div>

    <!-- Body -->
    <div class="content" style="padding:48px 40px; color:${THEME.primary};">

      ${section(
    "1. Contato e Imóvel",
    row("Nome", form.nome) +
    row("Email", `<a href="mailto:${form.email}" style="color:${THEME.accent}; text-decoration:none;">${form.email}</a>`) +
    row("Telefone", `<a href="https://wa.me/55${form.telefone.replace(/\D/g, '')}" style="color:${THEME.accent}; text-decoration:none;">${form.telefone}</a>`) +
    row("Instagram", form.instagram ? `<a href="https://instagram.com/${form.instagram.replace("@", "")}" style="color:${THEME.accent}; text-decoration:none;">@${form.instagram.replace("@", "")}</a>` : null) +
    row("Tipo de Projeto", form.tipoProjeto) +
    row("Tipo de Imóvel", form.tipoImovel)
  )}

      ${section(
    "2. Escopo e Investimento",
    row("Ambientes", ambientesText(form.ambientes)) +
    row("Prioritários", chips(form.ambientesPrioritarios)) +
    row("Outros", form.outrosPrioritarios || null) +
    row("Escopo", form.descricaoEscopo) +
    row("Investimento", form.investimento) +
    row("Moradores", form.moradoresQuantidade ? `${form.moradoresQuantidade} pessoa(s)` : null) +
    row("Idades", form.moradoresIdades || null)
  )}

      ${section(
    "3. Preferências e Estilo",
    row("Importância", formatImportancia(form.importancia)) +
    row("Condição Especial", form.condicaoEspecial || null) +
    row("Cores", form.corPreferida || null) +
    row("Estilos", formatEstilos(form.estilos)) +
    row("Sustentabilidade", `${form.sustentabilidade}/10`)
  )}

      ${section(
    "4. Subjetivas e Prazos",
    row("Sábado perfeito", form.subjetivaSabado || null) +
    row("Cômodo favorito", form.subjetivaComodo || null) +
    row("Estilo de vida", form.subjetivaEstiloVida || null) +
    row("Restrições", form.subjetivaRestricoes || null) +
    row("Motivação", form.subjetivaMotivacao || null) +
    row("Prazo ideal", prazoFormatado) +
    row("Flexibilidade", form.prazoFlexibilidade ? flexLabels[form.prazoFlexibilidade] : null)
  )}

      ${signedUrls.length > 0
      ? `<div style="margin-top:40px; padding:24px; background-color:#faf7f5; border-radius:8px; border:1px solid ${THEME.border};">
              <h2 style="margin:0 0 8px; color:${THEME.primary}; font-family:Georgia, serif; font-size:16px; font-weight:400;">Referências Visuais anexadas</h2>
              <p style="font-size:12px; font-family:Arial, sans-serif; color:${THEME.textLight}; margin:0 0 16px;">Os links abaixo expiram em 7 dias por segurança.</p>
              ${formatSignedUrls(signedUrls)}
            </div>`
      : ""
    }

    </div>

    <!-- Footer -->
    <div style="background:${THEME.bg}; padding:24px 40px; text-align:center; border-top:1px solid ${THEME.border};">
      <p style="margin:0; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${THEME.textLight}; font-family:Arial, sans-serif;">
        Responda diretamente a este email para contatar o cliente
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function buildConfirmationEmailHtml(nome: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
${EMAIL_HEAD}
<body style="margin:0; padding:0; background-color:${THEME.bg}; font-family:Georgia, serif; -webkit-font-smoothing: antialiased;">
  <div class="container" style="max-width:560px; margin:40px auto; background:${THEME.surface}; border-radius:12px; overflow:hidden; box-shadow:0 8px 32px rgba(46,61,48,0.06);">
    
    <div style="background:${THEME.primary}; padding:40px; text-align:center;">
      <p style="margin:0 0 8px; font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:#bfa086; font-family:Arial, sans-serif;">Milar Arquitetura</p>
      <h1 style="margin:0; font-size:24px; color:#e3d9ce; font-weight:400; letter-spacing:0.02em;">Recebemos seu projeto!</h1>
    </div>
    
    <div class="content" style="padding:48px 40px; color:${THEME.text}; line-height:1.8;">
      <p style="font-size:18px; color:${THEME.primary}; margin-top:0;">Olá, <strong>${nome}</strong>.</p>
      
      <p style="font-family:Arial, sans-serif; font-size:14px; margin-bottom:24px;">
        Gostaríamos de agradecer o seu contato. A arquiteta Giovanna já recebeu todas as suas respostas detalhadas e está analisando o seu perfil.
      </p>
      
      <p style="font-family:Arial, sans-serif; font-size:14px; margin-bottom:32px;">
        Entraremos em contato em até <strong style="color:${THEME.accent}; font-weight:600;">48 horas</strong> com uma proposta inicial personalizada para transformar o seu espaço.
      </p>
      
      <div style="padding:20px; background-color:#faf7f5; border-left:3px solid ${THEME.accent}; border-radius:0 8px 8px 0;">
        <p style="font-family:Arial, sans-serif; font-size:13px; color:${THEME.textLight}; margin:0;">
          Enquanto preparamos tudo por aqui, que tal se inspirar com os nossos projetos recentes? <br><br>
          <a href="https://milararquitetura.com.br" style="color:${THEME.accent}; font-weight:600; text-decoration:none;">Acessar Portfólio &rarr;</a>
        </p>
      </div>
    </div>
    
    <div style="background:${THEME.bg}; padding:24px 40px; text-align:center; border-top:1px solid ${THEME.border};">
      <p style="margin:0; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${THEME.textLight}; font-family:Arial, sans-serif;">
        Milar Arquitetura &copy; ${new Date().getFullYear()} <br> Belo Horizonte, MG
      </p>
    </div>
  </div>
</body>
</html>`;
}