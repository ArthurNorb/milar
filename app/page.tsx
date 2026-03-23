import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, ArrowRight, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import TestimonialForm from "@/components/testimonial-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

async function getApprovedTestimonials() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar depoimentos:", error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const testimonials = await getApprovedTestimonials();

  return (
    <div className="flex flex-col min-h-screen bg-[#e3d9ce] text-[#2e3d30] overflow-hidden selection:bg-[#87381e] selection:text-[#e3d9ce]">
      {/* HERO SECTION - Responsiva e Imersiva */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-28 pb-16 md:pt-20 md:pb-12 bg-[#2e3d30] text-[#e3d9ce] rounded-b-[2.5rem] md:rounded-b-[5rem] shadow-2xl z-20">
        {/* Textura de Fundo Orgânica */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <Image
            src="/estampas/Preenchida Macro 01.png"
            alt="Textura Orgânica"
            fill
            className="object-cover animate-[pulse_10s_ease-in-out_infinite]"
          />
        </div>

        <div className="container max-w-screen-2xl px-5 md:px-12 mx-auto grid lg:grid-cols-12 gap-10 md:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 md:space-y-8 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[#bfa086]/30 bg-[#756d47]/20 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#bfa086]" />
              <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.2em] uppercase text-[#bfa086]">
                Neuroarquitetura Aplicada
              </span>
            </div>

            <h1 className="text-[2.75rem] leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight">
              Design que <br />
              <span className="italic text-[#87381e] font-light">
                toca o coração
              </span>{" "}
              <br className="hidden sm:block" />e transforma.
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-[#e3d9ce]/80 max-w-lg font-light leading-relaxed">
              Elevamos o nível do seu sonho unindo estética sofisticada e
              neurociência. Cada ambiente projetado para ser um verdadeiro
              refúgio de bem-estar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 w-full sm:w-auto">
              <Button
                render={<Link href="/simulador" />}
                size="lg"
                className="w-full sm:w-auto px-8 h-14 bg-[#87381e] hover:bg-[#87381e]/80 text-[#e3d9ce] font-['Spartan'] text-xs tracking-wider uppercase rounded-full transition-transform hover:scale-105 duration-300 flex items-center justify-center shadow-lg"
              >
                Simular Orçamento
              </Button>
              <Button
                render={<Link href="/portfolio" />}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 h-14 border-[#bfa086] text-[#bfa086] hover:bg-[#bfa086] hover:text-[#2e3d30] font-['Spartan'] text-xs tracking-wider uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-2 bg-transparent"
              >
                Ver Projetos <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Imagem Hero - Oculta no mobile muito pequeno para não poluir, visível em tablets/desktop */}
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[75vh] w-full hidden sm:block group mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-[#87381e] rounded-t-full transform translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6 duration-700 ease-out" />
            <div className="relative h-full w-full rounded-t-full overflow-hidden border-4 border-[#2e3d30] shadow-2xl">
              <Image
                src="/image_4dc6a4.jpg" // Lembre-se de trocar para uma foto real do portfólio
                alt="Projeto de Arquitetura Milar"
                fill
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - Sticky Scroll & Mobile Layout */}
      <section className="py-20 md:py-40 relative z-10">
        <div className="absolute top-1/3 left-0 -translate-y-1/2 -translate-x-1/4 md:-translate-x-1/2 opacity-10 pointer-events-none">
          <Image
            src="/estampas/Contorno Macro 04.png"
            alt=""
            width={600}
            height={600}
            className="w-75 md:w-150"
          />
        </div>

        <div className="container max-w-7xl px-5 md:px-12 mx-auto">
          {/* Invertemos a ordem no mobile: Texto primeiro, Foto depois. No Desktop fica lado a lado com foto fixa. */}
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-12 md:gap-24 items-start">
            {/* Coluna da Imagem com efeito Sticky no Desktop */}
            <div className="w-full h-full relative">
              <div className="md:sticky md:top-32 relative aspect-3/4 w-[80%] md:w-full max-w-md mx-auto group">
                <div className="absolute inset-0 bg-[#756d47] rounded-b-full -rotate-6 transition-transform group-hover:rotate-0 duration-500" />
                <div className="relative h-full w-full rounded-b-full overflow-hidden bg-[#a39f86] z-10 border-[6px] md:border-8 border-[#e3d9ce]">
                  <div className="w-full h-full flex items-center justify-center text-[#2e3d30]/50 font-['Spartan'] text-xs md:text-sm tracking-widest uppercase">
                    Foto Giovanna Lima
                  </div>
                </div>
                <Image
                  src="/estampas/Contorno Micro 01.png"
                  alt=""
                  width={100}
                  height={100}
                  className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-20 opacity-80 md:w-30"
                />
              </div>
            </div>

            {/* Coluna de Texto */}
            <div className="space-y-6 md:space-y-8 pt-4 md:pt-10">
              <h2 className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#87381e]">
                A Arquiteta
              </h2>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2e3d30] leading-[1.1]">
                Muito prazer, <br />
                eu sou a{" "}
                <span className="italic text-[#756d47]">Giovanna.</span>
              </h3>

              <div className="space-y-5 md:space-y-6 text-[#2e3d30]/80 text-base md:text-lg font-light leading-relaxed">
                <p>
                  Minha paixão pela arquitetura nasceu na infância e se
                  transformou em uma carreira dedicada a servir e transformar
                  vidas. Utilizo a neurociência aplicada para moldar o
                  comportamento humano para melhor.
                </p>
                <p>
                  Com anos de experiência no mercado, deixei de entregar apenas
                  projetos para entregar soluções de vida.
                </p>
                <p className="pl-5 border-l-2 border-[#87381e] italic text-lg md:text-xl text-[#87381e]">
                  "Um projeto só faz sentido quando ele toca o coração e melhora
                  o cotidiano de acordo com a sua necessidade."
                </p>
              </div>

              <div className="pt-2 md:pt-4">
                <Button
                  render={<Link href="/curriculum" />}
                  variant="ghost"
                  className="p-0 hover:bg-transparent text-[#87381e] hover:text-[#2e3d30] font-['Spartan'] text-[10px] md:text-sm tracking-widest uppercase transition-colors group flex items-center gap-3 w-fit"
                >
                  Conheça minha trajetória
                  <span className="w-8 md:w-10 h-px bg-[#87381e] group-hover:w-16 transition-all duration-300"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Carousel Mobile & Grid Desktop */}
      <section className="py-20 md:py-32 bg-[#2e3d30] text-[#e3d9ce] relative rounded-t-[2.5rem] md:rounded-t-[5rem]">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <Image
            src="/estampas/Preenchida Micro 05.png"
            alt=""
            width={500}
            height={500}
            className="w-62.5 md:w-125"
          />
        </div>

        <div className="container max-w-7xl px-5 md:px-12 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8 border-b border-[#e3d9ce]/20 pb-8 md:pb-12">
            <div className="space-y-3 md:space-y-4 max-w-2xl">
              <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#bfa086]">
                Feedbacks
              </span>
              <h2 className="text-[2.5rem] leading-tight md:text-6xl font-serif tracking-tight">
                A experiência <br className="md:hidden" />
                <span className="italic text-[#bfa086]">Milar</span>
              </h2>
            </div>

            <Dialog>
              <DialogTrigger
                render={
                  <Button className="w-full md:w-auto bg-[#bfa086] hover:bg-[#e3d9ce] text-[#2e3d30] font-['Spartan'] uppercase text-[10px] md:text-xs tracking-wider rounded-full h-12 px-8 transition-colors flex items-center justify-center gap-2 shadow-lg" />
                }
              >
                <PenLine className="w-4 h-4" /> Deixar depoimento
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:max-w-xl bg-[#e3d9ce] border-none text-[#2e3d30] rounded-3xl p-0 overflow-hidden">
                <div className="h-2 w-full bg-[#87381e]"></div>
                <DialogHeader className="p-6 md:p-8 pb-2 md:pb-4">
                  <DialogTitle className="text-2xl md:text-3xl font-serif text-[#2e3d30]">
                    Sua casa tem a assinatura Milar?
                  </DialogTitle>
                  <DialogDescription className="text-sm md:text-base text-[#756d47] font-light mt-2">
                    Compartilhe sua experiência. Seu depoimento será enviado
                    para a Giovanna e pode aparecer aqui!
                  </DialogDescription>
                </DialogHeader>
                <div className="p-6 md:p-8 pt-0">
                  <TestimonialForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Carrossel no Mobile / Grid no Desktop */}
          {/* Adicionando padding lateral negativo no mobile para a rolagem vazar a tela e mostrar que tem mais item */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 snap-x snap-mandatory pb-8 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0 scrollbar-hide">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-[85vw] md:min-w-0 snap-center group cursor-pointer bg-[#e3d9ce]/5 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none border border-[#bfa086]/10 md:border-none"
                >
                  <Quote className="h-8 w-8 md:h-10 md:w-10 text-[#87381e] mb-4 md:mb-6 transform transition-transform group-hover:-translate-y-2 duration-300" />
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif font-light leading-snug text-[#e3d9ce] mb-6 md:mb-8">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-[#bfa086]">
                      <AvatarFallback className="bg-[#2e3d30] text-[#bfa086] font-serif text-lg">
                        {testimonial.client_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-['Spartan'] uppercase text-[10px] md:text-xs tracking-widest text-[#bfa086]">
                        {testimonial.client_name}
                      </p>
                      <p className="text-xs md:text-sm text-[#e3d9ce]/60 font-light italic mt-0.5">
                        Cliente Milar
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Depoimentos Reais do PDF (Fallback)
              <>
                <div className="min-w-[85vw] md:min-w-0 snap-center group cursor-pointer bg-[#e3d9ce]/5 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none border border-[#bfa086]/10 md:border-none">
                  <Quote className="h-8 w-8 md:h-10 md:w-10 text-[#87381e] mb-4 md:mb-6 transform transition-transform group-hover:-translate-y-2 duration-300" />
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif font-light leading-snug text-[#e3d9ce] mb-6 md:mb-8">
                    "A casa tem um abraço. Não é só decoração, tem toda uma
                    ciência por trás que você explicou. Todo mundo perguntou o
                    seu contato!"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-[#bfa086]">
                      <AvatarFallback className="bg-[#2e3d30] text-[#bfa086] font-serif text-lg">
                        F
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-['Spartan'] uppercase text-[10px] md:text-xs tracking-widest text-[#bfa086]">
                        Fernando
                      </p>
                      <p className="text-xs md:text-sm text-[#e3d9ce]/60 font-light italic mt-0.5">
                        Cliente Residencial
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-[85vw] md:min-w-0 snap-center group cursor-pointer bg-[#e3d9ce]/5 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none border border-[#bfa086]/10 md:border-none">
                  <Quote className="h-8 w-8 md:h-10 md:w-10 text-[#87381e] mb-4 md:mb-6 transform transition-transform group-hover:-translate-y-2 duration-300" />
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif font-light leading-snug text-[#e3d9ce] mb-6 md:mb-8">
                    "O clima mudou muito, o ambiente é relaxante. O foco vem
                    fácil, até a dor de cabeça passou. Valeu cada centavo."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-[#bfa086]">
                      <AvatarFallback className="bg-[#2e3d30] text-[#bfa086] font-serif text-lg">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-['Spartan'] uppercase text-[10px] md:text-xs tracking-widest text-[#bfa086]">
                        Mariana
                      </p>
                      <p className="text-xs md:text-sm text-[#e3d9ce]/60 font-light italic mt-0.5">
                        Projeto Apto GG
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
