export const siteConfig = {
  name: "Milar Arquitetura",
  architect: "Giovanna Lima",
  cau: "A264844-0",
  baseCity: "Belo Horizonte, MG",
  serviceArea: "Projetos no Brasil e no exterior",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://milararquitetura.com",
  email: "gioarqt.1@gmail.com",
  phoneDisplay: "(31) 97121-9701",
  whatsappNumber: "5531971219701",
  whatsappMessage:
    "Olá! Gostaria de conversar sobre um projeto com a Milar Arquitetura.",
  instagramHandle: "@milar.arq",
  instagramUrl: "https://www.instagram.com/milar.arq/",
  projectFormUrl: "https://form.respondi.app/2jLizTkt",
} as const;

/** Link do WhatsApp. Passe `""` para abrir a conversa sem mensagem pré-preenchida. */
export const whatsappUrl = (message: string = siteConfig.whatsappMessage) =>
  message
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${siteConfig.whatsappNumber}`;
