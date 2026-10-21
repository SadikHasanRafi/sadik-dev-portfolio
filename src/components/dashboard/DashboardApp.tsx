"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ContentContext, SectionEditor, UpdateContext } from "@/components/dashboard/AutoForm";
import BackupPanel from "@/components/dashboard/BackupPanel";
import NavEditor from "@/components/dashboard/NavEditor";
import ThemeEditor from "@/components/dashboard/ThemeEditor";
import { rootTitles, sections, type SectionDef } from "@/components/dashboard/sections";
import { setIn } from "@/components/dashboard/paths";
import { DButton, DIcon } from "@/components/dashboard/ui";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { defaultContent } from "@/content/defaults";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/types";

type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

export default function DashboardApp({ initial, dbReady }: { initial: SiteContent; dbReady: boolean }) {
  const router = useRouter();
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [sectionId, setSectionId] = useState(sections[0].id);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [menuOpen, setMenuOpen] = useState(false);

  const update = useCallback((path: string, value: unknown) => setContent((c) => setIn(c, path, value)), []);
  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);
  const section = sections.find((s) => s.id === sectionId) ?? sections[0];

  const save = useCallback(async () => {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/dashboard/content/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error("Your session expired — open the dashboard again from the Let’s Talk popup.");
      if (!res.ok) throw new Error(data.error ?? `Save failed (${res.status})`);
      setSaved(data.content);
      setContent(data.content);
      setStatus({ kind: "saved", message: `Saved at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` });
    } catch (e) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Save failed" });
    }
  }, [content]);

  // ⌘/Ctrl+S saves; leaving with unsaved edits asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, save]);

  const go = (id: string) => {
    setSectionId(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const discard = () => {
    if (window.confirm("Throw away all changes since the last save?")) {
      setContent(saved);
      setStatus({ kind: "idle" });
    }
  };

  const resetSection = (s: SectionDef) => {
    if (!s.roots || !window.confirm(`Put “${s.title}” back to its original content? Nothing is published until you save.`)) return;
    setContent((c) => {
      let next = c;
      for (const root of s.roots!) next = setIn(next, root, structuredClone((defaultContent as unknown as Record<string, unknown>)[root]));
      return next;
    });
  };

  const logout = async () => {
    if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    await fetch("/api/auth/logout/", { method: "POST" }).catch(() => {});
    router.push("/");
  };

  const pageOff = (s: SectionDef) => (s.page ? !content.navigation.pages[s.page] : false);

  const nav = (
    <nav aria-label="Dashboard sections" className="flex flex-col gap-6">
      {(["Site", "Pages", "Data"] as const).map((group) => (
        <div key={group}>
          <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{group}</p>
          <ul className="flex flex-col">
            {sections
              .filter((s) => s.group === group)
              .map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    aria-current={s.id === sectionId ? "page" : undefined}
                    className={cn(
                      "relative flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[0.88rem] transition-colors",
                      s.id === sectionId ? "bg-strip font-medium text-ink" : "text-muted hover:bg-strip/60 hover:text-ink",
                    )}
                  >
                    {s.id === sectionId && <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 bg-violet" />}
                    {s.title}
                    {pageOff(s) && <span className="border border-line px-1.5 text-[0.65rem] uppercase tracking-wider text-muted">off</span>}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <UpdateContext.Provider value={update}>
      <ContentContext.Provider value={content}>
        <div className="flex min-h-screen w-full bg-bg text-ink">
          {/* Sidebar */}
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-paper lg:flex">
            <div className="flex items-center gap-3 border-b border-line px-5 py-5">
              <span className="flex size-9 items-center justify-center border border-ink font-serif text-lg font-bold">{content.identity.initials}</span>
              <span>
                <span className="block text-[0.8rem] font-semibold">{content.identity.name}</span>
                <span className="block text-[0.72rem] text-muted">Site editor</span>
              </span>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-5">{nav}</div>
            <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
              <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[0.8rem] text-muted hover:text-ink">
                View site <DIcon name="external" className="size-3.5" />
              </a>
              <button type="button" onClick={logout} className="flex items-center gap-1.5 text-[0.8rem] text-muted hover:text-alert">
                <DIcon name="logout" className="size-3.5" /> Log out
              </button>
            </div>
          </aside>

          {/* Mobile drawer */}
          {menuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="backdrop-in absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} aria-hidden />
              <div className="modal-in absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-line bg-paper">
                <div className="flex items-center justify-between border-b border-line px-4 py-4">
                  <span className="font-serif text-[1.1rem]">Sections</span>
                  <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close sections" className="flex size-9 items-center justify-center text-muted hover:text-ink">
                    <DIcon name="close" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-4">{nav}</div>
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <a href="/" target="_blank" rel="noreferrer" className="text-[0.8rem] text-muted">
                    View site ↗
                  </a>
                  <button type="button" onClick={logout} className="text-[0.8rem] text-muted">
                    Log out
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Toolbar */}
            <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
              <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="flex size-10 shrink-0 items-center justify-center border border-line lg:hidden"
                  aria-label="Open sections"
                >
                  <DIcon name="menu" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.95rem] font-medium">{section.title}</p>
                  <p aria-live="polite" className={cn("truncate text-[0.75rem]", status.kind === "error" ? "text-alert" : "text-muted")}>
                    {status.kind === "saving"
                      ? "Saving…"
                      : status.kind === "error"
                        ? status.message
                        : dirty
                          ? "Unsaved changes"
                          : status.kind === "saved"
                            ? `${status.message} · live pages refresh on their next visit`
                            : "Everything is saved"}
                  </p>
                </div>
                <ThemeToggle className="hidden sm:flex" />
                {dirty && (
                  <DButton variant="ghost" onClick={discard} className="hidden sm:inline-flex">
                    <DIcon name="undo" /> Discard
                  </DButton>
                )}
                <DButton variant="primary" onClick={save} disabled={!dirty || status.kind === "saving"}>
                  {dirty && <span aria-hidden className="size-1.5 bg-lavender-deep" />}
                  <span>
                    Save<span className="hidden sm:inline"> changes</span>
                  </span>
                </DButton>
              </div>
            </header>

            <main className="w-full max-w-5xl px-4 pb-24 pt-8 sm:px-8 lg:px-10">
              <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="font-serif text-[2rem] leading-tight tracking-tight sm:text-[2.4rem]">{section.title}</h1>
                  <p className="mt-1 max-w-xl text-[0.9rem] text-muted">{section.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {section.href && (
                    <a
                      href={section.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 border border-line bg-paper px-3 py-2 text-[0.8rem] text-ink transition-colors hover:border-ink"
                    >
                      Open page <DIcon name="external" className="size-3.5" />
                    </a>
                  )}
                  {section.roots && (
                    <DButton size="sm" variant="ghost" onClick={() => resetSection(section)}>
                      Reset section
                    </DButton>
                  )}
                </div>
              </div>

              {!dbReady && (
                <div className="mb-6 border-l-2 border-alert bg-strip px-4 py-3 text-[0.85rem]">
                  <strong className="font-semibold">No database connected.</strong> You&apos;re seeing the default content and saving is off. Add{" "}
                  <code className="bg-paper px-1 font-mono text-[0.8rem]">MONGODB_URI</code> to the server&apos;s environment and restart it.
                </div>
              )}

              {section.page && pageOff(section) && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-l-2 border-alert bg-strip px-4 py-3 text-[0.85rem]">
                  <span>This page is switched off, so visitors get “not found”.</span>
                  <DButton size="sm" onClick={() => update(`navigation.pages.${section.page}`, true)}>
                    Turn it on
                  </DButton>
                </div>
              )}

              <div key={section.id} className="page-enter">
                {section.custom === "theme" && <ThemeEditor content={content} />}
                {section.custom === "nav" && <NavEditor content={content} />}
                {section.custom === "backup" && <BackupPanel content={content} onReplace={setContent} />}
                {section.roots && <SectionEditor roots={section.roots} content={content} titles={rootTitles} open={section.open} />}
              </div>
            </main>
          </div>
        </div>
      </ContentContext.Provider>
    </UpdateContext.Provider>
  );
}
