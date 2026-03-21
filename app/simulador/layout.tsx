import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Simulador de Orçamento | Milar Arquitetura",
  description: "Descubra o investimento para transformar seu ambiente com neuroarquitetura.",
};

export default function SimulatorLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}