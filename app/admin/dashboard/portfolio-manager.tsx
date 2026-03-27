"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ImagePlus,
  Sparkles,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tags,
  FileText,
  X,
  Edit3,
  Trash2,
  FolderKanban,
} from "lucide-react";
import Image from "next/image";

type Project = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
};

export default function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar projetos:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (!imageFile) {
      if (!editingProject) setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile, editingProject]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setTagsInput(project.tags ? project.tags.join(", ") : "");
    setPreviewUrl(project.image_url);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setTagsInput("");
    setImageFile(null);
    setPreviewUrl(null);
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir permanentemente este projeto? Ele sumirá do site na hora.",
      )
    )
      return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: "Projeto removido do acervo." });
      if (editingProject?.id === id) cancelEdit();
    } catch (error: any) {
      setMessage({ type: "error", text: `Erro ao excluir: ${error.message}` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let imageUrl = editingProject ? editingProject.image_url : "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(filePath, imageFile);

        if (uploadError)
          throw new Error(`Falha no upload da imagem: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const projectData = {
        title,
        description,
        image_url:
          imageUrl ||
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        tags,
      };

      if (editingProject) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (updateError)
          throw new Error(`Falha ao atualizar: ${updateError.message}`);
        setMessage({
          type: "success",
          text: "Projeto atualizado com sucesso!",
        });
      } else {
        const { error: insertError } = await supabase
          .from("projects")
          .insert(projectData);

        if (insertError)
          throw new Error(`Falha no banco de dados: ${insertError.message}`);
        setMessage({
          type: "success",
          text: "Projeto eternizado no portfólio com sucesso!",
        });
      }

      fetchProjects();
      cancelEdit();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "destructive"}
          className="shadow-lg border-none"
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle className="font-serif text-lg">
            {message.type === "success" ? "Perfeito!" : "Ops, algo deu errado"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-7 space-y-6">
          <Card
            className={`border-none rounded-[2rem] shadow-sm overflow-hidden transition-colors duration-500 ${editingProject ? "bg-[#bfa086]/20 ring-1 ring-[#87381e]/30" : "bg-[#e3d9ce] border border-[#bfa086]/20"}`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-[#87381e] mb-1">
                <FileText className="w-4 h-4" />
                <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                  {editingProject ? "Modo de Edição" : "Detalhamento"}
                </span>
              </div>
              <CardTitle className="text-3xl font-serif text-[#2e3d30]">
                {editingProject
                  ? `Editando: ${editingProject.title}`
                  : "Novo Projeto"}
              </CardTitle>
              <CardDescription className="text-[#756d47]">
                {editingProject
                  ? "Altere os dados desejados e clique em salvar."
                  : "Insira os detalhes técnicos e a narrativa do ambiente."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Projeto</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Residência Aurora ou Clínica Equilibrium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Narrativa e Conceito</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva como a neuroarquitetura foi aplicada neste espaço..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="tags">
                  Tags de Identificação (separadas por vírgula)
                </Label>
                <div className="relative">
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Residencial, Biofilia, Clínica..."
                    className="pr-10"
                  />
                  <Tags className="absolute right-3 top-3 w-4 h-4 text-[#756d47] opacity-40" />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tagsInput.split(",").map(
                    (tag, i) =>
                      tag.trim() && (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-[#bfa086]/20 text-[#2e3d30] border-none"
                        >
                          {tag.trim()}
                        </Badge>
                      ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-none bg-[#2e3d30] text-[#e3d9ce] rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-[#bfa086] mb-1">
                <ImagePlus className="w-4 h-4" />
                <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                  Mídia Principal
                </span>
              </div>
              <CardTitle className="text-2xl font-serif">
                Capa do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-3/4 w-full rounded-t-full border-2 border-dashed border-[#e3d9ce]/20 flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-[#bfa086]/50">
                {previewUrl ? (
                  <>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        if (!editingProject) setPreviewUrl(null);
                      }}
                      className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {editingProject && !imageFile && (
                      <div className="absolute bottom-4 bg-black/60 backdrop-blur-sm text-xs px-3 py-1 rounded-full pointer-events-none">
                        Imagem Atual
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#e3d9ce]/10 flex items-center justify-center">
                      <Plus className="w-8 h-8 text-[#bfa086]" />
                    </div>
                    <div>
                      <p className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold text-[#bfa086]">
                        Selecionar Foto
                      </p>
                      <p className="text-xs text-[#e3d9ce]/40 mt-1">
                        Alta resolução recomendada
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={
                    loading || !title || (!imageFile && !editingProject)
                  }
                  className="w-full h-14 bg-[#87381e] hover:bg-[#87381e]/80 text-[#e3d9ce] font-['Spartan'] text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {editingProject
                        ? "Salvar Alterações"
                        : "Publicar no Portfólio"}
                    </div>
                  )}
                </Button>

                {editingProject && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    className="w-full h-12 border-[#e3d9ce]/20 text-[#e3d9ce] hover:bg-[#e3d9ce]/10 font-['Spartan'] text-[10px] tracking-widest uppercase rounded-xl"
                  >
                    Cancelar Edição
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <hr className="border-[#bfa086]/20" />

      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2e3d30]/10 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-[#2e3d30]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-[#2e3d30]">
              Acervo de Projetos
            </h2>
            <p className="text-[10px] font-['Spartan'] uppercase tracking-widest text-[#756d47]">
              {projects.length}{" "}
              {projects.length === 1
                ? "projeto publicado"
                : "projetos publicados"}
            </p>
          </div>
        </div>

        {loadingProjects ? (
          <div className="flex flex-col items-center py-12 text-[#756d47]">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="font-light italic">Carregando acervo...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center rounded-[2rem] border border-dashed border-[#bfa086]/30">
            <p className="text-[#756d47] font-light italic">
              Nenhum projeto no portfólio ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group border-none bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button
                      onClick={() => handleEdit(project)}
                      className="w-12 h-12 rounded-full bg-white text-[#2e3d30] hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                      title="Editar"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="w-12 h-12 rounded-full bg-[#87381e] text-white hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl text-[#2e3d30] mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-['Spartan'] uppercase tracking-wider text-[#756d47] bg-[#bfa086]/10 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags && project.tags.length > 3 && (
                      <span className="text-[9px] font-['Spartan'] uppercase tracking-wider text-[#756d47] px-1">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-light text-[#756d47] line-clamp-2">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
