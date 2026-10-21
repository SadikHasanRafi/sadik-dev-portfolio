"use client";

import Link from "next/link";
import { useRef } from "react";
import Icon from "@/components/ui/Icon";

/**
 * The closing call-to-action: leans toward the pointer, fills with the accent
 * colour from the left, and presses in on click. The lean only runs for mice.
 */
export default function MagneticCta({ href, label }: { href: string; label: string }) {
  const wrap = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse" || !wrap.current) return;
    const rect = wrap.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    wrap.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => {
    if (wrap.current) wrap.current.style.transform = "";
  };

  const className =
    "cta-btn group label-caps inline-flex items-center justify-center gap-3 whitespace-nowrap bg-ink px-8 py-4 tracking-[0.18em] text-on-ink";
  const content = (
    <>
      <span>{label}</span>
      <span className="relative flex size-3.5 overflow-hidden">
        <Icon
          name="arrow-right"
          className="absolute inset-0 size-3.5 transition-transform duration-500 ease-out-soft group-hover:translate-x-full"
          strokeWidth={1.8}
        />
        <Icon
          name="arrow-right"
          className="absolute inset-0 size-3.5 -translate-x-full transition-transform duration-500 ease-out-soft group-hover:translate-x-0"
          strokeWidth={1.8}
        />
      </span>
    </>
  );
  const external = /^(https?:|mailto:|tel:)/.test(href) || /\.\w+$/.test(href);

  return (
    <span ref={wrap} className="magnetic" onPointerMove={onMove} onPointerLeave={reset}>
      {external ? (
        <a href={href} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </span>
  );
}
