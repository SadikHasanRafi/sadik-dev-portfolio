import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Small violet square before the label */
  marker?: boolean;
  tone?: "violet" | "muted" | "ink" | "lavender";
  className?: string;
};

const tones = {
  violet: "text-violet",
  muted: "text-muted",
  ink: "text-ink",
  lavender: "text-lavender-deep",
};

/** Uppercase section label ("FEATURED WORK"). */
export default function Eyebrow({ children, marker = false, tone = "violet", className }: Props) {
  return (
    <span className={cn("label-caps inline-flex items-center gap-2.5", tones[tone], className)}>
      {marker && <span className="size-1.5 shrink-0 bg-current" aria-hidden />}
      {children}
    </span>
  );
}
