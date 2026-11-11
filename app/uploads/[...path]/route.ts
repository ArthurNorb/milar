import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { resolveUploadPath } from "@/lib/images";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Só servimos o que o pipeline gera (WebP); qualquer outra coisa é 404.
  const relative = segments.join("/");
  if (!relative.endsWith(".webp")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const full = resolveUploadPath(relative);
  if (!full) return new NextResponse("Not found", { status: 404 });

  try {
    const info = await stat(full);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });

    // Stream: o arquivo não é carregado inteiro na memória.
    const body = Readable.toWeb(createReadStream(full)) as ReadableStream;
    return new NextResponse(body, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
