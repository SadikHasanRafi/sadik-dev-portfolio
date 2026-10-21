"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], label, summary, [data-cursor='hover']";

/**
 * Ring cursor. With a mouse the real system cursor stays visible and a violet
 * ring eases behind it, growing over links and buttons. On touch screens
 * there is no cursor, so the ring appears under the finger on touch/drag and
 * releases outward when the finger lifts. The rAF loop stops once the ring
 * catches up, so an idle page costs nothing. Skipped for reduced motion.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let x = -100;
    let y = -100;
    let fx = x;
    let fy = y;
    let raf = 0;
    let hideTimer = 0;

    const place = () => {
      ring.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
    };

    const tick = () => {
      fx += (x - fx) * 0.2;
      fy += (y - fy) * 0.2;
      place();
      raf = Math.abs(x - fx) + Math.abs(y - fy) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;

      if (e.pointerType === "mouse") {
        root.classList.remove("cursor-touch");
        if (!root.classList.contains("cursor-visible")) {
          fx = x;
          fy = y;
          place();
          root.classList.add("cursor-visible");
        }
        if (!raf) raf = requestAnimationFrame(tick);
      } else if (root.classList.contains("cursor-touch")) {
        // Finger: stick to the touch point, no easing lag
        fx = x;
        fy = y;
        place();
      }
    };

    const onDown = (e: PointerEvent) => {
      root.classList.add("cursor-down");
      if (e.pointerType === "mouse") return;
      clearTimeout(hideTimer);
      x = fx = e.clientX;
      y = fy = e.clientY;
      place();
      root.classList.add("cursor-touch", "cursor-visible");
      root.classList.toggle("cursor-hover", !!(e.target as Element | null)?.closest?.(INTERACTIVE));
      root.classList.toggle("cursor-dark", !!(e.target as Element | null)?.closest?.("[data-dark]"));
    };

    const onUp = () => {
      root.classList.remove("cursor-down");
      if (root.classList.contains("cursor-touch")) {
        // Let the release animation play, then hide
        hideTimer = window.setTimeout(() => root.classList.remove("cursor-visible", "cursor-hover"), 600);
      }
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;
      if (!target?.closest) return;
      root.classList.toggle("cursor-hover", !!target.closest(INTERACTIVE));
      root.classList.toggle("cursor-dark", !!target.closest("[data-dark]"));
    };

    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && !root.classList.contains("cursor-touch")) root.classList.remove("cursor-visible");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseout", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseout", onLeave);
      root.classList.remove("cursor-visible", "cursor-hover", "cursor-dark", "cursor-down", "cursor-touch");
    };
  }, []);

  return (
    <div ref={ringRef} className="cursor cursor-ring" aria-hidden>
      <span />
    </div>
  );
}
