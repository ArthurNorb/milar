import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { buildEmailHtml, buildConfirmationEmailHtml } from "@/lib/email-template";
import { OrcamentoFormData } from "@/lib/orcamento-types";

const ARQUITETA_EMAIL = process.env.ARQUITETA_EMAIL ?? "gioarqt.1@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "no-reply@milararquitetura.com";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const form = body as OrcamentoFormData & { uploadId?: string };

    // Validação server-side dos campos obrigatórios
    if (!form.nome || !form.email || !form.telefone || !form.tipoProjeto || !form.tipoImovel) {
      return NextResponse.json({ error: "Campos obrigatórios faltando (contato/imóvel)" }, { status: 400 });
    }
    if (!form.descricaoEscopo || !form.investimento || !form.moradoresQuantidade) {
      return NextResponse.json({ error: "Campos obrigatórios faltando (escopo)" }, { status: 400 });
    }
    if (!form.subjetivaSabado || !form.prazoData) {
      return NextResponse.json({ error: "Campos obrigatórios faltando (subjetivas)" }, { status: 400 });
    }
    if (!form.aceiteMinimo || !form.aceiteLgpd) {
      return NextResponse.json({ error: "Os aceites são obrigatórios" }, { status: 400 });
    }

    // Inserir no Supabase (anon key — RLS permite insert público)
    const supabase = await getSupabaseServerClient();
    const { data: record, error: dbError } = await supabase
      .from("orcamento_solicitacoes")
      .insert({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        instagram: form.instagram || null,
        tipo_projeto: form.tipoProjeto,
        tipo_imovel: form.tipoImovel,
        ambientes: form.ambientes,
        ambientes_prioritarios: form.ambientesPrioritarios,
        outros_prioritarios: form.outrosPrioritarios || null,
        descricao_escopo: form.descricaoEscopo,
        investimento: form.investimento,
        moradores_quantidade: form.moradoresQuantidade ? parseInt(form.moradoresQuantidade) : null,
        moradores_idades: form.moradoresIdades || null,
        importancia: form.importancia,
        condicao_especial: form.condicaoEspecial || null,
        cor_preferida: form.corPreferida || null,
        estilos: form.estilos,
        sustentabilidade: form.sustentabilidade,
        referencias: form.referencias,
        subjetiva_sabado: form.subjetivaSabado || null,
        subjetiva_comodo: form.subjetivaComodo || null,
        subjetiva_estilo_vida: form.subjetivaEstiloVida || null,
        subjetiva_restricoes: form.subjetivaRestricoes || null,
        subjetiva_motivacao: form.subjetivaMotivacao || null,
        prazo_data: form.prazoData || null,
        prazo_flexibilidade: form.prazoFlexibilidade || null,
        aceite_minimo: form.aceiteMinimo,
        aceite_lgpd: form.aceiteLgpd,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: `Erro ao salvar solicitação: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Gerar signed URLs para arquivos de referência (service role — bucket privado)
    const signedUrls: { path: string; url: string }[] = [];
    if (form.referencias.length > 0 && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const serviceClient = getServiceClient();
      const { data: urls } = await serviceClient.storage
        .from("orcamento-uploads")
        .createSignedUrls(form.referencias, 60 * 60 * 24 * 7); // 7 dias
      if (urls) {
        for (const item of urls) {
          if (item.signedUrl && item.path) {
            signedUrls.push({ path: item.path, url: item.signedUrl });
          }
        }
      }
    }

    // Enviar email via Resend (erro de email não bloqueia o retorno de sucesso)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: ARQUITETA_EMAIL,
          replyTo: form.email,
          subject: `Nova solicitação de projeto — ${form.nome} · ${form.tipoProjeto} ${form.tipoImovel}`,
          html: buildEmailHtml(form, signedUrls),
        });

        await resend.emails.send({
          from: FROM_EMAIL,
          to: form.email,
          subject: "Recebemos sua solicitação | Milar Arquitetura",
          html: buildConfirmationEmailHtml(form.nome),
        });
      } catch (emailErr) {
        // Loga o erro mas não falha a requisição — dados já estão salvos no Supabase
        console.error("Erro ao enviar email via Resend:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY não configurada — emails não enviados.");
    }

    return NextResponse.json({ success: true, id: record.id }, { status: 200 });
  } catch (error) {
    console.error("Erro na rota /api/simulacao:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
