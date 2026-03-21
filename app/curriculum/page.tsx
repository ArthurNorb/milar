import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Briefcase, Cpu, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Currículo | Milar Arquitetura",
  description: "Formação, experiência e habilidades de Giovanna Lima.",
};

async function getCurriculumData() {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('curriculum')
    .select('*')
    .order('type')
    .order('start_year', { ascending: false })

  if (error) {
    console.error('Error fetching curriculum:', error)
    return []
  }

  return data || []
}

async function getCvUrl() {
  const supabase = await getSupabaseServerClient()
  try {
    const { data } = await supabase.storage
      .from('project-images')
      .list('cv', { limit: 1 })

    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(`cv/${data[0].name}`)
      return urlData.publicUrl
    }
  } catch (error) {
    console.error('Failed to fetch CV URL:', error)
  }
  return null
}

export default async function CurriculumPage() {
  const curriculumItems = await getCurriculumData()
  const cvUrl = await getCvUrl()

  const education = curriculumItems.filter(item => item.type === 'education')
  const experience = curriculumItems.filter(item => item.type === 'experience')
  const skills = curriculumItems.filter(item => item.type === 'skill')

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
            {cvUrl && (
              <div className="mt-6">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                    Baixar CV (PDF)
                  </a>
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left column - Education & Experience */}
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
                  {education.length === 0 ? (
                    <p className="text-muted-foreground">No education entries yet.</p>
                  ) : (
                    education.map((item) => (
                      <Card key={item.id} className="border-border/50">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold">{item.title}</h3>
                              {item.description && (
                                <p className="text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                            {(item.start_year || item.end_year) && (
                              <Badge variant="outline" className="ml-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                {item.start_year} - {item.end_year || 'Present'}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
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
                  {experience.length === 0 ? (
                    <p className="text-muted-foreground">No experience entries yet.</p>
                  ) : (
                    experience.map((item) => (
                      <Card key={item.id} className="border-border/50">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold">{item.title}</h3>
                              {item.description && (
                                <p className="text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                            {(item.start_year || item.end_year) && (
                              <Badge variant="outline" className="ml-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                {item.start_year} - {item.end_year || 'Present'}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
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
                      {skills.length === 0 ? (
                        <p className="text-muted-foreground">No skills added yet.</p>
                      ) : (
                        skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="secondary"
                            className="font-normal py-1.5 px-3"
                          >
                            {skill.title}
                          </Badge>
                        ))
                      )}
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