// Constantes das fotos da home. Sem imports de servidor: o admin (client)
// também usa este módulo.

export type HomeImageSlot = "hero" | "about";

export type HomeImages = Record<HomeImageSlot, string>;

/** Chave de cada foto da home em `site_settings`. */
export const HOME_IMAGE_KEYS: Record<HomeImageSlot, string> = {
  hero: "home_hero_image",
  about: "home_about_image",
};

/** Fotos originais (public/), usadas enquanto nada foi enviado pelo admin. */
export const HOME_IMAGE_DEFAULTS: HomeImages = {
  hero: "/hero.png",
  about: "/gi.jpeg",
};
