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
} from "lucide-react";
import Image from "next/image";

export default function PortfolioManager() {
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

  // Gerar preview da imagem instantaneamente
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let imageUrl = "";

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

      const { error: insertError } = await supabase.from("projects").insert({
        title,
        description,
        image_url:
          imageUrl ||
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        tags,
      });

      if (insertError)
        throw new Error(`Falha no banco de dados: ${insertError.message}`);

      setMessage({
        type: "success",
        text: "Projeto eternizado no portfólio com sucesso!",
      });
      setTitle("");
      setDescription("");
      setTagsInput("");
      setImageFile(null);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
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
            {message.type === "success"
              ? "Maravilhoso!"
              : "Ops, algo deu errado"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Coluna da Esquerda: Dados do Projeto */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none bg-[#e3d9ce] rounded-[2rem] shadow-sm border border-[#bfa086]/20 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-[#87381e] mb-1">
                <FileText className="w-4 h-4" />
                <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                  Detalhamento
                </span>
              </div>
              <CardTitle className="text-3xl font-serif text-[#2e3d30]">
                Novo Projeto
              </CardTitle>
              <CardDescription className="text-[#756d47]">
                Insira os detalhes técnicos e a narrativa do ambiente.
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
                <Label htmlFor="tags">Tags de Identificação</Label>
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
                {/* Visual Preview das Tags */}
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

        {/* Coluna da Direita: Imagem e Preview */}
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
              {/* Dropzone com Preview de Arco */}
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
                      onClick={() => setImageFile(null)}
                      className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
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

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !title || !imageFile}
                  className="w-full h-14 bg-[#87381e] hover:bg-[#87381e]/80 text-[#e3d9ce] font-['Spartan'] text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando Projeto...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Publicar no Portfólio
                    </div>
                  )}
                </Button>
                <p className="text-center font-['Spartan'] text-[9px] uppercase tracking-[0.2em] text-[#e3d9ce]/40 mt-4">
                  Ao publicar, o projeto ficará visível instantaneamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
