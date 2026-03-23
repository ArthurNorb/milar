import { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  BookOpen,
  Briefcase,
  Cpu,
  Download,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trajetória | Milar Arquitetura",
  description:
    "A união entre rigor técnico e neurociência aplicada por Giovanna Lima.",
};

async function getCurriculumData() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("curriculum")
    .select("*")
    .order("type")
    .order("start_year", { ascending: false });

  if (error) {
    console.error("Error fetching curriculum:", error);
    return [];
  }

  return data || [];
}

async function getCvUrl() {
  const supabase = await getSupabaseServerClient();
  try {
    const { data } = await supabase.storage
      .from("project-images")
      .list("cv", { limit: 1 });

    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(`cv/${data[0].name}`);
      return urlData.publicUrl;
    }
  } catch (error) {
    console.error("Failed to fetch CV URL:", error);
  }
  return null;
}

export default async function CurriculumPage() {
  const curriculumItems = await getCurriculumData();
  const cvUrl = await getCvUrl();

  const education = curriculumItems.filter((item) => item.type === "education");
  const experience = curriculumItems.filter(
    (item) => item.type === "experience",
  );
  const skills = curriculumItems.filter((item) => item.type === "skill");

  return (
    <div className="min-h-screen bg-[#e3d9ce] text-[#2e3d30] pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden relative">
      {/* Estampas de fundo dinâmicas */}
      <div className="absolute top-0 left-0 w-125 h-125 opacity-[0.03] pointer-events-none -translate-x-1/4 -translate-y-1/4">
        <Image
          src="/estampas/Contorno Macro 01.png"
          alt=""
          fill
          className="animate-[spin_90s_linear_infinite]"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-150 h-150 opacity-[0.05] pointer-events-none translate-x-1/4 translate-y-1/4">
        <Image src="/estampas/Preenchida Macro 06.png" alt="" fill />
      </div>

      <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto relative z-10">
        {/* Header Editorial */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-32 space-y-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 border-[#87381e]/30 text-[#87381e]"
          >
            Trajectory & Expertise
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-none tracking-tight">
            Design que <br />
            <span className="italic text-[#756d47]">transforma vidas.</span>
          </h1>

          {cvUrl && (
            <div className="pt-6">
              <Button
                render={<Link href={cvUrl} target="_blank" />}
                className="shadow-xl"
              >
                <Download className="h-4 w-4 mr-3" />
                Baixar Currículo Completo
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start">
          {/* Coluna Principal (Formação e Experiência) */}
          <div className="lg:col-span-2 space-y-20">
            {/* Educação */}
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full bg-[#87381e]/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[#87381e]" />
                </div>
                <h2 className="text-3xl font-serif">Formação Acadêmica</h2>
              </div>

              <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-[#bfa086]/30">
                {education.map((item) => (
                  <div key={item.id} className="pl-12 relative group">
                    <div className="absolute left-5.25 top-2 w-2 h-2 rounded-full bg-[#bfa086] group-hover:scale-150 group-hover:bg-[#87381e] transition-all duration-300" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-medium text-[#2e3d30]">
                        {item.title}
                      </h3>
                      <span className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#87381e] bg-[#87381e]/5 px-3 py-1 rounded-full">
                        {item.start_year} — {item.end_year || "Hoje"}
                      </span>
                    </div>
                    <p className="text-[#756d47] font-light leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Experiência */}
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full bg-[#2e3d30]/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-[#2e3d30]" />
                </div>
                <h2 className="text-3xl font-serif">
                  Experiência Profissional
                </h2>
              </div>

              <div className="space-y-6">
                {experience.map((item) => (
                  <Card
                    key={item.id}
                    className="group border-none bg-transparent hover:bg-[#bfa086]/5 transition-colors duration-500 rounded-3xl"
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-3 flex-1">
                          <h3 className="text-2xl font-serif text-[#2e3d30] group-hover:text-[#87381e] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[#756d47] font-light leading-relaxed text-sm md:text-base">
                            {item.description}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap font-['Spartan'] text-[9px] tracking-[0.15em]"
                        >
                          <Calendar className="h-3 w-3 mr-2" />
                          {item.start_year} — {item.end_year || "Presente"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Coluna Lateral (Bio & Skills) */}
          <aside className="space-y-12">
            {/* Dark Bio Card */}
            <Card className="bg-[#2e3d30] text-[#e3d9ce] rounded-[2.5rem] border-none shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
                <Image
                  src="/logotipos/Símbolo 01.png"
                  alt=""
                  fill
                  className="group-hover:rotate-45 transition-transform duration-1000"
                />
              </div>
              <CardContent className="p-10 space-y-8 relative z-10">
                <div className="space-y-2">
                  <span className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#bfa086]">
                    Arquiteta e Urbanista
                  </span>
                  <h3 className="text-3xl font-serif italic">Giovanna Lima</h3>
                </div>

                <p className="text-sm font-light leading-relaxed opacity-80">
                  Especialista em Neuroarquitetura, foco minha prática no
                  equilíbrio entre estética e comportamento humano. Desenvolvo
                  projetos que transcendem o visual para se tornarem refúgios de
                  saúde e bem-estar.
                </p>

                <div className="space-y-4 pt-4 border-t border-[#e3d9ce]/10">
                  <div className="flex items-center gap-3 text-xs font-['Spartan'] tracking-wider">
                    <MapPin className="h-4 w-4 text-[#bfa086]" />
                    Belo Horizonte, MG
                  </div>
                  <div className="flex items-center gap-3 text-xs font-['Spartan'] tracking-wider">
                    <Sparkles className="h-4 w-4 text-[#bfa086]" />
                    CAU: A264844-0
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hard Skills */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#756d47]/10 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-[#756d47]" />
                </div>
                <h3 className="text-xl font-serif">Hard Skills</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="bg-transparent border-[#bfa086]/50 text-[#2e3d30] hover:bg-[#bfa086] transition-all cursor-default py-2 px-4 rounded-full"
                  >
                    {skill.title}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Abordagem de Neuroarquitetura */}
            <div className="p-8 rounded-3xl border border-[#bfa086]/30 bg-[#bfa086]/5 space-y-4">
              <h4 className="font-serif text-lg">Biofilia & Bem-estar</h4>
              <p className="text-xs font-light text-[#756d47] leading-relaxed">
                Minha abordagem integra elementos naturais, iluminação
                circadiana e formas orgânicas para reduzir o cortisol e elevar a
                produtividade nos ambientes que projeto.
              </p>
              <Link
                href="mailto:gioarqt.1@gmail.com"
                className="inline-block text-[10px] font-['Spartan'] uppercase tracking-widest text-[#87381e] hover:underline pt-2"
              >
                Solicitar consultoria
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
