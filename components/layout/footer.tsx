import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/20 bg-background">
      <div className="container max-w-screen-2xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold">
              Milar Arquitetura
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Estética e Neuroarquitetura. Utilizo a neurociência aplicada à
              arquitetura para garantir que cada ambiente seja um catalisador de
              saúde e bem-estar.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Contato
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5531971219701"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                (31) 97121-9701
              </a>
              <a
                href="mailto:gioarqt.1@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                gioarqt.1@gmail.com
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @milar.arqt
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Links Rápidos
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Início
              </Link>
              <Link
                href="/portfolio"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Portfólio
              </Link>
              <Link
                href="/curriculum"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Currículo
              </Link>
              <Link
                href="/simulador"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Simulador de Orçamento
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Milar Arquitetura. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}