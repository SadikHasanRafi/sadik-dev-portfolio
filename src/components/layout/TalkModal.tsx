"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { login } from "@/actions/auth";
import CopyButton from "@/components/blog/CopyButton";
import Icon from "@/components/ui/Icon";
import type { SiteContent } from "@/types";

const field =
  "w-full border border-line bg-strip px-4 py-3.5 text-body-md text-ink transition-colors placeholder:text-muted/60 focus:border-violet focus:bg-paper focus:outline-none";

const FOCUSABLE = "a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex='-1'])";

type Props = { open: boolean; onClose: () => void; text: SiteContent["talk"]; email: string };

/** Owner shortcut: when the email field holds a non-email value, ask the server if it's the passcode. */
async function tryDashboardLogin(email: string) {
  if (!email || email.includes("@")) return false;
  try {
    return (await login(email)).ok;
  } catch {
    return false;
  }
}

/**
 * "Let's Talk" popup: name, email and a message. Submitting composes an email
 * and opens the visitor's mail app.
 */
export default function TalkModal({ open, onClose, text, email: inbox }: Props) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Lock page scroll, focus the first field, trap Tab, close on Escape, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = document.activeElement as HTMLElement | null;
    root.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("input")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = "";
      setDraft(null);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const query = String(data.get("query")).trim();

    setBusy(true);
    const isOwner = await tryDashboardLogin(email);
    setBusy(false);
    if (isOwner) {
      router.push("/dashboard");
      return;
    }

    if (!form.reportValidity()) return;
    const body = `Hi,\n\n${query}\n\n${name}\n${email}`;
    setDraft(body);
    window.location.href = `mailto:${inbox}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-80 flex items-end justify-center sm:items-center sm:p-6">
      <div className="backdrop-in absolute inset-0 bg-black/55" onClick={onClose} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="talk-title"
        className="modal-in relative max-h-[92dvh] w-full max-w-lg overflow-y-auto border border-line bg-paper p-6 sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex size-10 items-center justify-center text-muted transition-colors hover:text-ink sm:right-4 sm:top-4"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <span className="label-caps mb-3 block text-violet">{text.eyebrow}</span>
        <h2 id="talk-title" className="mb-2 pr-8 font-serif text-[2rem] leading-tight tracking-tight text-ink sm:text-[2.25rem]">
          {text.title} <span className="accent-text accent-ocean">{text.accent}</span>
        </h2>
        <p className="mb-7 text-body-sm text-muted">{text.body}</p>

        {draft ? (
          <div className="item-enter border-l-4 border-violet bg-lavender/50 p-5" role="status">
            <p className="mb-1 font-serif text-[1.25rem] text-ink">{text.successTitle}</p>
            <p className="mb-4 text-body-sm text-muted">
              {text.successBody}{" "}
              <a href={`mailto:${inbox}`} className="font-semibold text-violet underline underline-offset-4">
                {inbox}
              </a>
              .
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <CopyButton text={draft} label="Copy message" tone="light" className="border border-line bg-paper px-4 py-2.5" />
              <button type="button" onClick={onClose} className="label-caps px-3 py-2.5 text-ink transition-colors hover:text-violet">
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-body-sm font-medium text-ink">{text.nameLabel}</span>
              <input name="name" required autoComplete="name" placeholder={text.namePlaceholder} className={field} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-body-sm font-medium text-ink">{text.emailLabel}</span>
              <input name="email" type="email" required autoComplete="email" placeholder={text.emailPlaceholder} className={field} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-body-sm font-medium text-ink">{text.queryLabel}</span>
              <textarea name="query" required rows={4} minLength={10} placeholder={text.queryPlaceholder} className={`${field} resize-y`} />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="group label-caps mt-1 inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 tracking-[0.2em] text-on-ink transition-[background-color,transform] duration-300 hover:bg-violet active:scale-[0.98] disabled:opacity-60"
            >
              {text.submitLabel}
              <Icon name="arrow-right" className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
