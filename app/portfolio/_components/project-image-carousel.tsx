"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
  sizes: string;
}

export default function ProjectImageCarousel({ images, alt, sizes }: Props) {
  const [idx, setIdx] = useState(0);

  if (images.length <= 1) {
    return (
      <Image
        src={images[0]}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % images.length);
  };

  return (
    <>
      <Image
        src={images[idx]}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        aria-label="Próxima foto"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
