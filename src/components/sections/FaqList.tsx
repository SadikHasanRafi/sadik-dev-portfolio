"use client";

import { useId, useState } from "react";
import { cn, delay } from "@/lib/utils";
import type { FaqItem } from "@/types";

/** Accordion: one answer open at a time, height animates via grid rows. */
export default function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <li key={`${item.q}-${i}`} className="border-b border-line" data-reveal style={delay(Math.min(i, 5) * 70)}>
            <h3>
              <button
                type="button"
                id={`${id}-q`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span
                  className={cn(
                    "font-serif text-[1.3rem] leading-snug transition-colors duration-300 sm:text-[1.55rem]",
                    isOpen ? "text-violet" : "text-ink group-hover:text-violet",
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center border transition-colors duration-300",
                    isOpen ? "border-violet bg-violet text-on-ink" : "border-line text-ink group-hover:border-ink",
                  )}
                >
                  <span className="faq-plus relative block size-3.5">
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-90 bg-current" />
                  </span>
                </span>
              </button>
            </h3>
            <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className="faq-panel" data-open={isOpen}>
              <div>
                <p className="max-w-3xl pb-7 text-body-md leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
