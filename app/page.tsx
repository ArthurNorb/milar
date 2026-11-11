import { Button } from "@/components/ui/button";
import { ArrowRight, PenLine } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";
import { getApprovedTestimonials, getHomeProjects } from "@/lib/queries";
import HomeProjectsCarousel from "@/components/home-projects-carousel";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import TestimonialForm from "@/components/testimonial-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function HomePage() {
  const [testimonials, homeProjects] = await Promise.all([
    getApprovedTestimonials(),
    getHomeProjects(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#e3d9ce] text-[#2e3d30] overflow-hidden selection:bg-[#87381e] selection:text-[#e3d9ce]">
      <section className="relative min-h-[calc(100svh-5rem)] md:min-h-screen flex items-center pt-10 pb-16 md:pt-20 md:pb-12 bg-[#2e3d30] text-[#e3d9ce] rounded-b-[2.5rem] md:rounded-b-[5rem] shadow-2xl z-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <Image
            src="/estampas/Preenchida Macro 01.png"
            alt="Textura Orgânica"
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover animate-[pulse_10s_ease-in-out_infinite]"
          />
        </div>

        <div className="container max-w-screen-2xl px-5 md:px-12 mx-auto grid lg:grid-cols-12 gap-10 md:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 md:space-y-8 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[#bfa086]/30 bg-[#756d47]/20 backdrop-blur-sm">
              <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.2em] uppercase text-[#bfa086]">
                Neuroarquitetura Aplicada
              </span>
            </div>

            <h1 className="text-[2.75rem] leading-[1.1] sm:text-6xl md:text-7xl font-serif tracking-tight">
              Onde o lado <br className="sm:hidden" />
              <span className="italic text-[#c3532e] font-light">de fora</span>
              <br />
              encontra o <br className="sm:hidden" />
              <span className="italic text-[#c3532e] font-light">
                de dentro.
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-[#e3d9ce]/80 max-w-lg font-light leading-relaxed">
              No escritório MILAR arquitetura desenvolvemos projetos
              residenciais utilizando estratégias e conceitos da neurociência
              que, através do ambiente, conseguem gerar mais qualidade de vida e
              bem-estar, de forma totalmente personalizada e garantindo estética
              e personalidade.
            </p>
            <p className="text-base md:text-lg lg:text-xl text-[#e3d9ce]/80 max-w-lg font-light leading-relaxed">
              À frente do escritório, Giovanna Lima é arquiteta e master em
              neuroarquitetura. Tem experiência sólida em execução de projetos,
              gestão de projetos e gestão equipe. Hoje, oferecemos 03 principais
              formas de serviço: Consultoria, Projeto arquitetônico ou de
              interiores e Acompanhamento de obra.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 w-full sm:w-auto">
              <Button
                render={<a href={siteConfig.projectFormUrl} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
                size="lg"
                className="w-full sm:w-auto px-8 h-14 bg-[#c3532e] hover:bg-[#c3532e]/80 text-[#e3d9ce] font-['Spartan'] text-xs tracking-wider uppercase rounded-full transition-transform hover:scale-105 duration-300 flex items-center justify-center shadow-lg"
              >
                Solicitar Projeto <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                render={<Link href="/projetos" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 h-14 border-[#bfa086] text-[#bfa086] hover:bg-[#bfa086] hover:text-[#2e3d30] font-['Spartan'] text-xs tracking-wider uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-2 bg-transparent"
              >
                Ver Projetos <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[42vh] sm:h-[50vh] lg:h-[75vh] w-full group mt-4 sm:mt-8 lg:mt-0 mr-3 md:mr-0">
            <div className="absolute inset-0 bg-[#c3532e] transform translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6 duration-700 ease-out z-0" />
            <div className="relative h-full w-full overflow-hidden border-4 border-[#2e3d30] shadow-2xl z-10 bg-[#bfa086]">
              <Image
                src="/hero.png"
                alt="Projeto Milar"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="py-20 md:py-40 relative z-10 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none">
          <Image
            src="/estampas/Contorno Macro 04.png"
            alt="Textura de fundo"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="container max-w-7xl px-5 md:px-12 mx-auto relative z-10">
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-12 md:gap-24 items-start">
            <div className="w-full h-full relative">
              <div className="md:sticky md:top-32 relative aspect-3/4 w-[80%] md:w-full max-w-md mx-auto group">
                <div className="absolute inset-0 bg-[#756d47] -rotate-6 transition-transform group-hover:rotate-0 duration-500" />
                <div className="relative h-full w-full overflow-hidden bg-[#a39f86] z-10 border-[6px] md:border-8 border-[#e3d9ce]">
                  <Image
                    src="/gi.jpeg"
                    alt="Giovanna Lima"
                    fill
                    sizes="(max-width: 768px) 80vw, 448px"
                    className="object-cover object-center"
                  />
                </div>
                <Image
                  src="/estampas/Contorno Micro 01.png"
                  alt=""
                  width={100}
                  height={100}
                  className="absolute -bottom-20 -right-6 md:-bottom-28 md:-right-10 z-20 opacity-80 md:w-30"
                />
              </div>
            </div>

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
                  &quot;Um projeto só faz sentido quando ele toca o coração e melhora
                  o cotidiano de acordo com a sua necessidade.&quot;
                </p>
              </div>

              <div className="pt-2 md:pt-4">
                <Button
                  render={<Link href="/projetos" />}
                  nativeButton={false}
                  variant="ghost"
                  className="p-0 hover:bg-transparent text-[#87381e] hover:text-[#2e3d30] font-['Spartan'] text-[10px] md:text-sm tracking-widest uppercase transition-colors group flex items-center gap-3 w-fit"
                >
                  Conheça nossos projetos
                  <span className="w-8 md:w-10 h-px bg-[#87381e] group-hover:w-16 transition-all duration-300"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {homeProjects.length > 0 && (
        <section className="pb-20 md:pb-32 relative z-10">
          <div className="container max-w-7xl px-5 md:px-12 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-6 border-b border-[#2e3d30]/15 pb-8">
              <div className="space-y-3 md:space-y-4 max-w-2xl">
                <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#87381e]">
                  Projetos
                </span>
                <h2 className="text-[2.5rem] leading-tight md:text-6xl font-serif tracking-tight">
                  Alguns dos nossos projetos
                </h2>
              </div>
              <Button
                render={<Link href="/projetos" />}
                nativeButton={false}
                variant="ghost"
                className="p-0 hover:bg-transparent text-[#87381e] hover:text-[#2e3d30] font-['Spartan'] text-[10px] md:text-sm tracking-widest uppercase transition-colors group flex items-center gap-3 w-fit"
              >
                Ver todos
                <span className="w-8 md:w-10 h-px bg-[#87381e] group-hover:w-16 transition-all duration-300"></span>
              </Button>
            </div>
            <HomeProjectsCarousel
              projects={homeProjects.map((project) => ({
                id: project.id,
                title: project.title,
                image: project.image_urls?.[0] ?? project.image_url,
              }))}
            />
          </div>
        </section>
      )}

      <section id="feedbacks" className="py-20 md:py-32 bg-[#2e3d30] text-[#e3d9ce] relative rounded-t-[2.5rem] md:rounded-t-[5rem]">
        <div className="container max-w-7xl px-5 md:px-12 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8 border-b border-[#e3d9ce]/20 pb-8 md:pb-12">
            <div className="space-y-3 md:space-y-4 max-w-2xl">
              <span className="text-[10px] md:text-xs font-['Spartan'] tracking-[0.3em] uppercase text-[#bfa086]">
                Feedbacks
              </span>
              <h2 className="text-[2.5rem] leading-tight md:text-6xl font-serif tracking-tight flex flex-wrap items-center gap-x-4 gap-y-2">
                A experiência
                <Image
                  src="/logotipos/Logotipo Variação 02.png"
                  alt="Milar"
                  width={140}
                  height={45}
                  className="w-27.5 md:w-35 h-auto object-contain shrink-0 mt-1 md:mt-2 mb-1"
                />
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
              <DialogContent className="w-[95vw] sm:max-w-xl bg-[#e3d9ce] border-none text-[#2e3d30] rounded-3xl p-0 max-h-[90dvh] overflow-y-auto">
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

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>
    </div>
  );
}
