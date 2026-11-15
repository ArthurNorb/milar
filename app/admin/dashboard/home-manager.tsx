"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { getHomeImagesAdmin, resetHomeImage, setHomeImage } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-client";
import {
  HOME_IMAGE_DEFAULTS,
  type HomeImageSlot,
  type HomeImages,
} from "@/lib/home-images";

const SLOTS: readonly {
  slot: HomeImageSlot;
  title: string;
  description: string;
}[] = [
  {
    slot: "hero",
    title: "Foto principal (topo)",
    description: "Aparece ao lado do título, logo ao abrir o site.",
  },
  {
    slot: "about",
    title: "Foto da arquiteta",
    description: "Aparece na seção \"A Arquiteta\".",
  },
];

export default function HomeManager() {
  const [images, setImages] = useState<HomeImages | null>(null);
  const [busySlot, setBusySlot] = useState<HomeImageSlot | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Carga inicial dos dados na montagem (via Server Action)
    getHomeImagesAdmin()
      .then((result) => {
        if (!result.ok) throw new Error(result.error);
        setImages(result.data);
      })
      .catch((error: unknown) => {
        setMessage({ type: "error", text: getErrorMessage(error) });
      });
  }, []);

  const handleChange = async (
    slot: HomeImageSlot,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusySlot(slot);
    setMessage(null);
    try {
      const url = await uploadImage(file, "site");
      const result = await setHomeImage(slot, url);
      if (!result.ok) throw new Error(result.error);
      setImages(result.data);
      setMessage({ type: "success", text: "Foto atualizada na home." });
    } catch (error: unknown) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setBusySlot(null);
    }
  };

  const handleReset = async (slot: HomeImageSlot) => {
    if (!confirm("Voltar para a foto original desta posição?")) return;

    setBusySlot(slot);
    setMessage(null);
    try {
      const result = await resetHomeImage(slot);
      if (!result.ok) throw new Error(result.error);
      setImages(result.data);
      setMessage({ type: "success", text: "Foto original restaurada." });
    } catch (error: unknown) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setBusySlot(null);
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
            {message.type === "success" ? "Perfeito!" : "Ops, algo deu errado"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {!images ? (
        <div className="flex flex-col items-center py-12 text-[#756d47]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="font-light italic">Carregando fotos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SLOTS.map(({ slot, title, description }) => {
            const busy = busySlot === slot;
            const isDefault = images[slot] === HOME_IMAGE_DEFAULTS[slot];
            return (
              <Card
                key={slot}
                className="border-none bg-[#2e3d30] text-[#e3d9ce] rounded-[2rem] shadow-xl overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 text-[#bfa086] mb-1">
                    <ImagePlus className="w-4 h-4" />
                    <span className="font-['Spartan'] text-[10px] uppercase tracking-widest font-bold">
                      Foto da Home
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-serif">{title}</CardTitle>
                  <CardDescription className="text-[#e3d9ce]/60">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-[#e3d9ce]/10">
                    <Image
                      src={images[slot]}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover"
                    />
                    {busy && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#e3d9ce]" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <label
                      className={`relative flex items-center justify-center gap-2 h-14 rounded-xl bg-[#87381e] hover:bg-[#87381e]/80 text-[#e3d9ce] font-['Spartan'] text-xs tracking-widest uppercase shadow-lg transition-all cursor-pointer ${busy ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <ImagePlus className="w-4 h-4" />
                      Trocar foto
                      <input
                        type="file"
                        accept="image/*"
                        disabled={busy}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleChange(slot, e)}
                      />
                    </label>

                    {!isDefault && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={busy}
                        onClick={() => handleReset(slot)}
                        className="w-full h-12 border-[#e3d9ce]/20 text-[#e3d9ce] hover:bg-[#e3d9ce]/10 font-['Spartan'] text-[10px] tracking-widest uppercase rounded-xl"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Voltar à foto original
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
