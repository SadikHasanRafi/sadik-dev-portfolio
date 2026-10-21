import type { Post } from "@/types";
import { cn } from "@/lib/utils";

/** Small coded visual at the top of a blog card. */
export default function PostPlate({ post }: { post: Post }) {
  const { plate } = post;
  const shell = "relative mb-6 flex h-36 w-full flex-col justify-between overflow-hidden p-4";

  if (plate.kind === "terminal") {
    return (
      <div data-dark className={cn(shell, "bg-night font-mono text-[0.72rem]")}>
        <span className="text-[0.62rem] uppercase tracking-wider text-night-muted">{plate.label}</span>
        <div className="space-y-1">
          <div className="text-lavender-deep">&gt; {plate.lines[0]}</div>
          <div className="text-night-muted">&gt; {plate.lines[1]}</div>
          <div className="text-white">&gt; {plate.lines[2]}</div>
        </div>
        <span className="text-[0.62rem] text-lavender-deep">STATUS: 200 OK</span>
      </div>
    );
  }

  if (plate.kind === "flow") {
    return (
      <div className={cn(shell, "bg-strip")}>
        <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted">{plate.label}</span>
        <div className="flex items-center gap-2">
          {plate.lines.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex-1 border px-1.5 py-2 text-center font-mono text-[0.58rem] tracking-wide",
                  i === plate.lines.length - 1 ? "border-violet bg-lavender text-violet" : "border-line bg-paper text-ink",
                )}
              >
                {s}
              </span>
              {i < plate.lines.length - 1 && <span className="text-violet">→</span>}
            </div>
          ))}
        </div>
        <span className="font-mono text-[0.62rem] text-muted">MAKER ≠ CHECKER</span>
      </div>
    );
  }

  if (plate.kind === "compare") {
    return (
      <div className={cn(shell, "bg-strip")}>
        <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted">{plate.label}</span>
        <div className="space-y-2.5 font-mono text-[0.68rem]">
          <div>
            <div className="mb-1 text-muted">{plate.lines[0]}</div>
            <div className="h-1.5 w-full bg-line">
              <div className="h-full w-[45%] bg-muted/50" />
            </div>
          </div>
          <div>
            <div className="mb-1 font-semibold text-violet">{plate.lines[1]}</div>
            <div className="h-1.5 w-full bg-line">
              <div className="h-full w-full origin-left bg-violet transition-transform duration-700 group-hover:scale-x-[0.97]" />
            </div>
          </div>
        </div>
        <span className="font-mono text-[0.62rem] text-muted">{post.tags.join(" · ").toUpperCase()}</span>
      </div>
    );
  }

  // code
  return (
    <div data-dark className={cn(shell, "bg-night font-mono text-[0.7rem] leading-relaxed")}>
      <span className="text-[0.62rem] uppercase tracking-wider text-night-muted">{plate.label}</span>
      <pre className="text-night-muted">
        <span className="text-lavender-deep">const</span> [claim] = <span className="text-lavender-deep">await</span> db{"\n"}
        {"  "}.update(payments){"\n"}
        {"  "}.where(<span className="text-lavender-2">&quot;PENDING&quot;</span>);
      </pre>
      <span className="text-[0.62rem] text-lavender-deep">affectedRows === 1 → execute</span>
    </div>
  );
}
