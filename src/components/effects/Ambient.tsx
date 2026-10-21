import { cn } from "@/lib/utils";

type Variant = "band" | "intro" | "dark" | "hero";

/**
 * Slow background motion for banners, page headers and dark panels: a drifting
 * dot field, a faint blueprint grid that pans, a soft tint that wanders and a
 * light sweep. Pure CSS (transform/opacity), paused for reduced-motion users.
 * Place inside a `relative overflow-hidden` parent; content should be `relative`.
 */
export default function Ambient({ variant = "band", className }: { variant?: Variant; className?: string }) {
  return (
    <div aria-hidden className={cn("ambient pointer-events-none absolute inset-0 overflow-hidden", `ambient-${variant}`, className)}>
      {variant !== "hero" && <div className="ambient-tint ambient-tint-a" />}
      {(variant === "band" || variant === "intro") && <div className="ambient-tint ambient-tint-b" />}
      {variant !== "band" && <div className="ambient-grid" />}
      {variant !== "dark" && (
        <div className="ambient-dots-box">
          <div className="ambient-dots dot-grid" />
        </div>
      )}
      {(variant === "band" || variant === "dark") && <div className="ambient-sweep" />}
    </div>
  );
}
