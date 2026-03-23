"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "5531971219701";
  const message =
    "Olá! Gostaria de conversar sobre um projeto com a Milar Arquitetura.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contato via WhatsApp"
        className="group flex items-center justify-center h-14 rounded-full bg-[#2e3d30] text-[#e3d9ce] px-4 shadow-xl border border-[#bfa086]/20 hover:bg-[#87381e] hover:border-[#87381e] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
      >
        <MessageCircle className="h-6 w-6 shrink-0" />

        {/* Texto que se revela suavemente no hover */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 ease-in-out group-hover:max-w-50 group-hover:opacity-100 group-hover:ml-3 font-['Spartan'] text-[10px] uppercase tracking-[0.2em] font-semibold">
          Fale com a gente
        </span>
      </a>
    </div>
  );
}
