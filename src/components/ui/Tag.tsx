import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  tone?: "default" | "accent" | "dark" | "plain" | "paper";
  className?: string;
};

const tones = {
  default: "border border-line bg-strip text-muted",
  accent: "border border-violet/30 bg-lavender text-violet",
  dark: "border border-night-line bg-night-2 text-lavender-deep",
  plain: "bg-strip text-ink",
  paper: "border border-line bg-paper text-ink",
};

/** Sharp rectangular technical tag. */
export default function Tag({ children, tone = "default", className }: Props) {
  return (
    <span className={cn("inline-flex items-center px-2 py-1 font-mono text-[0.72rem] leading-none", tones[tone], className)}>
      {children}
    </span>
  );
}
