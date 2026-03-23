"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Briefcase,
  Cpu,
  FileDown,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

type CurriculumItem = {
  id: number;
  type: "education" | "experience" | "skill";
  title: string;
  description: string | null;
  start_year: number | null;
  end_year: number | null;
};

export default function CurriculumManager() {
  const [items, setItems] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  // Form state
  const [editingItem, setEditingItem] = useState<CurriculumItem | null>(null);
  const [formType, setFormType] = useState<
    "education" | "experience" | "skill"
  >("education");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartYear, setFormStartYear] = useState("");
  const [formEndYear, setFormEndYear] = useState("");

  useEffect(() => {
    fetchCurriculum();
    fetchCvUrl();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const { data, error } = await supabase
        .from("curriculum")
        .select("*")
        .order("type")
        .order("start_year", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Erro ao carregar currículo: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCvUrl = async () => {
    try {
      const { data } = await supabase.storage
        .from("project-images")
        .list("cv", { limit: 1 });

      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(`cv/${data[0].name}`);
        setCvUrl(urlData.publicUrl);
      }
    } catch (error) {
      console.error("Falha ao buscar URL do CV:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    const itemData = {
      type: formType,
      title: formTitle,
      description: formDescription || null,
      start_year: formStartYear ? parseInt(formStartYear) : null,
      end_year: formEndYear ? parseInt(formEndYear) : null,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("curriculum")
          .update(itemData)
          .eq("id", editingItem.id);

        if (error) throw error;
        setMessage({ type: "success", text: "Item atualizado com sucesso!" });
      } else {
        const { error } = await supabase.from("curriculum").insert(itemData);

        if (error) throw error;
        setMessage({ type: "success", text: "Novo item adicionado!" });
      }

      fetchCurriculum();
      resetForm();
    } catch (error: any) {
      setMessage({ type: "error", text: `Erro ao salvar: ${error.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const { error } = await supabase.from("curriculum").delete().eq("id", id);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: "success", text: "Item removido!" });
    } catch (error: any) {
      setMessage({ type: "error", text: `Erro ao deletar: ${error.message}` });
    }
  };

  const handleEdit = (item: CurriculumItem) => {
    setEditingItem(item);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormDescription(item.description || "");
    setFormStartYear(item.start_year?.toString() || "");
    setFormEndYear(item.end_year?.toString() || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormType("education");
    setFormTitle("");
    setFormDescription("");
    setFormStartYear("");
    setFormEndYear("");
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;
    setActionLoading(true);

    try {
      const fileExt = cvFile.name.split(".").pop();
      const fileName = `cv_milar_${Date.now()}.${fileExt}`;
      const filePath = `cv/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, cvFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      setCvUrl(urlData.publicUrl);
      setMessage({ type: "success", text: "Arquivo PDF atualizado!" });
      setCvFile(null);
    } catch (error: any) {
      setMessage({ type: "error", text: `Erro no upload: ${error.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  const groupedItems = {
    education: items.filter((item) => item.type === "education"),
    experience: items.filter((item) => item.type === "experience"),
    skill: items.filter((item) => item.type === "skill"),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Feedback de Sistema */}
      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "destructive"}
          className="animate-in slide-in-from-top-2"
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {message.type === "success" ? "Sucesso" : "Erro"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna da Esquerda: Gestão de Arquivos e Formulário */}
        <div className="lg:col-span-5 space-y-8">
          {/* Upload de PDF */}
          <Card className="border-none bg-[#2e3d30] text-[#e3d9ce] rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 text-[#bfa086] mb-1">
                <FileDown className="w-4 h-4" />
                <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                  Arquivo Digital
                </span>
              </div>
              <CardTitle className="text-2xl font-serif">
                Currículo em PDF
              </CardTitle>
              <CardDescription className="text-[#e3d9ce]/60 font-light">
                O arquivo que os clientes baixarão no site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="group relative border-2 border-dashed border-[#e3d9ce]/20 rounded-2xl p-6 text-center hover:border-[#bfa086]/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
                <div className="space-y-2">
                  <p className="text-sm font-light">
                    {cvFile ? cvFile.name : "Clique ou arraste o novo PDF"}
                  </p>
                </div>
              </div>

              {cvUrl && (
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-['Spartan'] uppercase tracking-wider opacity-70">
                    Arquivo Atual
                  </span>
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#bfa086] hover:underline text-xs"
                  >
                    Visualizar
                  </a>
                </div>
              )}

              <Button
                onClick={handleCvUpload}
                disabled={!cvFile || actionLoading}
                className="w-full bg-[#87381e] hover:bg-[#87381e]/80"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Atualizar PDF"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Formulário de Itens */}
          <Card className="border-none bg-[#e3d9ce] rounded-[2rem] shadow-lg border border-[#bfa086]/20">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-[#2e3d30]">
                {editingItem ? "Editar Registro" : "Novo Registro"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Tipo de Informação</Label>
                  <Select
                    value={formType}
                    onValueChange={(value: any) => setFormType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Educação</SelectItem>
                      <SelectItem value="experience">Experiência</SelectItem>
                      <SelectItem value="skill">
                        Habilidade (Hard Skill)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título / Instituição</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={
                      formType === "skill" ? "Ex: Revit" : "Ex: UFOP"
                    }
                    required
                  />
                </div>

                {formType !== "skill" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Descrição do Cargo/Curso
                      </Label>
                      <Textarea
                        id="description"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Ex: Bacharelado em Arquitetura..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startYear">Ano Início</Label>
                        <Input
                          id="startYear"
                          type="number"
                          value={formStartYear}
                          onChange={(e) => setFormStartYear(e.target.value)}
                          placeholder="2016"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endYear">Ano Fim</Label>
                        <Input
                          id="endYear"
                          type="number"
                          value={formEndYear}
                          onChange={(e) => setFormEndYear(e.target.value)}
                          placeholder="2021"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : editingItem ? (
                      "Salvar Alterações"
                    ) : (
                      "Adicionar ao Currículo"
                    )}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Lista de Itens Existentes */}
        <div className="lg:col-span-7 space-y-10">
          {/* Educação & Experiência */}
          <div className="space-y-12">
            <CurriculumSection
              title="Educação"
              icon={<GraduationCap className="w-5 h-5" />}
              items={groupedItems.education}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />

            <CurriculumSection
              title="Experiência"
              icon={<Briefcase className="w-5 h-5" />}
              items={groupedItems.experience}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />

            {/* Hard Skills - Visualização em Badges */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#bfa086]/30 pb-4">
                <Cpu className="w-5 h-5 text-[#87381e]" />
                <h3 className="font-serif text-2xl text-[#2e3d30]">
                  Hard Skills
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {groupedItems.skill.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-[#bfa086]/40 shadow-sm hover:border-[#87381e] transition-all"
                  >
                    <span className="text-sm font-light text-[#2e3d30]">
                      {item.title}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#87381e] hover:scale-125 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {!loading && groupedItems.skill.length === 0 && (
                  <p className="text-sm text-[#756d47] italic">
                    Nenhuma habilidade cadastrada.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function CurriculumSection({
  title,
  icon,
  items,
  onEdit,
  onDelete,
  loading,
}: any) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-[#bfa086]/30 pb-4">
        <div className="text-[#87381e]">{icon}</div>
        <h3 className="font-serif text-2xl text-[#2e3d30]">{title}</h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#756d47]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Carregando dados...</span>
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#756d47] italic">
          Nenhum registro encontrado.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="group p-6 bg-white rounded-3xl border border-[#bfa086]/20 hover:border-[#87381e]/40 transition-all flex justify-between items-start gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-[#2e3d30]">{item.title}</h4>
                  {(item.start_year || item.end_year) && (
                    <span className="text-[10px] font-['Spartan'] uppercase tracking-widest text-[#87381e] bg-[#87381e]/5 px-2 py-0.5 rounded-full">
                      {item.start_year} - {item.end_year || "Presente"}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm font-light text-[#756d47] line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 text-[#2e3d30]"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(item.id)}
                  className="h-8 w-8 text-[#87381e]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
