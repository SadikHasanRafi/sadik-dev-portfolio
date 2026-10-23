"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CopyButton from "@/components/blog/CopyButton";
import Icon from "@/components/ui/Icon";
import { tryDashboardLogin } from "@/lib/dashboard-shortcut";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/types";

const field =
  "w-full border border-line bg-strip px-4 py-3.5 text-body-md text-ink transition-colors placeholder:text-muted/60 focus:border-violet focus:bg-paper focus:outline-none";

type Props = { form: SiteContent["contactPage"]["form"]; email: string };

/**
 * Project inquiry form. It composes a structured email and opens the
 * visitor's mail app, so nothing is stored on the server.
 */
export default function ContactForm({ form, email: inbox }: Props) {
  const [areas, setAreas] = useState<string[]>(form.areas.slice(0, 1));
  const [timeline, setTimeline] = useState<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const router = useRouter();

  const toggleArea = (a: string) =>
    setAreas((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    if (await tryDashboardLogin(String(data.get("email")).trim())) {
      router.push("/dashboard");
      return;
    }
    if (!formEl.reportValidity()) return;
    const name = String(data.get("name")).trim();
    const chosen = timeline === null ? null : form.timelines[timeline];
    const body = [
      `Hi,`,
      ``,
      String(data.get("brief")).trim(),
      ``,
      `- Focus: ${areas.join(", ") || "Not sure yet"}`,
      `- Timeline: ${chosen ? `${chosen.title} (${chosen.body})` : "Flexible"}`,
      `- Organization: ${String(data.get("company")).trim() || "-"}`,
      ``,
      `${name}`,
      `${String(data.get("email")).trim()}`,
    ].join("\n");

    setDraft(body);
    const subject = `Project inquiry: ${name}`;
    window.location.href = `mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-ink">
            {form.nameLabel} <span className="text-violet">*</span>
          </span>
          <input name="name" required autoComplete="name" placeholder={form.namePlaceholder} className={field} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-ink">
            {form.emailLabel} <span className="text-violet">*</span>
          </span>
          <input name="email" type="email" required autoComplete="email" placeholder={form.emailPlaceholder} className={field} />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-ink">{form.companyLabel}</span>
        <input name="company" autoComplete="organization" placeholder={form.companyPlaceholder} className={field} />
      </label>

      {form.areas.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-body-sm font-medium text-ink">
            {form.areasLabel} <span className="text-violet">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {form.areas.map((a) => {
              const on = areas.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleArea(a)}
                  className={cn(
                    "flex items-center gap-1.5 border px-4 py-2.5 text-body-sm transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97]",
                    on ? "border-violet bg-violet text-on-ink" : "border-line bg-strip text-ink hover:border-ink",
                  )}
                >
                  {on && <Icon name="check" className="size-3.5" strokeWidth={2.4} />}
                  {a}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {form.timelines.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-body-sm font-medium text-ink">{form.timelineLabel}</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {form.timelines.map((t, i) => {
              const on = timeline === i;
              return (
                <button
                  key={`${t.title}-${i}`}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTimeline(on ? null : i)}
                  className={cn(
                    "border p-4 text-left transition-colors duration-300",
                    on ? "border-violet bg-violet" : "border-line bg-strip hover:border-ink",
                  )}
                >
                  <span className={cn("mb-1 block text-body-sm font-semibold", on ? "text-on-ink" : "text-ink")}>{t.title}</span>
                  <span className={cn("block text-body-sm", on ? "text-on-ink/80" : "text-muted")}>{t.body}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-ink">
          {form.briefLabel} <span className="text-violet">*</span>
        </span>
        <textarea name="brief" required rows={6} minLength={20} placeholder={form.briefPlaceholder} className={cn(field, "resize-y")} />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={form.areas.length > 0 && areas.length === 0}
          className="group label-caps inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 tracking-[0.2em] text-on-ink transition-[background-color,transform] duration-300 hover:bg-violet active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {form.submitLabel}
          <Icon name="arrow-right" className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
        </button>
        {form.note && (
          <span className="flex items-center gap-2 text-body-sm text-muted">
            <Icon name="mail" className="size-4" /> {form.note}
          </span>
        )}
      </div>

      {draft && (
        <div className="item-enter border-l-4 border-violet bg-lavender/50 p-5" role="status">
          <p className="mb-3 text-body-sm text-ink">
            {form.successText}{" "}
            <a href={`mailto:${inbox}`} className="font-semibold text-violet">
              {inbox}
            </a>
            .
          </p>
          <CopyButton text={draft} label="Copy Message" tone="light" className="border border-line bg-paper px-4 py-2.5" />
        </div>
      )}
    </form>
  );
}
