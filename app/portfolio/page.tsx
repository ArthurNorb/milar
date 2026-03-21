import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Portfólio | Milar Arquitetura",
  description: "Projetos que unem estética, funcionalidade e neurociência para criar ambientes que transformam.",
};

const projects = [
  {
    title: "Casa Manga Beiras",
    description:
      "Gerar conexão, equilíbrio e tranquilidade para uma família grande com rotina intensa. Cores e linhas moldando o comportamento.",
    tags: ["Residencial", "Neuroarquitetura", "Família"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Apto GG",
    description:
      "Sala e cozinha conjugadas para interação. Elementos que geram conforto emocional e mantêm memórias afetivas. Escritório flexível com foco em neuroarquitetura para alta produtividade.",
    tags: ["Apartamento", "Interiores", "Home Office"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w-1200&q=80",
  },
];

export default function PortfolioPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-border/50 bg-background hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
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
  );
}