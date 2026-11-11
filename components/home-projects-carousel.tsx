"use client";

import Image from "next/image";
import Link from "next/link";
import SliderArrows from "@/components/slider-arrows";
import { useAutoSlider } from "@/lib/use-auto-slider";

export interface HomeProject {
  id: number;
  title: string;
  image: string;
}

const VISIBLE_DESKTOP = 3;
const INTERVAL_MS = 5000;

export default function HomeProjectsCarousel({
  projects,
}: {
  projects: HomeProject[];
}) {
  const slider = useAutoSlider(projects.length, VISIBLE_DESKTOP, INTERVAL_MS);

  const items = slider.active
    ? [...projects, ...projects.slice(0, slider.visible)]
    : projects;

  return (
    <div
      className="relative group/slider"
      onMouseEnter={slider.pause}
      onMouseLeave={slider.resume}
    >
      <div className="overflow-hidden">
        <div
          className={`flex ${slider.animate ? "transition-transform duration-700 ease-out" : ""}`}
          style={{
            width: `${(slider.total * 100) / slider.visible}%`,
            transform: `translateX(-${(slider.idx * 100) / slider.total}%)`,
          }}
          onTransitionEnd={slider.onTransitionEnd}
        >
          {items.map((project, i) => (
            <div
              key={`${project.id}-${i}`}
              className="px-2 md:px-3"
              style={{ width: `${100 / slider.total}%` }}
            >
              <Link
                href="/projetos"
                className="group block"
                aria-hidden={i >= projects.length ? true : undefined}
                tabIndex={i >= projects.length ? -1 : undefined}
              >
                <div className="relative aspect-4/3 overflow-hidden border border-[#2e3d30]/10 bg-[#bfa086]/30">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-xl md:text-2xl font-serif text-[#2e3d30] group-hover:text-[#87381e] transition-colors">
                  {project.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {slider.active && (
        <SliderArrows
          onPrev={slider.prev}
          onNext={slider.next}
          topClassName="top-[35%]"
          buttonClassName="bg-black/40 text-white hover:bg-black/60"
        />
      )}
    </div>
  );
}
