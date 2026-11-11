"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SliderArrows from "@/components/slider-arrows";
import type { Testimonial } from "@/lib/types";
import { useAutoSlider } from "@/lib/use-auto-slider";

const VISIBLE_DESKTOP = 4;
const DESKTOP_MIN_WIDTH = 1024;
const INTERVAL_MS = 6000;

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Pick<Testimonial, "id" | "client_name" | "text">[];
}) {
  const slider = useAutoSlider(
    testimonials.length,
    VISIBLE_DESKTOP,
    INTERVAL_MS,
    DESKTOP_MIN_WIDTH,
  );

  const items = slider.active
    ? [...testimonials, ...testimonials.slice(0, slider.visible)]
    : testimonials;

  return (
    <div
      className="relative group/slider"
      onMouseEnter={slider.pause}
      onMouseLeave={slider.resume}
      {...slider.swipeHandlers}
    >
      <div className="overflow-hidden py-3 touch-pan-y">
        <div
          className={`flex ${slider.animate ? "transition-transform duration-700 ease-out" : ""}`}
          style={{
            width: `${(slider.total * 100) / slider.visible}%`,
            transform: `translateX(-${(slider.idx * 100) / slider.total}%)`,
          }}
          onTransitionEnd={slider.onTransitionEnd}
        >
          {items.map((testimonial, i) => (
            <div
              key={`${testimonial.id}-${i}`}
              className="px-2 md:px-6 lg:px-3"
              style={{ width: `${100 / slider.total}%` }}
              aria-hidden={i >= testimonials.length ? true : undefined}
            >
              <div className="h-full group bg-[#e3d9ce]/5 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none border border-[#bfa086]/10 md:border-none">
                <Quote className="h-8 w-8 md:h-10 md:w-10 lg:h-7 lg:w-7 text-[#87381e] mb-4 md:mb-6 lg:mb-4 transform transition-transform group-hover:-translate-y-2 duration-300" />
                <blockquote className="text-lg md:text-2xl lg:text-base font-serif font-light leading-snug text-[#e3d9ce] mb-6 md:mb-8 lg:mb-5">
                  &quot;{testimonial.text}&quot;
                </blockquote>
                <div className="flex items-center gap-3 lg:gap-3">
                  <Avatar className="h-12 w-12 md:h-14 md:w-14 lg:h-10 lg:w-10 border-2 border-[#bfa086]">
                    <AvatarFallback className="bg-[#2e3d30] text-[#bfa086] font-serif text-lg lg:text-base">
                      {testimonial.client_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-['Spartan'] uppercase text-[10px] md:text-xs lg:text-[10px] tracking-widest text-[#bfa086]">
                      {testimonial.client_name}
                    </p>
                    <p className="text-xs md:text-sm lg:text-xs text-[#e3d9ce]/60 font-light italic mt-0.5">
                      Cliente Milar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slider.active && (
        <div className="hidden lg:block">
          <SliderArrows
            onPrev={slider.prev}
            onNext={slider.next}
            topClassName="top-[40%]"
            buttonClassName="bg-[#e3d9ce]/15 text-[#e3d9ce] hover:bg-[#e3d9ce]/30"
          />
        </div>
      )}

      {slider.active && (
        <div className="flex items-center justify-center gap-1 mt-6 lg:mt-8">
          <button
            type="button"
            aria-label="Anterior"
            onClick={slider.prev}
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center bg-[#e3d9ce]/15 text-[#e3d9ce] hover:bg-[#e3d9ce]/30 mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Ver depoimento ${i + 1}`}
              onClick={() => slider.goTo(i)}
              className="group/dot flex h-6 items-center justify-center px-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === slider.idx % testimonials.length
                    ? "w-6 bg-[#bfa086]"
                    : "w-1.5 bg-[#bfa086]/40"
                }`}
              />
            </button>
          ))}
          <button
            type="button"
            aria-label="Próximo"
            onClick={slider.next}
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center bg-[#e3d9ce]/15 text-[#e3d9ce] hover:bg-[#e3d9ce]/30 ml-2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
