import type { Metadata } from "next";
import { Inter, Playfair_Display, League_Spartan } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";

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

export const metadata: Metadata = {
  title: "Milar Arquitetura | Giovanna Lima",
  description:
    "Design que toca o coração e transforma. Estética e Neuroarquitetura por Giovanna Lima.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${spartan.variable} font-sans antialiased bg-[#e3d9ce] text-[#2e3d30] flex flex-col min-h-screen selection:bg-[#87381e] selection:text-[#e3d9ce]`}
      >
        <div className="grain-overlay pointer-events-none" />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
