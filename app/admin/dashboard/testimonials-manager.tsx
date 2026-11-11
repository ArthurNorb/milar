"use client";

import { useEffect, useState } from "react";
import {
  approveTestimonial,
  deleteTestimonial,
  listAllTestimonials,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Check,
  Trash2,
  Quote,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import type { Testimonial } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchTestimonials = async () => {
    try {
      const result = await listAllTestimonials();
      if (!result.ok) throw new Error(result.error);
      setTestimonials(result.data);
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: `Erro ao carregar depoimentos: ${getErrorMessage(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inicial dos dados na montagem (via Server Action)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const result = await approveTestimonial(id);
      if (!result.ok) throw new Error(result.error);

      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_approved: true } : t)),
      );
      setMessage({
        type: "success",
        text: "Depoimento aprovado com sucesso! Ele já está visível no site.",
      });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: `Falha na aprovação: ${getErrorMessage(error)}`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir permanentemente este depoimento?",
      )
    )
      return;

    setActionLoading(id);
    try {
      const result = await deleteTestimonial(id);
      if (!result.ok) throw new Error(result.error);

      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setMessage({ type: "success", text: "Depoimento removido do sistema." });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: `Falha ao excluir: ${getErrorMessage(error)}`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingTestimonials = testimonials.filter((t) => !t.is_approved);
  const approvedTestimonials = testimonials.filter((t) => t.is_approved);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Sistema de Alertas */}
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
          <AlertTitle className="font-serif text-lg">Curadoria</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Seção de Pendentes */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#bfa086]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#87381e]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#87381e]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-[#2e3d30]">
                Aguardando Revisão
              </h2>
              <p className="text-[10px] font-['Spartan'] uppercase tracking-widest text-[#756d47]">
                {pendingTestimonials.length} novos depoimentos
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-12 text-[#756d47]">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="font-light italic">Sincronizando depoimentos...</p>
          </div>
        ) : pendingTestimonials.length === 0 ? (
          <div className="py-12 text-center rounded-[2rem] border border-dashed border-[#bfa086]/30">
            <p className="text-[#756d47] font-light italic">
              Nenhum depoimento pendente no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onApprove={handleApprove}
                onDelete={handleDelete}
                loading={actionLoading === testimonial.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Seção de Aprovados */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#bfa086]/30 pb-4">
          <div className="w-10 h-10 rounded-full bg-[#2e3d30]/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#2e3d30]" />
          </div>
          <h2 className="text-2xl font-serif text-[#2e3d30]">
            Publicados no Site
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onDelete={handleDelete}
              loading={actionLoading === testimonial.id}
            />
          ))}
          {approvedTestimonials.length === 0 && !loading && (
            <p className="col-span-full text-[#756d47] font-light italic py-4">
              Sua vitrine de feedbacks ainda está vazia.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  onApprove?: (id: number) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

function TestimonialCard({
  testimonial,
  onApprove,
  onDelete,
  loading,
}: TestimonialCardProps) {
  const isPending = !testimonial.is_approved;

  return (
    <Card
      className={`border-none transition-all duration-500 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl ${isPending ? "bg-[#bfa086]/5 ring-1 ring-[#87381e]/10" : "bg-white"}`}
    >
      <CardContent className="p-8 space-y-6">
        <div className="relative">
          <Quote className="absolute -top-4 -left-4 h-8 w-8 text-[#87381e]/10" />
          <blockquote className="text-lg md:text-xl font-serif font-light leading-relaxed text-[#2e3d30] relative z-10 italic">
            &quot;{testimonial.text}&quot;
          </blockquote>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6 pt-4 border-t border-[#bfa086]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2e3d30] flex items-center justify-center text-[#e3d9ce] font-serif">
              {testimonial.client_name.charAt(0)}
            </div>
            <div>
              <p className="font-['Spartan'] text-[10px] uppercase tracking-[0.15em] font-bold text-[#2e3d30]">
                {testimonial.client_name}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#756d47] mt-0.5">
                <Clock className="h-3 w-3" />
                {new Date(testimonial.created_at).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {onApprove && isPending && (
              <Button
                size="sm"
                className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-[#2e3d30] hover:bg-[#2e3d30]/90"
                onClick={() => onApprove(testimonial.id)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Aprovar
                  </>
                )}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none h-10 px-6 rounded-xl border-[#87381e]/20 text-[#87381e] hover:bg-[#87381e]/5"
              onClick={() => onDelete(testimonial.id)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
