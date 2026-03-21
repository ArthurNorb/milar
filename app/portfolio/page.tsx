import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Portfólio | Milar Arquitetura",
  description: "Projetos que unem estética, funcionalidade e neurociência para criar ambientes que transformam.",
};

export default async function PortfolioPage() {
  const supabase = await getSupabaseServerClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    // Fallback to empty array
  }

  const projectList = projects || []

  return (
    <div className="py-24 md:py-32">
      <div className="container max-w-screen-2xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-light tracking-tight">
            Portfólio
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Projetos que unem estética, funcionalidade e neurociência para criar ambientes que transformam.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 auto-rows-min">
          {projectList.map((project, index) => (
            <Card
              key={project.id}
              className={`group overflow-hidden border-border/50 bg-background hover:shadow-lg transition-shadow duration-300 ${index % 3 === 0 ? 'lg:row-span-2' : ''}`}
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${project.image_url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/5 group-hover:via-black/10 group-hover:to-black/20 transition-all duration-500" />
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tags || []).map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))}
          {/* Placeholder for future projects */}
          <Card className="border-border/50 bg-muted/30 flex flex-col items-center justify-center p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <span className="text-4xl">+</span>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">
              Novos projetos em breve
            </h3>
            <p className="text-muted-foreground">
              Aguarde mais casos de sucesso da Milar Arquitetura.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}