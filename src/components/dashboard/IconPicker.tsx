"use client";

import { useEffect, useRef, useState } from "react";
import Icon, { iconNames } from "@/components/ui/Icon";
import { DIcon, FieldShell, inputClass } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import type { IconName } from "@/types";

/** Button showing the current icon; opens a searchable grid of all icons. */
export default function IconPicker({ label, value, onChange }: { label: string; value: IconName; onChange: (v: IconName) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shown = iconNames.filter((n) => n.includes(query.trim().toLowerCase()));

  return (
    <FieldShell label={label}>
      <div ref={box} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={cn(inputClass, "flex items-center gap-3 text-left")}
        >
          <span className="flex size-7 items-center justify-center bg-lavender text-violet">
            <Icon name={value} className="size-4" />
          </span>
          <span className="flex-1 text-ink">{value}</span>
          <DIcon name="chevron" className="size-4 text-muted" />
        </button>
        {open && (
          <div className="modal-in absolute left-0 right-0 top-full z-30 mt-1 border border-line bg-paper p-3 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]">
            <div className="relative mb-3">
              <DIcon name="search" className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search icons" className={cn(inputClass, "pl-8")} />
            </div>
            <div className="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto sm:grid-cols-8">
              {shown.map((name) => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  aria-label={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex aspect-square items-center justify-center border transition-colors",
                    name === value ? "border-violet bg-lavender text-violet" : "border-transparent text-ink hover:border-line hover:bg-strip",
                  )}
                >
                  <Icon name={name} className="size-[1.1rem]" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </FieldShell>
  );
}
