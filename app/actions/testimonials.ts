"use server";

import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export type SubmitTestimonialResult = { ok: true } | { ok: false; error: string };

const MAX_NAME = 100;
const MAX_TEXT = 2000;
const MAX_PER_HOUR = 3;
const HOUR_MS = 60 * 60 * 1000;

/** Envio público: sempre entra pendente de aprovação. */
export async function submitTestimonial(
  clientName: unknown,
  text: unknown,
): Promise<SubmitTestimonialResult> {
  if (typeof clientName !== "string" || typeof text !== "string") {
    return { ok: false, error: "Preencha seu nome e o depoimento." };
  }

  const name = clientName.trim();
  const body = text.trim();

  if (!name || !body) {
    return { ok: false, error: "Preencha seu nome e o depoimento." };
  }
  if (name.length > MAX_NAME || body.length > MAX_TEXT) {
    return { ok: false, error: "Texto muito longo. Reduza e tente novamente." };
  }

  const limit = rateLimit(`testimonial:${await getClientIp()}`, MAX_PER_HOUR, HOUR_MS);
  if (!limit.ok) {
    return {
      ok: false,
      error: "Recebemos vários envios seus agora há pouco. Tente novamente mais tarde.",
    };
  }

  try {
    await db
      .insert(testimonials)
      .values({ client_name: name, text: body, is_approved: false });
    return { ok: true };
  } catch (error: unknown) {
    console.error("Erro ao salvar depoimento:", error);
    return {
      ok: false,
      error: "Ocorreu um erro ao enviar. Tente novamente mais tarde.",
    };
  }
}
