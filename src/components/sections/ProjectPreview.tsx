import Image from "next/image";
import type { ImageAsset, ProjectPreview as Preview } from "@/types";
import { cn } from "@/lib/utils";

type Props = { preview: Preview; stack: string[]; image?: ImageAsset | null; className?: string; sizes?: string };

/**
 * Project card visual: an uploaded screenshot if there is one, otherwise a
 * coded "screen" drawn in HTML/CSS (crisp at any size, no image bytes).
 */
export default function ProjectPreview({ preview, stack, image, className, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw" }: Props) {
  if (image?.src) {
    return (
      <div className={cn("relative aspect-[4/3] w-full overflow-hidden bg-night-2", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  const items = preview.items.filter(Boolean);
  const bars = items.map((v) => Math.max(0, Number.parseFloat(v) || 0));
  const max = Math.max(1, ...bars);

  return (
    <div
      data-dark
      className={cn(
        "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-night-2 p-3.5 sm:p-4",
        className,
      )}
    >
      <div className="flex h-full w-full flex-col justify-between border border-night-line bg-night p-3.5 transition-colors duration-500 group-hover:border-violet sm:p-4">
        <div className="flex items-center justify-between border-b border-night-line pb-2.5">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-night-muted">{preview.header}</span>
          {preview.status.toLowerCase() === "live" ? (
            <span className="relative flex size-2" aria-label="Live">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative size-2 rounded-full bg-ok" />
            </span>
          ) : (
            <span className="font-mono text-[0.62rem] uppercase text-lavender-deep">{preview.status}</span>
          )}
        </div>

        <div className="my-auto py-3">
          {preview.kind === "terminal" && (
            <div className="space-y-2">
              <div className="h-1.5 w-3/4 bg-night-line transition-[width] duration-700 group-hover:w-5/6" />
              <div className="h-1.5 w-1/2 bg-night-line transition-[width] duration-700 group-hover:w-2/3" />
              {items.map((line) => (
                <div key={line} className="flex h-7 items-center border border-violet/50 bg-violet/20 px-2.5">
                  <span className="truncate font-mono text-[0.66rem] text-lavender-2">{line}</span>
                </div>
              ))}
            </div>
          )}

          {preview.kind === "metrics" && (
            <div className="grid grid-cols-2 gap-2">
              {items.map((item, i) => {
                const [label, ...rest] = item.split(":");
                return (
                  <div key={item} className="border border-night-line bg-night-3 p-2">
                    <span className="block text-[0.5rem] uppercase tracking-wider text-night-muted">{label.trim()}</span>
                    <span className={cn("font-mono text-[0.74rem] font-semibold", i % 2 === 1 ? "text-ok" : "text-white")}>
                      {rest.join(":").trim()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {preview.kind === "pipeline" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-1">
                {items.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-1">
                    <span
                      className={cn(
                        "size-2 shrink-0 transition-colors duration-500",
                        i < items.length - 1 ? "bg-violet" : "bg-night-line group-hover:bg-violet",
                      )}
                    />
                    {i < items.length - 1 && <span className="h-px flex-1 bg-night-line" />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-mono text-[0.5rem] uppercase tracking-wide text-night-muted">
                {items.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {preview.kind === "bars" && (
            <div className="space-y-2">
              <div className="flex h-9 items-end justify-between gap-1.5 px-1">
                {bars.map((b, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 origin-bottom transition-transform duration-500 group-hover:scale-y-110",
                      b === max ? "bg-violet" : "bg-night-line",
                    )}
                    style={{ height: `${(b / max) * 100}%` }}
                  />
                ))}
              </div>
              {preview.caption && (
                <p className="text-center font-mono text-[0.58rem] text-night-muted">
                  {preview.caption} <span className="font-semibold text-white">{bars.reduce((a, b) => a + b, 0)} this week</span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between font-mono text-[0.54rem] uppercase text-muted">
          <span>{stack[stack.length - 1]}</span>
          <span>{stack[0]}</span>
        </div>
      </div>
    </div>
  );
}
