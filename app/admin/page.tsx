"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciais inválidas. Verifique seus dados.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e3d9ce] p-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 right-0 w-150 h-150 opacity-[0.03] pointer-events-none translate-x-1/4 -translate-y-1/4">
        <Image
          src="/estampas/Contorno Macro 02.png"
          alt=""
          fill
          className="animate-[spin_120s_linear_infinite]"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-100 h-100 opacity-[0.03] pointer-events-none -translate-x-1/4 translate-y-1/4">
        <Image src="/estampas/Preenchida Macro 03.png" alt="" fill />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-[#e3d9ce]/80 backdrop-blur-xl rounded-[2.5rem] relative z-10 overflow-hidden">
        {/* Barra de Acentuação Superior */}
        <div className="h-2 w-full bg-[#2e3d30]" />

        <CardHeader className="pt-10 pb-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#2e3d30] flex items-center justify-center shadow-inner">
              <Image
                src="/logotipos/Símbolo 01.png"
                alt="Milar Logo"
                width={32}
                height={32}
                className="brightness-0 invert opacity-90"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-serif text-[#2e3d30]">
            Acesso Restrito
          </CardTitle>
          <CardDescription className="font-['Spartan'] text-[10px] uppercase tracking-widest text-[#756d47] mt-2">
            Área Administrativa Milar
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Administrativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@milararquitetura.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/40 focus:bg-white/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/40 focus:bg-white/60"
                />
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-200 text-red-800 rounded-2xl"
              >
                <AlertDescription className="text-xs font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-xs uppercase tracking-widest font-['Spartan']"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Entrar no Painel
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#bfa086]/20 text-center">
            <p className="text-[10px] font-['Spartan'] uppercase tracking-wider text-[#756d47]/70 leading-relaxed">
              Este é um ambiente privado e monitorado. <br />
              Se esqueceu sua senha, contate o suporte técnico.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rodapé Discreto */}
      <div className="absolute bottom-6 w-full text-center">
        <p className="text-[9px] font-['Spartan'] uppercase tracking-[0.3em] text-[#2e3d30]/40">
          Milar Arquitetura © 2026
        </p>
      </div>
    </div>
  );
}
