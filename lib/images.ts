import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const UPLOADS_URL_PREFIX = "/uploads/";
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_DIMENSION = 2560;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
]);

export function getUploadsDir(): string {
  return path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "./.data/uploads");
}

/** Converte uma URL pública (/uploads/...) em caminho de disco seguro, ou null. */
export function resolveUploadPath(relative: string): string | null {
  const root = getUploadsDir();
  const full = path.resolve(root, relative);
  return full.startsWith(root + path.sep) ? full : null;
}

export function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

/**
 * Normaliza a foto: aplica a rotação do EXIF, remove metadados (GPS), limita
 * a 2560px no maior lado e converte para WebP. Retorna a URL pública.
 */
export async function saveProjectImage(input: Buffer): Promise<string> {
  const output = await sharp(input)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  const relative = path.posix.join("projects", `${randomUUID()}.webp`);
  const full = resolveUploadPath(relative);
  if (!full) throw new Error("Caminho de upload inválido.");

  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, output);
  return `${UPLOADS_URL_PREFIX}${relative}`;
}

/** Apaga arquivos locais (/uploads/...). URLs externas (ex.: Unsplash) são ignoradas. */
export async function deleteUploadedImages(urls: string[]): Promise<void> {
  await Promise.all(
    urls
      .filter((url) => url.startsWith(UPLOADS_URL_PREFIX))
      .map(async (url) => {
        const full = resolveUploadPath(url.slice(UPLOADS_URL_PREFIX.length));
        if (!full) return;
        try {
          await unlink(full);
        } catch (error: unknown) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        }
      }),
  );
}
