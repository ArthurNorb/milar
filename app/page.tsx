import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import TestimonialForm from "@/components/testimonial-form";

async function getApprovedTestimonials() {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const testimonials = await getApprovedTestimonials()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 md:py-48">
        <div className="container relative z-10 max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-heading font-light tracking-tight">
              Milar Arquitetura.
            </h1>
            <p className="mt-6 text-2xl md:text-3xl font-heading font-light text-muted-foreground">
              Estética e Neuroarquitetura.
            </p>
            <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto">
              Utilizo a neurociência aplicada à arquitetura para garantir que cada ambiente seja um catalisador de saúde e bem-estar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Link href="/simulador">
                  Faça a simulação do seu orçamento agora
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <Link href="/portfolio">
                  Conheça nossos projetos
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </section>

      {/* About Section */}
      <section className="py-32 md:py-48 border-t border-border/40">
        <div className="container max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
              <div className="md:col-span-2">
                <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight">
                  Muito prazer, eu sou a Giovanna Lima.
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  Utilizo a neurociência aplicada à arquitetura para garantir que cada ambiente seja um catalisador de saúde e bem-estar. Meu trabalho é entregar cada detalhe planejado para transformar ambientes em refúgios de equilíbrio.
                </p>
                <div className="mt-8">
                  <Button variant="outline">
                    <Link href="/curriculum">
                      Ver currículo completo
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square w-full max-w-xs mx-auto bg-gradient-to-br from-muted to-border rounded-full overflow-hidden">
                  {/* Placeholder for Giovanna's photo */}
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">Foto de perfil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 md:py-48 border-t border-border/40 bg-muted/20">
        <div className="container max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight">
              Depoimentos
            </h2>
            <p className="mt-4 text-muted-foreground">
              O que nossos clientes dizem sobre a experiência com neuroarquitetura.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-border/60 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-8">
                    <Quote className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <blockquote className="text-lg italic text-foreground/90">
                      {testimonial.text}
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{testimonial.client_name.charAt(0)}</AvatarFallback>
                        <AvatarImage src="" />
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.client_name}</p>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback to static testimonials if database is empty
              <>
                <Card className="border-border/60 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-8">
                    <Quote className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <blockquote className="text-lg italic text-foreground/90">
                      “A casa tem um abraço. Não é só decoração, tem toda uma ciência por trás.”
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>F</AvatarFallback>
                        <AvatarImage src="" />
                      </Avatar>
                      <div>
                        <p className="font-semibold">Fernando</p>
                        <p className="text-sm text-muted-foreground">Cliente residencial</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-8">
                    <Quote className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <blockquote className="text-lg italic text-foreground/90">
                      “O clima mudou muito, o ambiente é muito mais relaxante. Valeu cada centavo.”
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>M</AvatarFallback>
                        <AvatarImage src="" />
                      </Avatar>
                      <div>
                        <p className="font-semibold">Mariana</p>
                        <p className="text-sm text-muted-foreground">Cliente corporativo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          <div className="mt-16 mx-auto max-w-2xl">
            <TestimonialForm />
          </div>
        </div>
      </section>
    </div>
  );
}