import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Currículo", href: "/curriculum" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#bfa086]/20 bg-[#e3d9ce]/90 backdrop-blur-md transition-all duration-300 shadow-sm">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-6 md:px-12 mx-auto">
        {/* Identidade Visual / Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <Image
            src="/logotipos/Símbolo 01.png"
            alt="Símbolo Milar"
            width={36}
            height={36}
            className="object-contain transition-transform duration-700 group-hover:rotate-180"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-2xl font-serif tracking-wide leading-none text-[#2e3d30]">
              milar
            </span>
            <span className="text-[9px] font-['Spartan'] uppercase tracking-[0.3em] text-[#87381e] mt-1">
              Arquitetura
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-['Spartan'] uppercase tracking-[0.15em] text-[#2e3d30]/80 hover:text-[#87381e] transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#87381e] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Chamada para Ação (CTA) */}
        <div className="flex items-center">
          <Button className="bg-[#2e3d30] hover:bg-[#87381e] text-[#e3d9ce] rounded-full h-12 px-0 overflow-hidden transition-all duration-300 hover:scale-105 shadow-md border-none">
            <Link
              href="/simulador"
              className="w-full h-full flex items-center justify-center px-6 sm:px-8 font-['Spartan'] uppercase text-[10px] sm:text-xs tracking-widest"
            >
              Simular Orçamento
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
