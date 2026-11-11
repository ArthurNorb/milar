import imageCompression from "browser-image-compression";

export type UploadFolder = "projects" | "blog";

// Reduz a foto no navegador antes do envio (upload rápido, mesmo no 4G).
// O servidor ainda normaliza para WebP e remove metadados.
export async function compressForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    return await imageCompression(file, {
      maxWidthOrHeight: 1920,
      maxSizeMB: 4,
      initialQuality: 0.85,
      useWebWorker: true,
    });
  } catch {
    return file; // formatos que o navegador não decodifica (ex.: HEIC) seguem originais
  }
}

/** Envia uma foto para POST /api/admin/uploads e devolve a URL pública. */
export async function uploadImage(
  file: File,
  folder: UploadFolder = "projects",
): Promise<string> {
  const body = new FormData();
  body.append("file", await compressForUpload(file));
  body.append("folder", folder);

  const response = await fetch("/api/admin/uploads", { method: "POST", body });
  const json = (await response.json().catch(() => null)) as
    | { url?: string; error?: string }
    | null;

  if (!response.ok || !json?.url) {
    throw new Error(json?.error ?? "Falha no upload.");
  }
  return json.url;
}
