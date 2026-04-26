import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Usa service role se disponível; caso contrário tenta com anon key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadId = formData.get("uploadId") as string | null;

    if (!file || !uploadId) {
      return NextResponse.json({ error: "file e uploadId obrigatórios" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo não permitido. Use JPG, PNG, WebP, GIF ou PDF." }, { status: 400 });
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `"${file.name}" excede ${MAX_SIZE_MB}MB.` }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${uploadId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const client = getStorageClient();
    const { error } = await client.storage
      .from("orcamento-uploads")
      .upload(path, buffer, { contentType: file.type });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { error: `Erro no storage: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ path });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: `Erro interno: ${String(err)}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();
    if (!path) return NextResponse.json({ ok: true });
    const client = getStorageClient();
    await client.storage.from("orcamento-uploads").remove([path]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
