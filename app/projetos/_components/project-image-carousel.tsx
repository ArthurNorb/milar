"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
  sizes: string;
}

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

export default function ProjectImageCarousel({ images, alt, sizes }: Props) {
  const [idx, setIdx] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const total = images.length;

  const goTo = useCallback(
    (newIdx: number) => {
      setIdx(((newIdx % total) + total) % total);
      setUserInteracted(true);
    },
    [total],
  );

  useEffect(() => {
    if (userInteracted || total <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [userInteracted, total]);

  if (total <= 1) {
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const delta = touchDeltaX.current;
    if (delta <= -SWIPE_THRESHOLD) goTo(idx + 1);
    else if (delta >= SWIPE_THRESHOLD) goTo(idx - 1);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div
      className="absolute inset-0 touch-pan-y select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt={`${alt} — foto ${i + 1} de ${total}`}
          fill
          sizes={sizes}
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ease-out group-hover:scale-110 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goTo(idx - 1);
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center transition-opacity hover:bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goTo(idx + 1);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center transition-opacity hover:bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label="Próxima foto"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
