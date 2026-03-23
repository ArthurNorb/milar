import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, ArrowRight, PenLine } from "lucide-react";
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
    <div className="flex flex-col min-h-screen">
      {/* Seção Principal (Hero) - Estilo Editorial */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
        {/* Estampa de fundo sutil */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <Image
            src="/estampas/Contorno Macro 01.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10 space-y-8">
            {/* Logo sutil no topo do texto */}
            <div className="mb-4 opacity-60">
              <Image
                src="/logotipos/Símbolo 02.png"
                alt="Logo Milar"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-foreground leading-[1.1] font-light tracking-tight">
              Neuroarquitetura
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-xl font-light">
              Vamos elevar o nível do seu sonho?
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Transformando ambientes em refúgios de equilíbrio e bem-estar
              através da neurociência aplicada. Cada detalhe planejado para
              melhorar o seu cotidiano.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button
                render={<Link href="/simulador" />}
                size="lg"
                className="px-8 h-14 text-base"
              >
                Simulação de Orçamento
              </Button>
              <Button
                render={<Link href="/portfolio" />}
                variant="outline"
                size="lg"
                className="px-8 h-14 text-base border-border hover:bg-secondary flex items-center gap-2"
              >
                Ver Projetos <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[60vh] lg:h-[80vh] w-full hidden md:block">
            <div className="absolute inset-0 bg-secondary/50" />

            <Image
              src="/image_4dc6a4.jpg"
              alt="Projeto de Arquitetura Milar"
              fill
              className="object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              priority
            />
            {/* Moldura sutil */}
            <div className="absolute inset-4 border border-background/20 z-10 pointer-events-none" />

            {/* Selo sobreposto na foto (um charme extra) */}
            <div className="absolute -bottom-10 -left-10 z-20 animate-[spin_30s_linear_infinite]">
              <Image
                src="/estampas/Contorno Micro 03.png"
                alt="Selo Milar"
                width={160}
                height={160}
                className="opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre a Giovanna */}
      <section className="py-24 md:py-40 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Selo gigante como textura de fundo */}
        <div className="absolute -top-40 -right-40 opacity-5 pointer-events-none">
          <Image
            src="/estampas/Contorno Micro 03.png"
            alt="Background Estampa"
            width={800}
            height={800}
          />
        </div>

        <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 relative aspect-[3/4] w-full max-w-md mx-auto md:ml-0 bg-primary-foreground/5 p-4">
              {/* Espaço para a foto da Giovanna */}
              <div className="w-full h-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 border border-primary-foreground/20 relative overflow-hidden">
                <span className="text-sm font-light uppercase tracking-widest z-10">
                  Retrato Giovanna Lima
                </span>
                {/* Selo sobreposto sutil */}
                <div className="absolute -bottom-8 -right-8 opacity-20">
                  <Image
                    src="/estampas/Contorno Micro 06.png"
                    alt=""
                    width={160}
                    height={160}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-8 max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-tight">
                Muito prazer,
                <br />
                eu sou a Giovanna.
              </h2>

              <div className="space-y-6 text-primary-foreground/80 text-lg md:text-xl font-light leading-relaxed">
                <p>
                  Minha paixão pela arquitetura nasceu na infância e se
                  transformou em uma carreira dedicada a servir e transformar
                  vidas.
                </p>
                <p>
                  Com anos de experiência no mercado, deixei de entregar apenas
                  projetos para entregar soluções de vida. Utilizo a
                  neurociência aplicada à arquitetura para garantir que cada
                  ambiente seja um catalisador de saúde e bem-estar, moldando o
                  comportamento humano para melhor.
                </p>
                <p className="font-medium text-primary-foreground">
                  Porque, para mim, um projeto só faz sentido quando ele toca o
                  coração e melhora o cotidiano de acordo com a sua necessidade.
                </p>
              </div>

              <div className="pt-8">
                <Button
                  render={<Link href="/curriculum" />}
                  variant="outline"
                  className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors bg-transparent"
                >
                  Conheça minha trajetória
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section className="py-24 md:py-40 bg-background relative overflow-hidden">
        {/* Estampa de fundo sutil */}
        <div className="absolute -left-20 -top-20 opacity-[0.03] pointer-events-none">
          <Image
            src="/estampas/Preenchida Micro 02.png"
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none">
          <Image
            src="/estampas/Contorno Micro 05.png"
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div className="container max-w-7xl px-6 md:px-12 mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-heading tracking-tight text-foreground">
                A experiência Milar
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                O que nossos clientes sentem ao vivenciar o design focado em
                neuroarquitetura.
              </p>
            </div>

            {/* Modal de Depoimento */}
            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary rounded-none flex items-center gap-2 h-12 px-6"
                  />
                }
              >
                <PenLine className="w-4 h-4" /> Deixar um depoimento
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl bg-background border-border rounded-none p-0">
                <DialogHeader className="p-8 pb-0 border-b border-border/40 bg-secondary/30">
                  <DialogTitle className="text-3xl font-heading font-normal">
                    Sua casa tem a assinatura Milar?
                  </DialogTitle>
                  <DialogDescription className="text-base pb-6 text-muted-foreground font-light">
                    Compartilhe sua experiência. Seu depoimento será enviado
                    para a Giovanna e pode aparecer aqui no site!
                  </DialogDescription>
                </DialogHeader>
                <div className="p-8">
                  <TestimonialForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex flex-col space-y-6">
                  <Quote className="h-12 w-12 text-primary/20" />
                  <blockquote className="text-xl md:text-2xl font-heading font-light leading-relaxed text-foreground/90">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Avatar className="h-12 w-12 rounded-none border border-border">
                      <AvatarFallback className="bg-secondary text-secondary-foreground rounded-none">
                        {testimonial.client_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground tracking-wide">
                        {testimonial.client_name}
                      </p>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px]">
                        Cliente Milar
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Depoimentos Reais do PDF
              <>
                <div className="flex flex-col space-y-6">
                  <Quote className="h-12 w-12 text-primary/20" />
                  <blockquote className="text-xl md:text-2xl font-heading font-light leading-relaxed text-foreground/90">
                    "A casa tem um abraço. Não é só decoração, tem toda uma
                    ciência por trás que você explicou. Todo mundo perguntou o
                    seu contato!"
                  </blockquote>
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Avatar className="h-12 w-12 rounded-none border border-border">
                      <AvatarFallback className="bg-secondary text-secondary-foreground rounded-none font-serif">
                        F
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground tracking-wide">
                        Fernando
                      </p>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px]">
                        Cliente Residencial
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-6">
                  <Quote className="h-12 w-12 text-primary/20" />
                  <blockquote className="text-xl md:text-2xl font-heading font-light leading-relaxed text-foreground/90">
                    "O clima mudou muito, o ambiente é muito mais relaxante. O
                    foco vem mais fácil, sabe? Até a dor de cabeça passou. Valeu
                    cada centavo."
                  </blockquote>
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Avatar className="h-12 w-12 rounded-none border border-border">
                      <AvatarFallback className="bg-secondary text-secondary-foreground rounded-none font-serif">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground tracking-wide">
                        Mariana
                      </p>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px]">
                        Projeto Home Office
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
