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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Step = "auth" | "property" | "rooms" | "needs" | "confirm" | "success";

export default function SimulatorPage() {
  const [step, setStep] = useState<Step>("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  interface FormData {
    email: string;
    name: string;
    propertyType: string;
    area: string;
    rooms: string[];
    needs: string;
  }
  const [form, setForm] = useState<FormData>({
    email: "",
    name: "",
    propertyType: "",
    area: "",
    rooms: [],
    needs: "",
  });

  const roomOptions = [
    "Sala de estar",
    "Cozinha",
    "Quarto principal",
    "Quarto infantil",
    "Banheiro",
    "Escritório",
    "Área externa",
    "Lavanderia",
  ];

  const handleNext = async () => {
    setError(null);
    if (step === "auth") {
      // Mock authentication
      setLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setLoading(false);
        setStep("property");
      }, 800);
    } else if (step === "property") {
      setStep("rooms");
    } else if (step === "rooms") {
      setStep("needs");
    } else if (step === "needs") {
      setStep("confirm");
    } else if (step === "confirm") {
      setLoading(true);
      try {
        const response = await fetch("/api/simulacao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Erro ao enviar simulação");
        }
        setLoading(false);
        setStep("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === "property") setStep("auth");
    else if (step === "rooms") setStep("property");
    else if (step === "needs") setStep("rooms");
    else if (step === "confirm") setStep("needs");
  };

  const progress = {
    auth: 10,
    property: 30,
    rooms: 50,
    needs: 70,
    confirm: 90,
    success: 100,
  }[step];

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-700">
      {/* Progress Bar Simplificada e Elegante */}
      <div className="mb-8 md:mb-12">
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between mt-3 px-1">
          <span
            className={`text-[8px] sm:text-[10px] font-['Spartan'] uppercase tracking-widest ${step === "auth" ? "text-[#87381e] font-semibold" : "text-[#756d47]"}`}
          >
            Início
          </span>
          <span
            className={`text-[8px] sm:text-[10px] font-['Spartan'] uppercase tracking-widest ${step === "rooms" ? "text-[#87381e] font-semibold" : "text-[#756d47]"}`}
          >
            Ambientes
          </span>
          <span
            className={`text-[8px] sm:text-[10px] font-['Spartan'] uppercase tracking-widest ${step === "confirm" ? "text-[#87381e] font-semibold" : "text-[#756d47]"}`}
          >
            Revisão
          </span>
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-none shadow-2xl bg-[#e3d9ce]/95 backdrop-blur-md">
        <CardHeader className="pb-4 border-b border-[#bfa086]/20">
          <CardTitle>
            {step === "auth" && "Vamos nos conhecer?"}
            {step === "property" && "Sobre o seu espaço"}
            {step === "rooms" && "Quais ambientes vamos transformar?"}
            {step === "needs" && "Qual é o seu objetivo?"}
            {step === "confirm" && "Revise as informações"}
            {step === "success" && "Tudo pronto!"}
          </CardTitle>
          <CardDescription>
            {step === "auth" &&
              "Precisamos dos seus dados básicos para salvar a sua simulação."}
            {step === "property" &&
              "Conte-nos os detalhes físicos da sua propriedade."}
            {step === "rooms" &&
              "Selecione todos os cômodos que farão parte do projeto."}
            {step === "needs" &&
              "Descreva como você quer se sentir no seu novo refúgio."}
            {step === "confirm" &&
              "Verifique se os dados estão corretos antes de enviar para análise."}
            {step === "success" &&
              "Sua simulação foi enviada com sucesso para a nossa equipe."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          {step === "auth" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Como podemos te chamar? *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Seu melhor e-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <p className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#756d47] pt-2">
                Seus dados estão seguros. Ao continuar, você concorda com nossos
                termos.
              </p>
            </div>
          )}

          {step === "property" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Tipo de imóvel *</Label>
                  <Select
                    value={form.propertyType ?? ""} // Garante que se for null, passe uma string vazia
                    onValueChange={
                      (value) => setForm({ ...form, propertyType: value ?? "" }) // Garante que o estado receba string
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de propriedade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Comercial">
                        Espaço Comercial
                      </SelectItem>
                      <SelectItem value="Escritório">
                        Escritório / Clínica
                      </SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área aproximada (m²) *</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="Ex: 120"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === "rooms" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roomOptions.map((room) => (
                  <div
                    key={room}
                    className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${form.rooms.includes(room) ? "bg-[#2e3d30]/5 border-[#2e3d30]/30" : "bg-transparent border-[#bfa086]/30 hover:border-[#bfa086]"}`}
                    onClick={() => {
                      if (form.rooms.includes(room)) {
                        setForm({
                          ...form,
                          rooms: form.rooms.filter((r) => r !== room),
                        });
                      } else {
                        setForm({ ...form, rooms: [...form.rooms, room] });
                      }
                    }}
                  >
                    <Checkbox
                      id={room}
                      checked={form.rooms.includes(room)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setForm({ ...form, rooms: [...form.rooms, room] });
                        } else {
                          setForm({
                            ...form,
                            rooms: form.rooms.filter((r) => r !== room),
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor={room}
                      className="text-sm text-[#2e3d30] font-light cursor-pointer select-none w-full"
                    >
                      {room}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "needs" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="space-y-3">
                <Textarea
                  id="needs"
                  placeholder="Ex: Quero uma sala de estar bem iluminada que passe tranquilidade depois do trabalho. Preciso de um quarto infantil focado na autonomia da criança..."
                  value={form.needs}
                  onChange={(e) => setForm({ ...form, needs: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="rounded-3xl border border-[#bfa086]/40 bg-[#bfa086]/5 p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#87381e] mb-1">
                      Cliente
                    </p>
                    <p className="font-light text-[#2e3d30] text-lg">
                      {form.name || "Não informado"}
                    </p>
                    <p className="font-light text-[#756d47] text-sm">
                      {form.email || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <p className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#87381e] mb-1">
                      Propriedade
                    </p>
                    <p className="font-light text-[#2e3d30] text-lg">
                      {form.propertyType || "Não informado"}
                    </p>
                    <p className="font-light text-[#756d47] text-sm">
                      {form.area ? `${form.area} m²` : "Área não informada"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#bfa086]/20">
                  <p className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#87381e] mb-2">
                    Ambientes Selecionados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {form.rooms.length ? (
                      form.rooms.map((room) => (
                        <span
                          key={room}
                          className="px-3 py-1 bg-[#2e3d30] text-[#e3d9ce] rounded-full text-xs font-light"
                        >
                          {room}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#756d47] font-light text-sm">
                        Nenhum ambiente selecionado
                      </span>
                    )}
                  </div>
                </div>

                {form.needs && (
                  <div className="pt-4 border-t border-[#bfa086]/20">
                    <p className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#87381e] mb-2">
                      Expectativas
                    </p>
                    <p className="font-light text-[#2e3d30] text-sm leading-relaxed italic">
                      "{form.needs}"
                    </p>
                  </div>
                )}
              </div>

              <p className="text-center font-['Spartan'] text-[10px] uppercase tracking-widest text-[#756d47]">
                Sua simulação será analisada por Giovanna Lima.
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-12 md:py-16 animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#87381e]/10 mb-8">
                <CheckCircle className="h-12 w-12 text-[#87381e]" />
              </div>
              <h3 className="text-3xl md:text-4xl font-serif text-[#2e3d30] leading-tight mb-6">
                Informações <br className="sm:hidden" /> recebidas!
              </h3>
              <p className="text-base text-[#756d47] font-light max-w-sm mx-auto leading-relaxed mb-10">
                Agradecemos a confiança. Nossa equipe analisará os detalhes do
                seu refúgio e entrará em contato em até 48 horas.
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

          {/* Navigation */}
          {step !== "success" && (
            <div className="flex flex-col-reverse sm:flex-row justify-between mt-10 pt-6 border-t border-[#bfa086]/20 gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === "auth" || loading}
                className={`w-full sm:w-auto ${step === "auth" ? "opacity-0 pointer-events-none" : ""}`}
              >
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (step === "auth" && (!form.email || !form.name)) ||
                  (step === "property" && (!form.propertyType || !form.area)) ||
                  (step === "rooms" && form.rooms.length === 0) ||
                  loading
                }
                className="w-full sm:w-auto shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : step === "confirm" ? (
                  "Enviar Simulação"
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nota de rodapé (Disclaimer) */}
      <div className="mt-8 text-center">
        <p className="font-['Spartan'] text-[9px] uppercase tracking-[0.2em] text-[#756d47]/70">
          Esta simulação é uma etapa preliminar. <br className="md:hidden" />O
          orçamento oficial será formalizado após contato direto.
        </p>
      </div>
    </div>
  );
}
