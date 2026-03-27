import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { LogoutButton } from "@/components/ui/logout-button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#e3d9ce] flex flex-col font-sans">
      <header className="bg-[#2e3d30] text-[#e3d9ce] border-b border-[#bfa086]/20 sticky top-0 z-50 shadow-lg">
        <div className="container max-w-screen-2xl px-6 md:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="hidden sm:block">
                  <h1 className="text-xl font-serif leading-none">Painel Administrativo - Milar Arquitetura</h1>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-screen-2xl px-6 md:px-12 py-8 md:py-12 relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-repeat" style={{ backgroundImage: `url('/estampas/Preenchida Micro 05.png')`, backgroundSize: '400px' }} />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      <footer className="py-6 border-t border-[#bfa086]/20 text-center">
        <p className="font-['Spartan'] text-[9px] uppercase tracking-[0.3em] text-[#756d47]/60">
          Sistema de Gestão Interna · Milar Arquitetura 2026
        </p>
      </footer>
    </div>
  )
}