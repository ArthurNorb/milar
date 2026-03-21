import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Briefcase, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Currículo | Milar Arquitetura",
  description: "Formação, experiência e habilidades de Giovanna Lima.",
};

export default function CurriculumPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container max-w-screen-2xl px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-tight">
              Currículo
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Formação, experiência e habilidades de Giovanna Lima.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left column - Education & Skills */}
            <div className="lg:col-span-2 space-y-12">
              {/* Education */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold">
                    Formação Acadêmica
                  </h2>
                </div>
                <div className="space-y-6">
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">
                            UFOP - Universidade Federal de Ouro Preto
                          </h3>
                          <p className="text-muted-foreground">
                            Bacharelado em Arquitetura e Urbanismo
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          2016-2021
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">
                            IPOG - Instituto de Pós-Graduação e Graduação
                          </h3>
                          <p className="text-muted-foreground">
                            Gestão da Qualidade e Master em Neuroarquitetura
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          2023-2024
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Experience */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold">
                    Experiência Profissional
                  </h2>
                </div>
                <div className="space-y-6">
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">
                            Milar Arquitetura
                          </h3>
                          <p className="text-muted-foreground">
                            Arquiteta Autônoma
                          </p>
                          <ul className="mt-3 space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>Projetos residenciais e corporativos com foco em neuroarquitetura</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>Consultoria em ambientes para saúde e bem-estar</span>
                            </li>
                          </ul>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          2021-hoje
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">
                            Atmos Construtora
                          </h3>
                          <p className="text-muted-foreground">
                            Arquiteta
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          2025
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">
                            Leroy Merlin
                          </h3>
                          <p className="text-muted-foreground">
                            Arquiteta
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          2022-2025
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>

            {/* Right column - Skills */}
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold">
                    Hard Skills
                  </h2>
                </div>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {[
                        "AutoCAD",
                        "Sketchup",
                        "Archicad",
                        "Enscape",
                        "Pacote Adobe",
                        "Revit",
                        "Lumion",
                        "Project Management",
                        "Neurociência Aplicada",
                        "Design de Interiores",
                      ].map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="font-normal py-1.5 px-3"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Sobre a abordagem
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Minha prática combina rigor técnico com a sensibilidade da neurociência, criando espaços que não apenas impressionam visualmente, mas também promovem saúde mental, produtividade e equilíbrio emocional.
                    </p>
                    <div className="mt-6">
                      <a
                        href="mailto:gioarqt.1@gmail.com"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        Entre em contato para mais informações
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}