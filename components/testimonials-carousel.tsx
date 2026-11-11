"use client";

import { Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SliderArrows from "@/components/slider-arrows";
import type { Testimonial } from "@/lib/types";
import { useAutoSlider } from "@/lib/use-auto-slider";

const VISIBLE_DESKTOP = 2;
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
  );

  const items = slider.active
    ? [...testimonials, ...testimonials.slice(0, slider.visible)]
    : testimonials;

  return (
    <div
      className="relative group/slider"
      onMouseEnter={slider.pause}
      onMouseLeave={slider.resume}
      onTouchStart={slider.pause}
      onTouchEnd={slider.resume}
    >
      <div className="overflow-hidden py-3">
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
              className="px-2 md:px-6 lg:px-12"
              style={{ width: `${100 / slider.total}%` }}
              aria-hidden={i >= testimonials.length ? true : undefined}
            >
              <div className="h-full group bg-[#e3d9ce]/5 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none border border-[#bfa086]/10 md:border-none">
                <Quote className="h-8 w-8 md:h-10 md:w-10 text-[#87381e] mb-4 md:mb-6 transform transition-transform group-hover:-translate-y-2 duration-300" />
                <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif font-light leading-snug text-[#e3d9ce] mb-6 md:mb-8">
                  &quot;{testimonial.text}&quot;
                </blockquote>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-[#bfa086]">
                    <AvatarFallback className="bg-[#2e3d30] text-[#bfa086] font-serif text-lg">
                      {testimonial.client_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-['Spartan'] uppercase text-[10px] md:text-xs tracking-widest text-[#bfa086]">
                      {testimonial.client_name}
                    </p>
                    <p className="text-xs md:text-sm text-[#e3d9ce]/60 font-light italic mt-0.5">
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
        <SliderArrows
          onPrev={slider.prev}
          onNext={slider.next}
          topClassName="top-[40%]"
          buttonClassName="bg-[#e3d9ce]/15 text-[#e3d9ce] hover:bg-[#e3d9ce]/30"
        />
      )}

      {slider.active && (
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Ver depoimento ${i + 1}`}
              onClick={() => slider.goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slider.idx % testimonials.length
                  ? "w-6 bg-[#bfa086]"
                  : "w-1.5 bg-[#bfa086]/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
