"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export interface MobileMenuItem {
  label: string;
  href: string;
}

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu({ items }: { items: MobileMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        aria-label="Abrir menu"
        className="md:hidden flex h-11 w-11 items-center justify-center rounded-full text-[#2e3d30] hover:bg-[#87381e]/10 hover:text-[#87381e] transition-colors"
      >
        <Menu className="h-6 w-6" />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Popup
          aria-label="Menu de navegação"
          className="fixed inset-0 z-[60] flex flex-col bg-[#e3d9ce] text-[#2e3d30] outline-none duration-300 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        >
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#bfa086]/20 px-6">
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/logotipos/Logotipo Principal 06.1.png"
                alt="Símbolo Milar"
                width={88}
                height={88}
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <DialogPrimitive.Close
              aria-label="Fechar menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#87381e] hover:bg-[#87381e]/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-8 py-6">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`font-serif text-4xl py-3 transition-colors hover:text-[#87381e] ${
                    active ? "text-[#87381e]" : "text-[#2e3d30]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 space-y-5 border-t border-[#bfa086]/20 px-8 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <a
              href={siteConfig.projectFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#2e3d30] text-[#e3d9ce] font-['Spartan'] uppercase text-xs tracking-widest shadow-md transition-colors hover:bg-[#87381e]"
            >
              Quero um Projeto
            </a>
            <div className="flex flex-col items-center gap-1 text-sm text-[#756d47]">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 hover:text-[#87381e] transition-colors"
              >
                {siteConfig.instagramHandle}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="py-2 hover:text-[#87381e] transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
