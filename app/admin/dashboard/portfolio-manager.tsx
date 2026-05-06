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
  GripVertical,
} from "lucide-react";
import Image from "next/image";

type Project = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_urls: string[];
  tags: string[];
  display_order: number | null;
};

export default function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
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
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar projetos:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setTagsInput(project.tags ? project.tags.join(", ") : "");
    const urls = project.image_urls?.length
      ? project.image_urls
      : [project.image_url];
    setExistingUrls(urls);
    setNewFiles([]);
    setNewPreviews([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setTagsInput("");
    newPreviews.forEach((url) => URL.revokeObjectURL(url));
    setExistingUrls([]);
    setNewFiles([]);
    setNewPreviews([]);
    setMessage(null);
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const removeExistingUrl = (idx: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx: number) => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
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

  const persistOrder = async (ordered: Project[]) => {
    setSavingOrder(true);
    try {
      const updates = ordered.map((p, i) =>
        supabase
          .from("projects")
          .update({ display_order: i })
          .eq("id", p.id),
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
      setMessage({ type: "success", text: "Ordem do portfólio salva." });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Erro ao salvar ordem: ${error.message}`,
      });
      fetchProjects();
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      handleDragEnd();
      return;
    }
    const next = [...projects];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setProjects(next);
    handleDragEnd();
    persistOrder(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(filePath, file);

        if (uploadError)
          throw new Error(`Falha no upload: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      const allUrls = [...existingUrls, ...uploadedUrls];
      if (!allUrls.length) {
        allUrls.push(
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        );
      }

      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const projectData = {
        title,
        description,
        image_url: allUrls[0],
        image_urls: allUrls,
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
                  Mídia do Projeto
                </span>
              </div>
              <CardTitle className="text-2xl font-serif">
                Fotos do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {existingUrls.map((url, i) => (
                  <div
                    key={url + i}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#e3d9ce]/10"
                  >
                    {i === 0 && (
                      <div className="absolute top-1 left-1 z-10 bg-[#87381e] text-[#e3d9ce] text-[8px] font-['Spartan'] uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                        Capa
                      </div>
                    )}
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingUrl(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {newPreviews.map((url, i) => {
                  const isCover = existingUrls.length === 0 && i === 0;
                  return (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden bg-[#e3d9ce]/10"
                    >
                      {isCover && (
                        <div className="absolute top-1 left-1 z-10 bg-[#87381e] text-[#e3d9ce] text-[8px] font-['Spartan'] uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                          Capa
                        </div>
                      )}
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                <label className="relative aspect-square rounded-xl border-2 border-dashed border-[#e3d9ce]/25 flex flex-col items-center justify-center cursor-pointer hover:border-[#bfa086]/60 transition-colors">
                  <Plus className="w-6 h-6 text-[#bfa086]" />
                  <span className="text-[8px] font-['Spartan'] uppercase tracking-wider text-[#e3d9ce]/50 mt-1">
                    Adicionar
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleAddFiles}
                  />
                </label>
              </div>

              {existingUrls.length + newFiles.length > 0 && (
                <p className="text-[10px] text-[#e3d9ce]/40 font-['Spartan']">
                  {existingUrls.length + newFiles.length} foto
                  {existingUrls.length + newFiles.length > 1 ? "s" : ""} · A
                  primeira é a capa
                </p>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !title ||
                    existingUrls.length + newFiles.length === 0
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
              {savingOrder && (
                <span className="ml-2 inline-flex items-center gap-1 text-[#87381e]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  salvando ordem…
                </span>
              )}
            </p>
          </div>
        </div>

        {projects.length > 1 && (
          <p className="text-xs italic font-light text-[#756d47] -mt-4">
            Arraste pelo ícone <GripVertical className="inline w-3 h-3" /> para
            reordenar como aparecem no site.
          </p>
        )}

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
            {projects.map((project, index) => (
              <Card
                key={project.id}
                draggable
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOver(index)}
                onDrop={handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`group relative border-none bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
                  dragIndex === index ? "opacity-40" : ""
                } ${
                  dragOverIndex === index && dragIndex !== index
                    ? "ring-2 ring-[#87381e] ring-offset-2 ring-offset-[#e3d9ce]"
                    : ""
                }`}
              >
                <div
                  className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-[#2e3d30] flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing"
                  title="Arraste para reordenar"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
