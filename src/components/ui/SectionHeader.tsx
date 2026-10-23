import Eyebrow from "@/components/ui/Eyebrow";
import { cn, delay } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  /** Short paragraph aligned to the right on desktop */
  aside?: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
  /** No bottom margin (when the header sits in its own column) */
  flush?: boolean;
};

/** Eyebrow + serif title, with an optional right-hand note or action. Eyebrow and title reveal in sequence. */
export default function SectionHeader({ eyebrow, title, aside, className, size = "lg", flush }: Props) {
  return (
    <div className={cn("flex flex-col justify-between gap-5 md:flex-row md:items-end", !flush && "mb-10 md:mb-14", className)}>
      <div className="max-w-3xl">
        {eyebrow && (
          <div data-reveal>
            <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
          </div>
        )}
        <h2
          data-reveal
          style={delay(90)}
          className={cn(
            "font-sans font-light uppercase tracking-[0.07em] text-ink",
            size === "lg"
              ? "text-[1.8rem] leading-[1.25] sm:text-[2.6rem]"
              : "text-[1.5rem] leading-tight sm:text-[2rem]",
          )}
        >
          {title}
        </h2>
      </div>
      {aside && (
        <div className="max-w-md text-body-md text-muted md:text-right" data-reveal style={delay(160)}>
          {aside}
        </div>
      )}
    </div>
  );
}
