"use client";

import { useEffect, useRef } from "react";

/** Hairline violet bar under the header that tracks scroll through the article. */
export default function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById(target);
    if (!el || !bar.current) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.current!.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-40 h-0.5 lg:top-[4.5rem]" aria-hidden>
      <div ref={bar} className="h-full origin-left scale-x-0 bg-violet" />
    </div>
  );
}
