import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const UPLOADS_URL_PREFIX = "/uploads/";
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MAX_DIMENSION = 1920;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
]);

/** Subpastas de UPLOADS_DIR aceitas no upload. */
export const UPLOAD_FOLDERS = ["projects", "blog"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export function isUploadFolder(value: unknown): value is UploadFolder {
  return UPLOAD_FOLDERS.includes(value as UploadFolder);
}

export function getUploadsDir(): string {
  // turbopackIgnore: caminho só conhecido em runtime; sem isso o tracing do
  // standalone copia o projeto inteiro (inclusive arquivos .env) para a imagem.
  return path.resolve(
    /*turbopackIgnore: true*/ process.cwd(),
    process.env.UPLOADS_DIR ?? "./.data/uploads",
  );
}

/** Converte uma URL pública (/uploads/...) em caminho de disco seguro, ou null. */
export function resolveUploadPath(relative: string): string | null {
  const root = getUploadsDir();
  const full = path.resolve(/*turbopackIgnore: true*/ root, relative);
  return full.startsWith(root + path.sep) ? full : null;
}

export function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

/**
 * Normaliza a foto: aplica a rotação do EXIF, remove metadados (GPS), limita
 * a 1920px no maior lado e converte para WebP. Retorna a URL pública.
 */
/** Formatos que o sharp detecta pelo conteúdo (não pelo MIME enviado pelo cliente). */
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "heif"]);
/** ~50 MP: cobre fotos de câmera e barra "bombas de descompressão". */
const MAX_INPUT_PIXELS = 50_000_000;

export class InvalidImageError extends Error {}

export async function saveProjectImage(
  input: Buffer,
  folder: UploadFolder = "projects",
): Promise<string> {
  const options = { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" } as const;

  let format: string | undefined;
  try {
    ({ format } = await sharp(input, options).metadata());
  } catch {
    throw new InvalidImageError("Arquivo não é uma imagem válida.");
  }
  if (!format || !ALLOWED_FORMATS.has(format)) {
    throw new InvalidImageError("Formato de imagem não suportado.");
  }

  const output = await sharp(input, options)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 5 })
    .toBuffer();

  const relative = path.posix.join(folder, `${randomUUID()}.webp`);
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
