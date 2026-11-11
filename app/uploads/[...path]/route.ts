import { readFile } from "node:fs/promises";
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
    const file = await readFile(full);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
