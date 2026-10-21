"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Article outline that highlights the section currently being read. */
export default function TableOfContents({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Table of contents" className="flex flex-col text-body-sm">
      {items.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "location" : undefined}
          className={cn(
            "relative flex items-center justify-between gap-3 border-b border-line py-2.5 pl-3 transition-colors last:border-b-0",
            active === item.id ? "text-violet" : "text-ink hover:text-violet",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 bg-violet transition-transform duration-300",
              active === item.id ? "scale-y-100" : "scale-y-0",
            )}
          />
          <span>
            {i + 1}. {item.title}
          </span>
          <span className="shrink-0 font-mono text-[0.7rem] text-muted">§ 0{i + 1}</span>
        </a>
      ))}
    </nav>
  );
}
