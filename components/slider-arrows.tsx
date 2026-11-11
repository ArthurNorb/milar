import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  onPrev: () => void;
  onNext: () => void;
  /** Posição vertical (classes de `top-*`). */
  topClassName?: string;
  /** Cores dos botões. */
  buttonClassName: string;
}

/** Setas do carrossel: sempre visíveis no mobile, só no hover do `group/slider` no desktop. */
export default function SliderArrows({
  onPrev,
  onNext,
  topClassName = "top-1/2",
  buttonClassName,
}: Props) {
  const base = `absolute ${topClassName} -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-opacity opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 focus-visible:opacity-100 ${buttonClassName}`;

  return (
    <>
      <button
        type="button"
        aria-label="Anterior"
        onClick={onPrev}
        className={`${base} left-2`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Próximo"
        onClick={onNext}
        className={`${base} right-2`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
}
