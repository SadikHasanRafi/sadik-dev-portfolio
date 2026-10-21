/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** "2025-10-14" -> "October 14, 2025" (formatted at build time, fixed locale). */
export function formatDate(iso: string, month: "long" | "short" = "long") {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "2-digit",
    timeZone: "UTC",
  });
}

/** Stagger helper for `.anim-rise` / `[data-reveal]`: style={delay(120)} */
export function delay(ms: number) {
  return { "--d": `${ms}ms` } as React.CSSProperties;
}
