"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, X, FileImage, Loader2 } from "lucide-react";

interface FileUploadProps {
  solicitacaoId: string;
  value: string[];
  onChange: (paths: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

function FileUpload({
  solicitacaoId,
  value,
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`"${file.name}" excede ${maxSizeMB}MB.`);
      return null;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("uploadId", solicitacaoId);

    const res = await fetch("/api/simulacao/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(data.error ?? `Erro ao enviar "${file.name}".`);
      return null;
    }
    return data.path as string;
  };

  const handleFiles = async (files: FileList) => {
    setError(null);
    const remaining = maxFiles - value.length;
    if (remaining <= 0) {
      setError(`Máximo de ${maxFiles} arquivos atingido.`);
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    const results = await Promise.all(toUpload.map(uploadFile));
    const paths = results.filter(Boolean) as string[];
    onChange([...value, ...paths]);
    setUploading(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  };

  const removeFile = async (path: string) => {
    onChange(value.filter((p) => p !== path));
    await fetch("/api/simulacao/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  };

  const filename = (path: string) => path.split("/").pop() ?? path;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200",
          dragging ? "border-[#87381e] bg-[#87381e]/5" : "border-[#bfa086]/40 hover:border-[#bfa086] hover:bg-[#bfa086]/5",
          (value.length >= maxFiles || uploading) && "opacity-60 pointer-events-none",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        {uploading ? (
          <Loader2 className="h-8 w-8 text-[#87381e] animate-spin" />
        ) : (
          <UploadCloud className="h-8 w-8 text-[#bfa086]" />
        )}
        <div className="text-center">
          <p className="text-sm text-[#2e3d30] font-light">
            {uploading ? "Enviando..." : "Arraste imagens ou clique para selecionar"}
          </p>
          <p className="text-[10px] font-['Spartan'] uppercase tracking-widest text-[#756d47] mt-1">
            {maxFiles} arquivos máx · {maxSizeMB}MB cada · JPG, PNG, PDF
          </p>
        </div>
      </div>

      {error && <p className="text-xs text-[#87381e] font-light">{error}</p>}

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((path) => (
            <li
              key={path}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#bfa086]/10 border border-[#bfa086]/20"
            >
              <FileImage className="h-4 w-4 text-[#87381e] shrink-0" />
              <span className="text-xs text-[#2e3d30] font-light truncate flex-1">
                {filename(path)}
              </span>
              <button
                type="button"
                onClick={() => removeFile(path)}
                className="shrink-0 text-[#756d47] hover:text-[#87381e] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { FileUpload };
