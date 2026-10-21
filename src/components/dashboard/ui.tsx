"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/* ---------- Icons used only by the dashboard ---------- */

const icons = {
  grip: <path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01" strokeWidth={2.6} />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />,
  duplicate: (
    <>
      <rect x="9" y="9" width="12" height="12" />
      <path d="M5 15V3h12" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: <path d="M9.9 4.24A9 9 0 0 1 12 4c6.5 0 10 7 10 7a17 17 0 0 1-2.16 3.19M6.6 6.6A17.7 17.7 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M14.12 14.12a3 3 0 1 1-4.24-4.24M2 2l20 20" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  external: <path d="M7 17 17 7M8 7h9v9" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  check: <path d="M20 6 9 17l-5-5" />,
  undo: <path d="M3 7v6h6M3 13a9 9 0 1 0 3-7.7L3 8" />,
  file: <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5" />,
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
};

export type DashIconName = keyof typeof icons;

export function DIcon({ name, className = "size-4", strokeWidth = 1.7 }: { name: DashIconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {icons[name]}
    </svg>
  );
}

/* ---------- Form controls ---------- */

export const inputClass =
  "w-full border border-line bg-bg px-3 py-2.5 text-[0.9rem] text-ink transition-colors placeholder:text-muted/60 hover:border-muted/50 focus:border-violet focus:bg-paper focus:outline-none";

export function FieldShell({
  label,
  help,
  htmlFor,
  children,
  className,
  aside,
}: {
  label?: string;
  help?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {(label || aside) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <label htmlFor={htmlFor} className="text-[0.8rem] font-medium text-ink">
              {label}
            </label>
          )}
          {aside}
        </div>
      )}
      {children}
      {help && <p className="text-[0.75rem] leading-snug text-muted">{help}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 text-left"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center border transition-colors duration-300",
          checked ? "border-violet bg-violet" : "border-line bg-strip",
        )}
      >
        <span
          className={cn(
            "absolute size-3.5 transition-transform duration-300 ease-out-soft",
            checked ? "translate-x-[1.1rem] bg-on-ink" : "translate-x-[0.15rem] bg-muted",
          )}
        />
      </span>
      <span className="text-[0.85rem] text-ink">{label}</span>
    </button>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md";
};

export function DButton({ variant = "outline", size = "md", className, ...props }: BtnProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "px-2.5 py-1.5 text-[0.78rem]" : "px-4 py-2.5 text-[0.85rem]",
        variant === "primary" && "bg-ink text-on-ink hover:bg-violet",
        variant === "outline" && "border border-line bg-paper text-ink hover:border-ink",
        variant === "ghost" && "text-muted hover:bg-strip hover:text-ink",
        variant === "danger" && "border border-alert/40 text-alert hover:bg-alert hover:text-white",
        className,
      )}
    />
  );
}

export function IconButton({ label, icon, onClick, active, className, ...rest }: {
  label: string;
  icon: DashIconName;
  onClick?: () => void;
  active?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      {...rest}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center text-muted transition-colors hover:bg-strip hover:text-ink",
        active && "text-violet",
        className,
      )}
    >
      <DIcon name={icon} />
    </button>
  );
}

/** Bordered, collapsible group of fields. */
export function Panel({
  title,
  help,
  children,
  defaultOpen = true,
  right,
}: {
  title: string;
  help?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  right?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // Overflow stays clipped only while animating, so dropdowns inside an open panel aren't cut off.
  const [settled, setSettled] = useState(defaultOpen);
  const toggle = () => {
    setSettled(false);
    setOpen((v) => !v);
  };
  return (
    <section className="border border-line bg-paper">
      <div className="flex items-center gap-2 pr-3">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="flex flex-1 items-center gap-3 px-5 py-4 text-left"
        >
          <DIcon name="chevron" className={cn("size-4 shrink-0 text-muted transition-transform duration-300", !open && "-rotate-90")} />
          <span>
            <span className="block font-serif text-[1.2rem] leading-tight text-ink">{title}</span>
            {help && <span className="mt-0.5 block text-[0.78rem] text-muted">{help}</span>}
          </span>
        </button>
        {right}
      </div>
      <div
        className="faq-panel"
        data-open={open}
        inert={!open}
        onTransitionEnd={(e) => e.target === e.currentTarget && open && setSettled(true)}
      >
        <div className={cn(open && settled && "overflow-visible!")}>
          <div className="border-t border-line px-5 py-5">{children}</div>
        </div>
      </div>
    </section>
  );
}
