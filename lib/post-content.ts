import "server-only";
import sanitizeHtml from "sanitize-html";

/** Fotos do corpo do artigo só podem vir do upload do blog. */
const BLOG_IMAGE_PATTERN = /^\/uploads\/blog\/[\w-]+\.webp$/;

/**
 * Limpa o HTML gerado pelo editor antes de gravar: só tags de texto,
 * links http(s)/mailto/tel/âncora e imagens enviadas pelo próprio admin.
 */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "strong",
      "em",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    exclusiveFilter: (frame) =>
      frame.tag === "img" && !BLOG_IMAGE_PATTERN.test(frame.attribs.src ?? ""),
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//.test(href);
        const result: sanitizeHtml.Attributes = external
          ? { href, target: "_blank", rel: "noopener noreferrer" }
          : { href };
        return { tagName, attribs: result };
      },
    },
  });
}

/** URLs das fotos locais usadas no corpo do artigo. */
export function extractPostImageUrls(html: string): string[] {
  const urls = new Set<string>();
  for (const match of html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) {
    if (BLOG_IMAGE_PATTERN.test(match[1])) urls.add(match[1]);
  }
  return [...urls];
}

/** Texto puro do HTML (para validar se o corpo está vazio). */
export function postPlainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
