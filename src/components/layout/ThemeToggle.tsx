"use client";

import { useSyncExternalStore } from "react";
import Icon from "@/components/ui/Icon";

type Theme = "light" | "dark";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function apply(next: Theme) {
  const root = document.documentElement;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Private mode etc. — the choice just won't persist.
  }
  const swap = () => {
    root.dataset.theme = next;
  };
  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(swap);
  } else {
    root.classList.add("theme-fade");
    swap();
    window.setTimeout(() => root.classList.remove("theme-fade"), 400);
  }
}

/** Light / dark switch. The initial theme is set before paint by the script in app/layout.tsx. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`group relative flex size-10 items-center justify-center overflow-hidden border border-line text-ink transition-colors hover:border-ink ${className}`}
    >
      <span className="relative block size-[1.1rem]">
        <Icon
          name="sun"
          className={`absolute inset-0 size-full transition-all duration-500 ease-out-soft ${theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
        />
        <Icon
          name="moon"
          className={`absolute inset-0 size-full transition-all duration-500 ease-out-soft ${theme === "dark" ? "rotate-90 scale-50 opacity-0" : "rotate-0 opacity-100"}`}
        />
      </span>
    </button>
  );
}
