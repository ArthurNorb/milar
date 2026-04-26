import { OrcamentoFormData, AmbienteItem } from "./orcamento-types";

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;vertical-align:top;white-space:nowrap;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#87381e;width:160px;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#2e3d30;font-weight:300;line-height:1.6;">${value}</td>
    </tr>`;
}

function section(title: string, content: string) {
  return `
    <div style="margin-bottom:28px;">
      <h2 style="margin:0 0 12px;padding:8px 14px;background:#2e3d30;color:#e3d9ce;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;border-radius:8px;">${title}</h2>
      <table style="width:100%;border-collapse:collapse;">${content}</table>
    </div>`;
}

function chips(items: string[]) {
  if (!items.length) return "Nenhum selecionado";
  return items.join(" · ");
}

function ambientesText(items: AmbienteItem[]) {
  if (!items.length) return "Nenhum selecionado";
  return items.map((a) => (a.quantidade > 1 ? `${a.nome} (×${a.quantidade})` : a.nome)).join(" · ");
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
    .map(([k, v]) => `${labels[k] ?? k}: ${v}/3`)
    .join(" | ");
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
    .map(([k, v]) => `${labels[k] ?? k}: ${v}`)
    .join(" | ") || "Não avaliado";
}

function formatSignedUrls(urls: { path: string; url: string }[]) {
  if (!urls.length) return "";
  return urls
    .map(
      ({ path, url }, i) =>
        `<a href="${url}" style="display:block;margin-bottom:6px;color:#87381e;font-size:12px;">📎 Referência ${i + 1}: ${path.split("/").pop()}</a>`
    )
    .join("");
}

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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif;">
  <div style="max-width:680px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#2e3d30;padding:32px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#bfa086;font-family:Arial,sans-serif;">Nova solicitação de projeto</p>
      <h1 style="margin:0;font-size:28px;color:#e3d9ce;font-weight:300;letter-spacing:0.02em;">Milar Arquitetura</h1>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;color:#2e3d30;">

      ${section(
        "1. Contato e Imóvel",
        row("Nome", form.nome) +
          row("Email", `<a href="mailto:${form.email}" style="color:#87381e;">${form.email}</a>`) +
          row("Telefone", `<a href="https://wa.me/55${form.telefone.replace(/\D/g, '')}" style="color:#87381e;">${form.telefone}</a>`) +
          row("Instagram", form.instagram ? `@${form.instagram.replace("@", "")}` : null) +
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

      ${
        signedUrls.length > 0
          ? `<div style="margin-bottom:28px;">
              <h2 style="margin:0 0 12px;padding:8px 14px;background:#2e3d30;color:#e3d9ce;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;border-radius:8px;">5. Referências Visuais</h2>
              <p style="font-size:12px;color:#756d47;margin:0 0 10px;">Links válidos por 7 dias</p>
              ${formatSignedUrls(signedUrls)}
            </div>`
          : ""
      }

    </div>

    <!-- Footer -->
    <div style="background:#f5f0eb;padding:20px 40px;text-align:center;border-top:1px solid #e3d9ce;">
      <p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#756d47;font-family:Arial,sans-serif;">
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
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#2e3d30;padding:32px 40px;text-align:center;">
      <h1 style="margin:0;font-size:24px;color:#e3d9ce;font-weight:300;">Recebemos sua solicitação!</h1>
    </div>
    <div style="padding:36px 40px;color:#2e3d30;line-height:1.8;">
      <p style="font-size:15px;font-weight:300;">Olá, <strong>${nome}</strong>.</p>
      <p style="font-size:14px;font-weight:300;color:#756d47;">
        A Giovanna recebeu todas as suas respostas e entrará em contato em até <strong style="color:#87381e;">48 horas</strong>
        com uma proposta personalizada para o seu projeto.
      </p>
      <p style="font-size:13px;font-weight:300;color:#bfa086;margin-top:24px;">
        Enquanto isso, conheça nosso portfólio em <a href="https://milararquitetura.com.br" style="color:#87381e;">milararquitetura.com.br</a>
      </p>
    </div>
    <div style="background:#f5f0eb;padding:16px 40px;text-align:center;">
      <p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#756d47;font-family:Arial,sans-serif;">
        Milar Arquitetura · Belo Horizonte, MG
      </p>
    </div>
  </div>
</body>
</html>`;
}
