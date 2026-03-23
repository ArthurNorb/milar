import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  Calculator,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#e3d9ce] flex flex-col font-sans">
      {/* Admin Header - Premium & Dark */}
      <header className="bg-[#2e3d30] text-[#e3d9ce] border-b border-[#bfa086]/20 sticky top-0 z-50 shadow-lg">
        <div className="container max-w-screen-2xl px-6 md:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#bfa086] flex items-center justify-center transition-transform group-hover:rotate-12">
                  <Image
                    src="/logotipos/Símbolo 01.png"
                    alt="Milar"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-90"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-serif leading-none">
                    Painel Milar
                  </h1>
                  <p className="font-['Spartan'] text-[9px] uppercase tracking-[0.2em] text-[#bfa086] mt-1">
                    Gestão de Neuroarquitetura
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-2 font-['Spartan'] text-[10px] uppercase tracking-widest text-[#e3d9ce]/70 hover:text-[#87381e] transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-[#243126] border-t border-[#bfa086]/10">
          <div className="container max-w-screen-2xl px-6 md:px-12 flex overflow-x-auto scrollbar-hide">
            <AdminNavLink
              href="/admin/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Resumo"
            />
            <AdminNavLink
              href="/admin/portfolio"
              icon={<FolderKanban className="h-4 w-4" />}
              label="Portfólio"
            />
            <AdminNavLink
              href="/admin/testimonials"
              icon={<MessageSquare className="h-4 w-4" />}
              label="Depoimentos"
            />
            <AdminNavLink
              href="/admin/curriculum"
              icon={<FileText className="h-4 w-4" />}
              label="Currículo"
            />
            <AdminNavLink
              href="/admin/simulations"
              icon={<Calculator className="h-4 w-4" />}
              label="Simulações"
            />
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container max-w-screen-2xl px-6 md:px-12 py-8 md:py-12 relative">
        {/* Grão de textura sutil exclusivo para o main */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none bg-repeat"
          style={{
            backgroundImage: `url('/estampas/Preenchida Micro 05.png')`,
            backgroundSize: "400px",
          }}
        />

        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="py-6 border-t border-[#bfa086]/20 text-center">
        <p className="font-['Spartan'] text-[9px] uppercase tracking-[0.3em] text-[#756d47]/60">
          Sistema de Gestão Interna · Milar Arquitetura 2026
        </p>
      </footer>
    </div>
  );
}

function AdminNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-6 py-4 text-[#e3d9ce]/60 hover:text-[#e3d9ce] border-b-2 border-transparent hover:border-[#bfa086] transition-all whitespace-nowrap group"
    >
      <span className="text-[#bfa086] group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-medium">
        {label}
      </span>
    </Link>
  );
}
