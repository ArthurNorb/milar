import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, League_Spartan } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const spartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-spartan",
});

const title = "Milar Arquitetura | Giovanna Lima";
const description =
  "Design que toca o coração e transforma. Estética e Neuroarquitetura por Giovanna Lima, com projetos presenciais e online no Brasil e no exterior.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: siteConfig.name,
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#e3d9ce",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${spartan.variable} font-sans antialiased bg-[#e3d9ce] text-[#2e3d30] flex flex-col min-h-dvh selection:bg-[#87381e] selection:text-[#e3d9ce]`}
      >
        <div className="grain-overlay pointer-events-none" />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
