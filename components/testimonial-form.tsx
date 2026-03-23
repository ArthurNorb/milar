"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, AlertCircle } from "lucide-react";

export default function TestimonialForm() {
  const [clientName, setClientName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from("testimonials").insert({
        client_name: clientName,
        text,
        is_approved: false,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Obrigada pelo seu depoimento! Ele será lido com muito carinho.",
      });
      setClientName("");
      setText("");
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Erro ao enviar depoimento: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-3">
        <Label htmlFor="clientName">Como gostaria de ser chamado?</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Seu nome"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="text">Sua experiência com a Milar</Label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Como os projetos de neuroarquitetura transformaram o seu ambiente?"
          rows={4}
          required
        />
      </div>

      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "destructive"}
          className="animate-in fade-in slide-in-from-bottom-2"
        >
          {message.type === "success" ? (
            <Sparkles className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {message.type === "success" ? "Sucesso" : "Atenção"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="pt-2 flex flex-col gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto self-end"
        >
          {loading ? "Enviando..." : "Enviar Depoimento"}
        </Button>
        <p className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#756d47] text-center sm:text-right mt-2">
          Seu depoimento será revisado antes da publicação.
        </p>
      </div>
    </form>
  );
}
