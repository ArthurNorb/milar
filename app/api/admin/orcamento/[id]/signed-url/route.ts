import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase-server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticação (apenas admin)
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { path } = await request.json();

  if (!path) {
    return NextResponse.json({ error: "path obrigatório" }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Configuração de storage ausente" }, { status: 500 });
  }

  const serviceClient = getServiceClient();
  const { data, error } = await serviceClient.storage
    .from("orcamento-uploads")
    .createSignedUrl(path, 60 * 60); // 1 hora

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Erro ao gerar URL" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
