import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#2e3d30] text-[#e3d9ce] relative overflow-hidden pt-24 pb-10 border-t-8 border-[#87381e]">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.2] mix-blend-overlay">
        <Image
          src="/estampas/Preenchida Macro 04.png"
          alt="Textura de fundo"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              <Image
                src="/logotipos/LogotipoPrincipal03.png"
                alt="Milar Arquitetura"
                width={170}
                height={170}
              />
            </div>
            <p className="text-[#e3d9ce]/70 text-base max-w-sm font-light leading-relaxed">
              Utilizo a neurociência aplicada à arquitetura para garantir que
              cada ambiente seja um catalisador de saúde, aconchego e bem-estar.
            </p>
            <div className="pt-2">
              <p className="text-[10px] font-['Spartan'] tracking-widest uppercase text-[#756d47] leading-relaxed">
                Arquiteta Giovanna Lima <br />
                CAU: A264844-0
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
            <h4 className="text-xs font-['Spartan'] font-semibold uppercase tracking-[0.2em] text-[#bfa086]">
              Navegação
            </h4>
            <nav className="flex flex-col gap-4">
              {[
                { name: "Início", path: "/" },
                { name: "Portfólio", path: "/portfolio" },
                { name: "Currículo", path: "/curriculum" },
                { name: "Simulação", path: "/simulador" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-sm text-[#e3d9ce]/80 hover:text-[#bfa086] transition-colors w-fit group flex items-center gap-3"
                >
                  <span className="w-0 h-px bg-[#bfa086] transition-all duration-300 group-hover:w-6"></span>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4 space-y-8">
            <h4 className="text-xs font-['Spartan'] font-semibold uppercase tracking-[0.2em] text-[#bfa086]">
              Conexão
            </h4>
            <div className="flex flex-col gap-5">
              <a
                href="https://wa.me/5531971219701"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 text-sm text-[#e3d9ce]/80 hover:text-[#e3d9ce] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-[#756d47] flex items-center justify-center group-hover:bg-[#87381e] group-hover:border-[#87381e] transition-all duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-light tracking-wide">
                  (31) 97121-9701
                </span>
              </a>

              <a
                href="mailto:gioarqt.1@gmail.com"
                className="inline-flex items-center gap-4 text-sm text-[#e3d9ce]/80 hover:text-[#e3d9ce] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-[#756d47] flex items-center justify-center group-hover:bg-[#87381e] group-hover:border-[#87381e] transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-light tracking-wide">
                  gioarqt.1@gmail.com
                </span>
              </a>

              <a
                href="https://www.instagram.com/milar.arq/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 text-sm text-[#e3d9ce]/80 hover:text-[#e3d9ce] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-[#756d47] flex items-center justify-center group-hover:bg-[#87381e] group-hover:border-[#87381e] transition-all duration-300">
                  <Instagram className="h-4 w-4" />
                </div>
                <span className="font-light tracking-wide">@milar.arq</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[#756d47]/30 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-['Spartan'] text-[#756d47] uppercase tracking-widest">
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Milar Arquitetura.</p>
            <p className="text-[#a39f86] mt-1">Belo Horizonte, MG</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[#a39f86] mb-2">Desenvolvido por</p>
            <a
              href="https://www.weblito.tech/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/WEBLITOTECH.png"
                alt="WebLito.tech"
                width={120}
                height={40}
                className="opacity-40 transition-all duration-300 hover:opacity-100 hover:scale-105"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
