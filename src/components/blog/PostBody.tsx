import CodeBlock from "@/components/blog/CodeBlock";
import RichText from "@/components/ui/RichText";
import type { PostBlock } from "@/types";
import { cn } from "@/lib/utils";

/** Renders one content block of an article. */
export default function PostBody({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="mb-5 text-body-md leading-[1.8] text-ink/85 sm:text-[1.02rem]">
          <RichText text={block.text} />
        </p>
      );

    case "list":
      return (
        <ul className="mb-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-body-md leading-relaxed text-ink/85">
              <span className="mt-[0.6rem] size-1.5 shrink-0 bg-violet" />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "code":
      return <CodeBlock code={block.code} file={block.file} lang={block.lang} />;

    case "callout":
      return (
        <aside
          className={cn(
            "my-7 border-l-4 bg-strip p-5",
            block.tone === "warning" ? "border-alert" : "border-violet",
          )}
        >
          <span className={cn("label-caps mb-2 block", block.tone === "warning" ? "text-alert" : "text-violet")}>
            {block.label}
          </span>
          <p className="text-body-sm leading-relaxed text-muted">{block.text}</p>
        </aside>
      );

    case "steps":
      return (
        <figure className="my-8 border border-line bg-paper p-4 sm:p-5">
          <figcaption className="mb-5 flex items-center justify-between border-b border-line pb-3">
            <span className="label-caps text-muted">{block.caption}</span>
            <span className="hidden font-mono text-[0.72rem] text-violet sm:block">Zero-Drift Flow</span>
          </figcaption>
          <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
            {block.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col md:flex-1 md:flex-row md:items-center">
                <div
                  className={cn(
                    "flex-1 border p-3.5 transition-colors duration-500",
                    i === 1 ? "border-night bg-night text-white" : "border-line bg-strip text-ink",
                  )}
                >
                  <span className={cn("mb-1 block font-mono text-[0.66rem]", i === 1 ? "text-lavender-deep" : "text-violet")}>
                    0{i + 1}
                  </span>
                  <span className="block text-[0.78rem] font-semibold uppercase tracking-wider">{s.title}</span>
                  <span className={cn("mt-1 block text-[0.75rem]", i === 1 ? "text-night-muted" : "text-muted")}>{s.detail}</span>
                </div>
                {i < block.steps.length - 1 && (
                  <span aria-hidden className="flex justify-center py-1 text-violet md:px-2 md:py-0">
                    <span className="rotate-90 md:rotate-0">→</span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </figure>
      );
  }
}
