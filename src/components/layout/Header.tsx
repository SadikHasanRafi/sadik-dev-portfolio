"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Logo, { type Brand } from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import TalkModal from "@/components/layout/TalkModal";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/types";

const trim = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

function isActive(pathname: string, href: string) {
  const current = trim(pathname);
  const target = trim(href);
  return target === "/" ? current === "/" : current === target || current.startsWith(`${target}/`);
}

type Props = {
  brand: Brand;
  nav: { id: string; label: string; href: string }[];
  cta: { label: string; visible: boolean };
  contact: { email: string; city: string; utc: string };
  talk: SiteContent["talk"];
  themeToggle: boolean;
};

export default function Header({ brand, nav, cta, contact, talk, themeToggle }: Props) {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating closes it automatically.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const close = () => setOpenedOn(null);
  const [talkOpen, setTalkOpen] = useState(false);
  const closeTalk = useCallback(() => setTalkOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedOn(null);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <Logo brand={brand} />

          <nav className="hidden h-full items-center gap-9 lg:flex xl:gap-11" aria-label="Main">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "label-caps relative flex h-full items-center tracking-[0.2em] transition-colors duration-300",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-violet transition-transform duration-500 ease-out-soft",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {themeToggle && <ThemeToggle />}

            {cta.visible && (
              <button
                type="button"
                onClick={() => setTalkOpen(true)}
                aria-haspopup="dialog"
                className="group label-caps hidden items-center gap-2.5 bg-ink px-6 py-3.5 tracking-[0.2em] text-on-ink transition-[background-color,transform] duration-300 hover:bg-violet active:scale-[0.97] sm:inline-flex"
              >
                {cta.label}
                <Icon name="arrow-right" className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
              </button>
            )}

            <button
              type="button"
              className="relative flex size-10 items-center justify-center border border-line transition-colors hover:border-ink lg:hidden"
              onClick={() => (open ? close() : setOpenedOn(pathname))}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-4 bg-ink transition-transform duration-300",
                    open && "translate-y-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[5px] h-[1.5px] w-4 bg-ink transition-opacity duration-200",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute top-[10px] h-[1.5px] bg-ink transition-all duration-300",
                    open ? "left-0 w-4 -translate-y-[5px] -rotate-45" : "left-1.5 w-2.5",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & tablet menu — a sibling of <header>, because the header's
          backdrop-filter would otherwise become the containing block for this fixed layer */}
      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-bg transition-[opacity,visibility] duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="container-page flex-1 py-6" aria-label="Mobile">
          <ul>
            {nav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li
                  key={item.href}
                  className={cn(
                    "border-b border-line transition-[opacity,transform] duration-500 ease-out-soft",
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  )}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                >
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-baseline gap-5 py-5"
                  >
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={cn(
                        "font-serif text-[2rem] leading-none tracking-tight transition-colors sm:text-[2.5rem]",
                        active ? "italic text-violet" : "text-ink group-hover:text-violet",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div
          className={cn(
            "container-page flex flex-col gap-5 border-t border-line bg-strip py-8 transition-opacity delay-300 duration-500 sm:flex-row sm:items-center sm:justify-between",
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex flex-col gap-1.5 text-body-sm text-muted">
            <a href={`mailto:${contact.email}`} className="text-ink hover:text-violet">
              {contact.email}
            </a>
            <span>
              {contact.city} · {contact.utc}
            </span>
          </div>
          {cta.visible && (
            <button
              type="button"
              onClick={() => {
                close();
                setTalkOpen(true);
              }}
              aria-haspopup="dialog"
              className="label-caps inline-flex items-center justify-center gap-2.5 bg-ink px-6 py-4 tracking-[0.2em] text-on-ink sm:hidden"
            >
              {cta.label} <Icon name="arrow-right" className="size-3.5" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      <TalkModal open={talkOpen} onClose={closeTalk} text={talk} email={contact.email} />
    </>
  );
}
