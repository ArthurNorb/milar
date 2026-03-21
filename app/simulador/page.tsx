"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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

  const roomOptions = ["Sala de estar", "Cozinha", "Quarto principal", "Quarto infantil", "Banheiro", "Escritório", "Área externa", "Lavanderia"];

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
    <div className="py-24 md:py-32">
      <div className="container max-w-screen-2xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-tight">
              Simulador de Orçamento
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Descubra o investimento para transformar seu ambiente com neuroarquitetura.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-12">
            <Progress value={progress} className="h-1 rounded-full transition-all duration-500" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground/80 uppercase tracking-wide">
              <span>Autenticação</span>
              <span>Propriedade</span>
              <span>Ambientes</span>
              <span>Necessidades</span>
              <span>Confirmação</span>
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-border/30 shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                {step === "auth" && "Faça login ou cadastre-se"}
                {step === "property" && "Sobre a propriedade"}
                {step === "rooms" && "Ambientes a projetar"}
                {step === "needs" && "Necessidades específicas"}
                {step === "confirm" && "Revisão e confirmação"}
                {step === "success" && "Simulação enviada!"}
              </CardTitle>
              <CardDescription>
                {step === "auth" && "Precisamos do seu e-mail para salvar a simulação."}
                {step === "property" && "Informações básicas sobre o local."}
                {step === "rooms" && "Quais cômodos você deseja projetar?"}
                {step === "needs" && "Conte-nos mais sobre suas expectativas."}
                {step === "confirm" && "Verifique os dados antes de enviar."}
                {step === "success" && "Sua simulação foi recebida com sucesso."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {step === "auth" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="border-border/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 py-3"
                    />
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="border-border/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 py-3"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ao continuar, você concorda com nossos termos de uso e política de privacidade.
                  </p>
                </div>
              )}

              {step === "property" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <Label htmlFor="propertyType">Tipo de propriedade *</Label>
                    <Select
                      value={form.propertyType as string}
                      onValueChange={(value) => setForm({ ...form, propertyType: value || "" })}
                    >
                      <SelectTrigger className="border-border/70 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 py-3">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="apartment">Apartamento</SelectItem>
                        <SelectItem value="commercial">Comercial</SelectItem>
                        <SelectItem value="office">Escritório</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label htmlFor="area">Área total (m²) *</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="Ex: 120"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="border-border/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 py-3"
                    />
                  </div>
                </div>
              )}

              {step === "rooms" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-sm text-muted-foreground">
                    Selecione todos os ambientes que deseja incluir no projeto.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {roomOptions.map((room) => (
                      <div key={room} className="flex items-center space-x-2">
                        <Checkbox
                          id={room}
                          checked={form.rooms.includes(room)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setForm({ ...form, rooms: [...form.rooms, room] });
                            } else {
                              setForm({ ...form, rooms: form.rooms.filter(r => r !== room) });
                            }
                          }}
                          className="border-border/70 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={room}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {room}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === "needs" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <Label htmlFor="needs">Conte-nos mais sobre suas necessidades e expectativas</Label>
                  <Textarea
                    id="needs"
                    placeholder="Ex: Preciso de um home office que promova concentração, quarto infantil lúdico, sala de estar acolhedora para receber amigos..."
                    rows={6}
                    value={form.needs}
                    onChange={(e) => setForm({ ...form, needs: e.target.value })}
                    className="border-border/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 py-3"
                  />
                  <p className="text-sm text-muted-foreground">
                    Quanto mais detalhes, mais precisa será a simulação.
                  </p>
                </div>
              )}

              {step === "confirm" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="rounded-lg border border-border/50 p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="font-medium">{form.name || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">E-mail</p>
                        <p className="font-medium">{form.email || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo de propriedade</p>
                        <p className="font-medium">{form.propertyType || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Área (m²)</p>
                        <p className="font-medium">{form.area || "Não informado"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ambientes selecionados</p>
                      <p className="font-medium">{form.rooms.length ? form.rooms.join(", ") : "Nenhum"}</p>
                    </div>
                    {form.needs && (
                      <div>
                        <p className="text-sm text-muted-foreground">Necessidades específicas</p>
                        <p className="font-medium">{form.needs}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Após enviar, Giovanna Lima entrará em contato em até 48 horas para apresentar os detalhes e finalizar seu orçamento.
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-12 animate-in fade-in duration-300">
                  <CheckCircle className="h-20 w-20 text-primary mx-auto mb-8 animate-pulse" />
                  <h3 className="text-3xl font-heading font-light mb-6">
                    Simulação recebida!
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Obrigado pela sua submissão. Giovanna Lima entrará em contato em breve para apresentar os detalhes e finalizar seu orçamento.
                  </p>
                  <div className="mt-8">
                    <Button>
                      <a href="/">Voltar para a página inicial</a>
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Navigation */}
              {step !== "success" && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border/40">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === "auth" || loading}
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
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : step === "confirm" ? (
                      "Enviar simulação"
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Esta simulação é preliminar. O orçamento final será elaborado após análise detalhada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}