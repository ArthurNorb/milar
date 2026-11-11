"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { deletePost, listPostsAdmin, savePost } from "./actions";
import RichTextEditor from "./_components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  ExternalLink,
  FileText,
  ImagePlus,
  Loader2,
  Newspaper,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { Post } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { uploadImage } from "@/lib/upload-client";
import { getErrorMessage } from "@/lib/utils";

type Message = { type: "success" | "error"; text: string } | null;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  // Remonta o editor ao trocar de artigo (o conteúdo inicial só é lido na montagem).
  const [editorKey, setEditorKey] = useState(0);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const fetchPosts = async () => {
    try {
      const result = await listPostsAdmin();
      if (!result.ok) throw new Error(result.error);
      setPosts(result.data);
    } catch (error: unknown) {
      console.error("Erro ao buscar artigos:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    // Carga inicial dos dados na montagem (via Server Action)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, []);

  const effectiveSlug = slugTouched ? slugify(slug) : slugify(title);

  const resetCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleEdit = (post: Post) => {
    resetCover();
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setSlugTouched(true);
    setCategory(post.category ?? "");
    setExcerpt(post.excerpt);
    setContentHtml(post.content_html);
    setIsPublished(post.is_published);
    setCoverUrl(post.cover_image_url);
    setEditorKey((key) => key + 1);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    resetCover();
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setCategory("");
    setExcerpt("");
    setContentHtml("");
    setIsPublished(false);
    setCoverUrl("");
    setEditorKey((key) => key + 1);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleDelete = async (post: Post) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir permanentemente "${post.title}"? Ele sumirá do site na hora.`,
      )
    )
      return;

    setActionLoading(post.id);
    try {
      const result = await deletePost(post.id);
      if (!result.ok) throw new Error(result.error);

      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setMessage({ type: "success", text: "Artigo excluído." });
      if (editingPost?.id === post.id) cancelEdit();
    } catch (error: unknown) {
      setMessage({ type: "error", text: `Erro ao excluir: ${getErrorMessage(error)}` });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const cover = coverFile ? await uploadImage(coverFile, "blog") : coverUrl;
      if (!cover) throw new Error("Adicione a foto principal.");
      // Se o salvamento falhar, a capa já enviada é reaproveitada na próxima tentativa.
      if (coverFile) {
        setCoverUrl(cover);
        resetCover();
      }

      const result = await savePost({
        id: editingPost?.id,
        title,
        slug: effectiveSlug,
        excerpt,
        category,
        cover_image_url: cover,
        content_html: contentHtml,
        is_published: isPublished,
      });
      if (!result.ok) throw new Error(result.error);

      setMessage({
        type: "success",
        text: result.data.is_published
          ? `Artigo publicado em /blog/${result.data.slug}`
          : "Rascunho salvo. Ele só aparece no site quando você marcar “Publicado”.",
      });
      fetchPosts();
      cancelEdit();
    } catch (error: unknown) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const coverSrc = coverPreview ?? (coverUrl || null);

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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card
            className={`border-none rounded-[2rem] shadow-sm overflow-hidden transition-colors duration-500 ${editingPost ? "bg-[#bfa086]/20 ring-1 ring-[#87381e]/30" : "bg-[#e3d9ce] border border-[#bfa086]/20"}`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-[#87381e] mb-1">
                <FileText className="w-4 h-4" />
                <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                  {editingPost ? "Modo de Edição" : "Novo Artigo"}
                </span>
              </div>
              <CardTitle className="text-3xl font-serif text-[#2e3d30]">
                {editingPost ? `Editando: ${editingPost.title}` : "Escrever artigo"}
              </CardTitle>
              <CardDescription className="text-[#756d47]">
                Título, resumo e o texto completo. Use “Foto” na barra do editor para
                colocar imagens no meio do texto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="post-title">Título</Label>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Quero reformar meu apartamento: por onde começar?"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="post-category">Categoria (opcional)</Label>
                  <Input
                    id="post-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Antes de começar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-slug">Endereço do artigo</Label>
                  <Input
                    id="post-slug"
                    value={slugTouched ? slug : effectiveSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="gerado-a-partir-do-titulo"
                  />
                  <p className="text-[10px] text-[#756d47] font-['Spartan'] tracking-wider break-all">
                    /blog/{effectiveSlug || "…"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-excerpt">Resumo</Label>
                <Textarea
                  id="post-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Uma ou duas frases que aparecem no card do blog e abaixo do título."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Texto do artigo</Label>
                <RichTextEditor
                  key={editorKey}
                  initialHtml={contentHtml}
                  onChange={setContentHtml}
                  onError={(text) => setMessage({ type: "error", text })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <Card className="border-none bg-[#2e3d30] text-[#e3d9ce] rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-[#bfa086] mb-1">
                <ImagePlus className="w-4 h-4" />
                <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                  Foto principal
                </span>
              </div>
              <CardTitle className="text-2xl font-serif">Capa do artigo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {coverSrc ? (
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#e3d9ce]/10">
                  <Image src={coverSrc} alt="" fill sizes="360px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      resetCover();
                      setCoverUrl("");
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10"
                    title="Trocar capa"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="relative aspect-4/3 rounded-xl border-2 border-dashed border-[#e3d9ce]/25 flex flex-col items-center justify-center cursor-pointer hover:border-[#bfa086]/60 transition-colors">
                  <ImagePlus className="w-6 h-6 text-[#bfa086]" />
                  <span className="text-[8px] font-['Spartan'] uppercase tracking-wider text-[#e3d9ce]/50 mt-1">
                    Escolher foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleCoverChange}
                  />
                </label>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={isPublished}
                  onCheckedChange={(checked) => setIsPublished(checked)}
                  className="mt-0.5 border-[#e3d9ce]/40 data-checked:border-[#bfa086] data-checked:bg-[#bfa086] data-checked:text-[#2e3d30]"
                />
                <span className="space-y-1">
                  <span className="block font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                    Publicado
                  </span>
                  <span className="block text-xs text-[#e3d9ce]/60 font-light">
                    Desmarcado, o artigo fica como rascunho e não aparece no site.
                  </span>
                </span>
              </label>

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading || !title || !excerpt || !coverSrc}
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
                      {isPublished
                        ? editingPost?.is_published
                          ? "Salvar Alterações"
                          : "Publicar Artigo"
                        : "Salvar Rascunho"}
                    </div>
                  )}
                </Button>

                {editingPost && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      cancelEdit();
                      setMessage(null);
                    }}
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
            <Newspaper className="w-5 h-5 text-[#2e3d30]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-[#2e3d30]">Artigos do Blog</h2>
            <p className="text-[10px] font-['Spartan'] uppercase tracking-widest text-[#756d47]">
              {posts.filter((p) => p.is_published).length} publicados ·{" "}
              {posts.filter((p) => !p.is_published).length} rascunhos
            </p>
          </div>
        </div>

        {loadingPosts ? (
          <div className="flex flex-col items-center py-12 text-[#756d47]">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="font-light italic">Carregando artigos...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center rounded-[2rem] border border-dashed border-[#bfa086]/30">
            <p className="text-[#756d47] font-light italic">Nenhum artigo escrito ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group relative border-none bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    className={`absolute top-3 left-3 z-10 text-[9px] font-['Spartan'] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${
                      post.is_published
                        ? "bg-[#2e3d30] text-[#e3d9ce]"
                        : "bg-[#bfa086] text-[#2e3d30]"
                    }`}
                  >
                    {post.is_published ? "Publicado" : "Rascunho"}
                  </span>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => handleEdit(post)}
                      className="w-12 h-12 rounded-full bg-white text-[#2e3d30] hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                      title="Editar"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    {post.is_published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="w-12 h-12 rounded-full bg-white text-[#2e3d30] hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                        title="Ver no site"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(post)}
                      disabled={actionLoading === post.id}
                      className="w-12 h-12 rounded-full bg-[#87381e] text-white hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                      title="Excluir"
                    >
                      {actionLoading === post.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 items-center mb-2 text-[9px] font-['Spartan'] uppercase tracking-wider text-[#756d47]">
                    {post.category && (
                      <span className="bg-[#bfa086]/10 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    )}
                    <span>
                      {dateFormatter.format(new Date(post.published_at ?? post.updated_at))}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-[#2e3d30] mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm font-light text-[#756d47] line-clamp-2">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
