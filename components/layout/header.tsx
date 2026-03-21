import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Currículo", href: "/curriculum" },
  { label: "Simulador", href: "/simulador" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-heading font-semibold tracking-tight">
              Milar Arquitetura
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button size="sm" className="font-medium">
            <Link href="/simulador">
              Faça a simulação do seu orçamento agora
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}