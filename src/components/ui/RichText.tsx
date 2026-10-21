import { Fragment } from "react";

/**
 * Renders a tiny markdown subset used in content files:
 * **bold**, *italic* and `code`. Runs at build time only.
 */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`")) {
          return (
            <code key={i} className="bg-strip px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("*")) {
          return (
            <em key={i} className="font-serif text-[1.05em] italic text-violet">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
