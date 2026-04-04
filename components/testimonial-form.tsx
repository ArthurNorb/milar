"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertCircle, ArrowRight, Quote } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TestimonialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!acceptTerms) {
      setError("Por favor, aceite os termos de privacidade.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const clientName = formData.get("client_name") as string;
    const text = formData.get("text") as string;

    const { error: submitError } = await supabase.from("testimonials").insert([
      {
        client_name: clientName,
        text: text,
        is_approved: false,
      },
    ]);

    setIsSubmitting(false);

    if (submitError) {
      setError("Ocorreu um erro ao enviar. Tente novamente mais tarde.");
      console.error(submitError);
    } else {
      setIsSuccess(true);
      event.currentTarget.reset();
      setAcceptTerms(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-16 space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-[#bfa086] blur-xl opacity-20 rounded-full" />
          <div className="h-20 w-20 bg-[#e3d9ce] border border-[#bfa086]/30 rounded-full flex items-center justify-center relative z-10 shadow-sm">
            <Quote className="h-8 w-8 text-[#87381e]" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl md:text-4xl font-serif text-[#2e3d30] tracking-tight">
            Muito obrigado.
          </h3>
          <p className="text-[#756d47] font-light text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            Seu relato foi recebido com carinho. Ele é a prova de que espaços
            transformam vidas.
          </p>
        </div>
        <Button
          variant="ghost"
          className="mt-4 text-[10px] font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:bg-transparent hover:text-[#2e3d30] transition-colors group"
          onClick={() => setIsSuccess(false)}
        >
          Escrever outro relato
          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-2">
      {error && (
        <Alert
          variant="destructive"
          className="border-red-900/20 text-red-900 bg-red-50/50 rounded-2xl"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <div className="space-y-2 relative group">
          <Label
            htmlFor="client_name"
            className="text-[10px] font-['Spartan'] tracking-[0.2em] uppercase text-[#756d47] group-focus-within:text-[#87381e] transition-colors"
          >
            Seu nome ou iniciais
          </Label>
          <Input
            id="client_name"
            name="client_name"
            required
            maxLength={50}
            placeholder="Ex: Mariana, Cliente Apt 201..."
            className="bg-transparent border-0 border-b-2 border-[#bfa086]/30 rounded-none px-0 py-2 text-lg md:text-xl text-[#2e3d30] placeholder:text-[#bfa086]/50 focus-visible:ring-0 focus-visible:border-[#87381e] transition-colors shadow-none"
          />
        </div>

        <div className="space-y-2 relative group">
          <div className="flex justify-between items-end mb-2">
            <Label
              htmlFor="text"
              className="text-[10px] font-['Spartan'] tracking-[0.2em] uppercase text-[#756d47] group-focus-within:text-[#87381e] transition-colors"
            >
              Sua experiência
            </Label>
            <span className="text-[10px] text-[#bfa086]">Máx. 500</span>
          </div>
          <Textarea
            id="text"
            name="text"
            required
            maxLength={500}
            placeholder="Conte como o projeto desenhado pela Milar mudou a sua rotina e o seu bem-estar..."
            className="bg-[#bfa086]/5 border border-[#bfa086]/20 rounded-2xl px-4 py-4 text-base text-[#2e3d30] placeholder:text-[#756d47]/40 focus-visible:ring-1 focus-visible:ring-[#87381e] focus-visible:border-[#87381e] min-h-[140px] resize-none transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-[#bfa086]/10 p-3 rounded-2xl border border-[#bfa086]/20">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          className="border-[#87381e]/40 data-[state=checked]:bg-[#87381e] data-[state=checked]:border-[#87381e] data-[state=checked]:text-[#e3d9ce] h-4 w-4 rounded transition-all shrink-0"
        />
        {/* Aqui está a mágica: transform scale-[0.85] origin-left */}
        <div className="flex-1 overflow-hidden">
          <Label
            htmlFor="terms"
            className="text-xs font-light text-[#756d47] leading-tight cursor-pointer block transform scale-[0.85] origin-left w-[115%]"
          >
            Li e concordo com a exibição deste relato e os{" "}
            <Dialog>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    className="font-medium text-[#87381e] hover:text-[#2e3d30] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#87381e]/30 hover:after:bg-[#2e3d30]"
                    onClick={(e) => e.stopPropagation()}
                  />
                }
              >
                Termos de Privacidade
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:max-w-md bg-[#e3d9ce] text-[#2e3d30] border-none rounded-[2rem] p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader className="mb-6 border-b border-[#bfa086]/20 pb-4">
                  <DialogTitle className="font-serif text-3xl text-[#2e3d30]">
                    Privacidade
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 text-sm font-light text-[#756d47] leading-relaxed">
                  <p>
                    <strong className="text-[#2e3d30] font-medium block mb-1">
                      1. Coleta e Uso de Dados
                    </strong>
                    Coletamos apenas o nome (ou iniciais) informado e o texto do
                    relato. Não exigimos dados sensíveis.
                  </p>
                  <p>
                    <strong className="text-[#2e3d30] font-medium block mb-1">
                      2. Finalidade
                    </strong>
                    O depoimento será enviado para nossa base de dados e, se
                    aprovado pela arquiteta Giovanna Lima, será exibido
                    publicamente na seção de "Feedbacks" do site.
                  </p>
                  <p>
                    <strong className="text-[#2e3d30] font-medium block mb-1">
                      3. Consentimento
                    </strong>
                    Ao clicar em enviar, você concede à Milar Arquitetura o
                    direito de exibir seu relato como demonstração de prova
                    social.
                  </p>
                  <p>
                    <strong className="text-[#2e3d30] font-medium block mb-1">
                      4. Direito de Remoção
                    </strong>
                    Caso deseje que um depoimento seu seja removido do site a
                    qualquer momento, entre em contato através de nossos canais
                    oficiais e a exclusão será feita imediatamente.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !acceptTerms}
        className="w-full bg-[#2e3d30] hover:bg-[#87381e] text-[#e3d9ce] h-14 rounded-full transition-all duration-500 font-['Spartan'] tracking-[0.2em] text-[10px] md:text-xs uppercase shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {isSubmitting ? "Enviando relato..." : "Enviar Depoimento"}
      </Button>
    </form>
  );
}
