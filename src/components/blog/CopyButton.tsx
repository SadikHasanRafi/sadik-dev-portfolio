"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Props = { text: string; label?: string; tone?: "dark" | "light"; className?: string };

/** Copies `text` to the clipboard and confirms for two seconds. */
export default function CopyButton({ text, label = "Copy", tone = "dark", className }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "label-caps flex shrink-0 items-center gap-1.5 transition-colors",
        tone === "dark" && (copied ? "text-lavender-deep" : "text-night-muted hover:text-white"),
        tone === "light" && (copied ? "text-violet" : "text-ink hover:bg-strip"),
        className,
      )}
      aria-live="polite"
    >
      <Icon name={copied ? "check" : "copy"} className="size-3.5" strokeWidth={1.8} />
      {copied ? "Copied" : label}
    </button>
  );
}
