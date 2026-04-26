"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { MultiSelectChips } from "@/components/ui/multi-select-chips";
import { FileUpload } from "@/components/ui/file-upload";
import { AmbientesSelector } from "./_components/ambientes-selector";
import { Stepper } from "@/components/ui/stepper";
import {
  RadioGroup,
  RadioGroupHorizontal,
  RadioItem,
  RadioItemCompact,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { StyleMatrix } from "./_components/style-matrix";
import { ImportanceRank } from "./_components/importance-rank";
import { ReviewSection } from "./_components/review-section";
import {
  OrcamentoFormData,
  ORCAMENTO_FORM_INITIAL,
} from "@/lib/orcamento-types";

type Step =
  | "identification"
  | "scope"
  | "preferences"
  | "subjective"
  | "final"
  | "review"
  | "success";

const STEPS = [
  { key: "identification", label: "Contato" },
  { key: "scope", label: "Escopo" },
  { key: "preferences", label: "Estilo" },
  { key: "subjective", label: "Subjetivas" },
  { key: "final", label: "Finalizar" },
];

const AMBIENTES = [
  "Quarto", "Banheiro", "Lavabo", "Cozinha", "Sala", "Varanda",
  "Área serviço", "Despensa", "Área externa", "Corredor",
  "Escritório", "Closet", "Garagem",
];

const AMBIENTES_PRIORITARIOS = [
  "Sala Estar/TV", "Cozinha Integrada", "Lavanderia", "Escritório",
  "Área Gourmet", "Piscina", "Suíte Master", "Quartos Hóspedes",
  "Garagem", "Outros",
];

const INVESTIMENTOS = [
  "Abaixo de 50 mil",
  "50 a 100 mil",
  "100 a 300 mil",
  "300 a 500 mil",
  "500 mil a 1 milhão",
  "Acima de 1 milhão",
  "Não tenho estimativa",
];

const CORES = ["Neutros", "Vibrantes", "Terrosos", "Frias", "Sem preferência"];

const UPLOAD_TEMP_ID = `tmp-${Date.now()}`;

// Helpers
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (!d.length) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SimuladorPage() {
  const [step, setStep] = useState<Step>("identification");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<OrcamentoFormData>(ORCAMENTO_FORM_INITIAL);
  const [uploadId] = useState(UPLOAD_TEMP_ID);

  // local state para inputs auxiliares
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [novoAmbiente, setNovoAmbiente] = useState("");

  const patch = (partial: Partial<OrcamentoFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const isReviewOrSuccess = step === "review" || step === "success";

  const phoneDigits = form.telefone.replace(/\D/g, "");
  const emailOk = isValidEmail(form.email);
  const phoneOk = phoneDigits.length === 11;

  const canAdvance = (): boolean => {
    if (step === "identification")
      return !!(form.nome && emailOk && phoneOk && form.tipoProjeto && form.tipoImovel);
    if (step === "scope")
      return !!(form.descricaoEscopo.length >= 30 && form.investimento && form.moradoresQuantidade);
    if (step === "preferences") return true;
    if (step === "subjective")
      return !!(
        form.subjetivaSabado &&
        form.subjetivaComodo &&
        form.subjetivaEstiloVida &&
        form.subjetivaRestricoes &&
        form.subjetivaMotivacao &&
        form.prazoData
      );
    if (step === "final") return form.aceiteMinimo && form.aceiteLgpd;
    return true;
  };

  const handleNext = async () => {
    setError(null);
    if (step === "identification") setStep("scope");
    else if (step === "scope") setStep("preferences");
    else if (step === "preferences") setStep("subjective");
    else if (step === "subjective") setStep("final");
    else if (step === "final") setStep("review");
    else if (step === "review") await handleSubmit();
  };

  const handleBack = () => {
    if (step === "scope") setStep("identification");
    else if (step === "preferences") setStep("scope");
    else if (step === "subjective") setStep("preferences");
    else if (step === "final") setStep("subjective");
    else if (step === "review") setStep("final");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/simulacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, uploadId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao enviar solicitação");
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Ages dinâmicas por morador
  const qtdMoradores = parseInt(form.moradoresQuantidade) || 0;
  const ages = form.moradoresIdades
    ? form.moradoresIdades.split(",").map((s) => s.trim())
    : [];
  const setAge = (i: number, val: string) => {
    const next = [...ages];
    next[i] = val.replace(/\D/g, "").slice(0, 3);
    patch({ moradoresIdades: next.join(", ") });
  };

  // Adicionar ambiente customizado
  const addNovoAmbiente = () => {
    const nome = novoAmbiente.trim();
    if (!nome || form.ambientes.some((a) => a.nome === nome)) return;
    patch({ ambientes: [...form.ambientes, { nome, quantidade: 1 }] });
    setNovoAmbiente("");
  };

  const stepTitle: Record<Step, string> = {
    identification: "Contato e Imóvel",
    scope: "Escopo e Investimento",
    preferences: "Preferências e Estilo",
    subjective: "Subjetivas e Prazos",
    final: "Finalização",
    review: "Revise as informações",
    success: "Tudo pronto!",
  };

  const stepDescription: Record<Step, string> = {
    identification: "Vamos nos conhecer e entender sobre o imóvel.",
    scope: "Detalhes sobre os ambientes, escopo e investimento.",
    preferences: "Suas preferências de estilo, cores e referências.",
    subjective: "Perguntas sobre sua vida e expectativas para o projeto.",
    final: "Último passo antes de enviar para a Giovanna.",
    review: "Verifique tudo antes de enviar sua solicitação.",
    success: "Sua solicitação foi enviada com sucesso!",
  };

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-700">
      {!isReviewOrSuccess && (
        <div className="mb-8 md:mb-12">
          <Stepper steps={STEPS} currentStep={step} />
        </div>
      )}

      <Card className="border-none shadow-2xl bg-[#e3d9ce]/95 backdrop-blur-md">
        <CardHeader className="pb-4 border-b border-[#bfa086]/20">
          <CardTitle>{stepTitle[step]}</CardTitle>
          <CardDescription>{stepDescription[step]}</CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          {/* ── Step 1: Identificação ── */}
          {step === "identification" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={form.nome}
                    onChange={(e) => patch({ nome: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    aria-invalid={emailTouched && !emailOk}
                    onBlur={() => setEmailTouched(true)}
                    onChange={(e) => patch({ email: e.target.value })}
                  />
                  {emailTouched && !emailOk && form.email.length > 0 && (
                    <p className="text-[10px] text-[#87381e] font-['Spartan'] uppercase tracking-widest">
                      Email inválido
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(31) 99999-0000"
                    value={form.telefone}
                    aria-invalid={phoneTouched && !phoneOk}
                    onBlur={() => setPhoneTouched(true)}
                    onChange={(e) => patch({ telefone: formatPhone(e.target.value) })}
                  />
                  {phoneTouched && !phoneOk && form.telefone.length > 0 && (
                    <p className="text-[10px] text-[#87381e] font-['Spartan'] uppercase tracking-widest">
                      Informe DDD + 9 dígitos
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#756d47] select-none pointer-events-none">
                      @
                    </span>
                    <Input
                      id="instagram"
                      placeholder="seu.perfil"
                      value={form.instagram}
                      className="pl-8"
                      onChange={(e) =>
                        patch({ instagram: e.target.value.replace(/^@+/, "") })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Tipo de projeto *</Label>
                <RadioGroupHorizontal
                  value={form.tipoProjeto}
                  onValueChange={(v) =>
                    patch({ tipoProjeto: v as OrcamentoFormData["tipoProjeto"] })
                  }
                >
                  <RadioItem value="Construção" label="Construção (terreno)" />
                  <RadioItem value="Reforma" label="Reforma (com demolição / construção)" />
                  <RadioItem value="Interiores" label="Interiores (sem demolição)" />
                </RadioGroupHorizontal>
              </div>

              <div className="space-y-3">
                <Label>Tipo de imóvel *</Label>
                <RadioGroupHorizontal
                  value={form.tipoImovel}
                  onValueChange={(v) =>
                    patch({ tipoImovel: v as OrcamentoFormData["tipoImovel"] })
                  }
                >
                  <RadioItem value="Residencial" label="Residencial" />
                  <RadioItem value="Comercial" label="Comercial" />
                  <RadioItem value="Corporativo" label="Corporativo" />
                </RadioGroupHorizontal>
              </div>
            </div>
          )}

          {/* ── Step 2: Escopo ── */}
          {step === "scope" && (
            <div className="space-y-7 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="space-y-3">
                <Label>Ambientes do imóvel</Label>
                <AmbientesSelector
                  options={[
                    ...AMBIENTES,
                    ...form.ambientes.filter((a) => !AMBIENTES.includes(a.nome)).map((a) => a.nome),
                  ]}
                  value={form.ambientes}
                  onChange={(v) => patch({ ambientes: v })}
                />
                {/* Adicionar ambiente customizado */}
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Outro ambiente..."
                    value={novoAmbiente}
                    onChange={(e) => setNovoAmbiente(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNovoAmbiente(); } }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNovoAmbiente}
                    disabled={!novoAmbiente.trim()}
                    className="shrink-0 gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Adicionar
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Ambientes prioritários</Label>
                <MultiSelectChips
                  options={AMBIENTES_PRIORITARIOS}
                  value={form.ambientesPrioritarios}
                  onChange={(v) => patch({ ambientesPrioritarios: v })}
                />
                {form.ambientesPrioritarios.includes("Outros") && (
                  <Input
                    placeholder="Especifique os outros ambientes prioritários"
                    value={form.outrosPrioritarios}
                    onChange={(e) => patch({ outrosPrioritarios: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="escopo">Descreva o escopo do projeto em detalhes *</Label>
                <Textarea
                  id="escopo"
                  placeholder="Ex: Construção nova de 200m², reforma da cozinha e sala, integração dos ambientes..."
                  value={form.descricaoEscopo}
                  onChange={(e) => patch({ descricaoEscopo: e.target.value })}
                />
                {form.descricaoEscopo.length > 0 && form.descricaoEscopo.length < 30 && (
                  <p className="text-[10px] font-['Spartan'] uppercase tracking-widest text-[#87381e]">
                    Mínimo de 30 caracteres ({form.descricaoEscopo.length}/30)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Faixa de investimento *</Label>
                <Select
                  value={form.investimento}
                  onValueChange={(v) => patch({ investimento: v ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma faixa" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTIMENTOS.map((inv) => (
                      <SelectItem key={inv} value={inv}>{inv}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Moradores com input individual por pessoa */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moradores">Quantas pessoas vão morar / usar o espaço? *</Label>
                  <Input
                    id="moradores"
                    type="number"
                    min={1}
                    max={20}
                    placeholder="Ex: 3"
                    value={form.moradoresQuantidade}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      patch({ moradoresQuantidade: val, moradoresIdades: "" });
                    }}
                  />
                </div>

                {qtdMoradores > 0 && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <Label>Idade de cada morador</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Array.from({ length: qtdMoradores }).map((_, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[9px] font-['Spartan'] uppercase tracking-widest text-[#756d47]">
                            Morador {i + 1}
                          </p>
                          <Input
                            type="number"
                            min={0}
                            max={120}
                            placeholder="Idade"
                            value={ages[i] ?? ""}
                            onChange={(e) => setAge(i, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Preferências ── */}
          {step === "preferences" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="space-y-4">
                <Label>Nível de importância (1 = Menos, 3 = Mais)</Label>
                <ImportanceRank
                  value={form.importancia}
                  onChange={(v) => patch({ importancia: v })}
                />
                {form.importancia.auxilioCondicaoFisica >= 2 && (
                  <div className="space-y-2 mt-4 animate-in fade-in duration-300">
                    <Label htmlFor="condicao">Conte mais sobre essa condição</Label>
                    <Textarea
                      id="condicao"
                      placeholder="Descreva a condição física ou psicológica que o projeto deve considerar..."
                      value={form.condicaoEspecial}
                      onChange={(e) => patch({ condicaoEspecial: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Cores preferidas</Label>
                <RadioGroup
                  value={form.corPreferida}
                  onValueChange={(v) => patch({ corPreferida: v })}
                  className="flex flex-row flex-wrap gap-3"
                >
                  {CORES.map((cor) => (
                    <RadioItemCompact key={cor} value={cor} label={cor} />
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label>Estilos arquitetônicos</Label>
                <p className="text-xs text-[#756d47] font-light -mt-1">
                  Avalie cada estilo conforme sua afinidade.
                </p>
                <StyleMatrix
                  value={form.estilos}
                  onChange={(v) => patch({ estilos: v })}
                />
              </div>

              <div className="space-y-3">
                <Label>
                  Sustentabilidade / Eficiência Energética{" "}
                  <span className="text-[#87381e]">{form.sustentabilidade}/10</span>
                </Label>
                <Slider
                  value={form.sustentabilidade}
                  onChange={(v) => patch({ sustentabilidade: v })}
                  min={1}
                  max={10}
                  minLabel="Não é prioridade"
                  maxLabel="Fundamental"
                />
              </div>

              <div className="space-y-3">
                <Label>Referências visuais</Label>
                <p className="text-xs text-[#756d47] font-light">
                  Envie imagens, fotos ou PDFs que inspiram seu projeto.
                </p>
                <FileUpload
                  solicitacaoId={uploadId}
                  value={form.referencias}
                  onChange={(v) => patch({ referencias: v })}
                  maxFiles={5}
                  maxSizeMB={5}
                />
              </div>
            </div>
          )}

          {/* ── Step 4: Subjetivas ── */}
          {step === "subjective" && (
            <div className="space-y-7 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="space-y-2">
                <Label htmlFor="sabado">Como seria um sábado perfeito no ambiente novo? *</Label>
                <Textarea
                  id="sabado"
                  placeholder="Descreva como você imagina esse dia ideal..."
                  value={form.subjetivaSabado}
                  onChange={(e) => patch({ subjetivaSabado: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comodo">Qual seu cômodo preferido na casa atual e por quê? *</Label>
                <Textarea
                  id="comodo"
                  placeholder="Me fale sobre esse espaço..."
                  value={form.subjetivaComodo}
                  onChange={(e) => patch({ subjetivaComodo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estilo-vida">Descreva seu estilo de vida e uso do espaço *</Label>
                <Textarea
                  id="estilo-vida"
                  placeholder="Ex: receber amigos aos fins de semana, home office diário, filhos pequenos..."
                  value={form.subjetivaEstiloVida}
                  onChange={(e) => patch({ subjetivaEstiloVida: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restricoes">Há restrições ou desafios do terreno/imóvel? *</Label>
                <Textarea
                  id="restricoes"
                  placeholder="Ex: pé direito baixo, inclinação do terreno, vizinhança..."
                  value={form.subjetivaRestricoes}
                  onChange={(e) => patch({ subjetivaRestricoes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivacao">Por que decidiu buscar esse serviço agora? *</Label>
                <Textarea
                  id="motivacao"
                  placeholder="O que motivou você nesse momento..."
                  value={form.subjetivaMotivacao}
                  onChange={(e) => patch({ subjetivaMotivacao: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="prazo">Data ideal de conclusão *</Label>
                  <Input
                    id="prazo"
                    type="date"
                    value={form.prazoData}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => patch({ prazoData: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>
                    Flexibilidade de prazo:{" "}
                    <span className="text-[#87381e]">{form.prazoFlexibilidade}/5</span>
                  </Label>
                  <Slider
                    value={form.prazoFlexibilidade}
                    onChange={(v) => patch({ prazoFlexibilidade: v })}
                    min={1}
                    max={5}
                    minLabel="Inegociável"
                    maxLabel="Muito flexível"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Finalização ── */}
          {step === "final" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="rounded-2xl border border-[#bfa086]/30 bg-[#bfa086]/10 p-6 space-y-5">
                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => patch({ aceiteMinimo: !form.aceiteMinimo })}
                >
                  <Checkbox
                    id="aceite-minimo"
                    checked={form.aceiteMinimo}
                    onCheckedChange={(v) => patch({ aceiteMinimo: !!v })}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="aceite-minimo"
                    className="text-sm text-[#2e3d30] font-light leading-relaxed cursor-pointer"
                  >
                    Estou ciente de que o projeto completo da{" "}
                    <span className="font-medium">Milar Arquitetura</span> tem valor mínimo de{" "}
                    <span className="font-medium text-[#87381e]">R$ 10.000,00</span>{" "}
                    e tenho interesse em saber mais.
                  </label>
                </div>

                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => patch({ aceiteLgpd: !form.aceiteLgpd })}
                >
                  <Checkbox
                    id="aceite-lgpd"
                    checked={form.aceiteLgpd}
                    onCheckedChange={(v) => patch({ aceiteLgpd: !!v })}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="aceite-lgpd"
                    className="text-sm text-[#2e3d30] font-light leading-relaxed cursor-pointer"
                  >
                    Concordo com o uso dos meus dados para contato sobre meu projeto, conforme a LGPD.
                  </label>
                </div>
              </div>

              <p className="text-center font-['Spartan'] text-[10px] uppercase tracking-widest text-[#756d47]">
                Ao clicar em "Continuar", você revisará suas respostas antes do envio final.
              </p>
            </div>
          )}

          {/* ── Step 6: Revisão ── */}
          {step === "review" && (
            <ReviewSection form={form} onEdit={(s) => setStep(s as Step)} />
          )}

          {/* ── Step 7: Sucesso ── */}
          {step === "success" && (
            <div className="text-center py-12 md:py-16 animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#87381e]/10 mb-8">
                <CheckCircle className="h-12 w-12 text-[#87381e]" />
              </div>
              <h3 className="text-3xl md:text-4xl font-serif text-[#2e3d30] leading-tight mb-6">
                Solicitação <br className="sm:hidden" /> enviada!
              </h3>
              <p className="text-base text-[#756d47] font-light max-w-sm mx-auto leading-relaxed mb-10">
                A Giovanna recebeu todas as suas respostas e entrará em contato em até 48 horas
                com uma proposta personalizada.
              </p>
              <Button render={<Link href="/" />} className="w-full sm:w-auto">
                Voltar para a página inicial
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-6 animate-in fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step !== "success" && (
            <div className="flex flex-col-reverse sm:flex-row justify-between mt-10 pt-6 border-t border-[#bfa086]/20 gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === "identification" || loading}
                className={`w-full sm:w-auto ${step === "identification" ? "opacity-0 pointer-events-none" : ""}`}
              >
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canAdvance() || loading}
                className="w-full sm:w-auto shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : step === "review" ? (
                  "Enviar para a Giovanna"
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="font-['Spartan'] text-[9px] uppercase tracking-[0.2em] text-[#756d47]/70">
          Seus dados estão seguros e serão usados apenas para contato sobre seu projeto.
        </p>
      </div>
    </div>
  );
}
