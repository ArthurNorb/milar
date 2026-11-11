import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  MAX_UPLOAD_BYTES,
  isAllowedMime,
  isUploadFolder,
  saveProjectImage,
} from "@/lib/images";
import { getErrorMessage } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folderField = form.get("folder") ?? "projects";
    if (!isUploadFolder(folderField)) {
      return NextResponse.json({ error: "Pasta inválida." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo ausente." }, { status: 400 });
    }
    if (!isAllowedMime(file.type)) {
      return NextResponse.json(
        { error: "Formato não suportado. Use JPG, PNG, WebP, AVIF ou HEIC." },
        { status: 415 },
      );
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Imagem maior que 15 MB." },
        { status: 413 },
      );
    }

    const url = await saveProjectImage(
      Buffer.from(await file.arrayBuffer()),
      folderField,
    );
    return NextResponse.json({ url });
  } catch (error: unknown) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: `Falha ao processar a imagem: ${getErrorMessage(error)}` },
      { status: 500 },
    );
  }
}
