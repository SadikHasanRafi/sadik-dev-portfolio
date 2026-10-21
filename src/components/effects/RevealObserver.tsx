"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `.is-visible` to every `[data-reveal]` element the first time it scrolls
 * into view (styles live in globals.css). One shared IntersectionObserver for the
 * whole page; a MutationObserver picks up elements mounted later (e.g. filters).
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    };

    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => ((queued = 0), scan()));
    });

    // Big jumps (End key, anchor links, scrollbar drags) can skip past elements
    // between frames; once scrolling settles, reveal anything above the fold.
    let settle = 0;
    const catchUp = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      }, 120);
    };
    const revealAll = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));

    scan();
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", catchUp, { passive: true });
    window.addEventListener("beforeprint", revealAll);
    return () => {
      cancelAnimationFrame(queued);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", catchUp);
      window.removeEventListener("beforeprint", revealAll);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
