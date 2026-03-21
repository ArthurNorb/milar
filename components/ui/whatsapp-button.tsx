"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
  const phoneNumber = "5531971219701";
  const message = "Olá, gostaria de mais informações sobre a Milar Arquitetura.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contato via WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      </Button>
    </div>
  );
}