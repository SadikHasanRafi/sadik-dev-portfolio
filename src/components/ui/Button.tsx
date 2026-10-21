import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { IconName } from "@/types";

type Variant = "solid" | "outline" | "quiet" | "light";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  /** Trailing icon; arrow nudges right on hover, download nudges down */
  icon?: IconName | null;
  download?: boolean;
  className?: string;
};

const variants: Record<Variant, string> = {
  solid: "bg-ink text-on-ink hover:bg-violet",
  outline: "border border-ink bg-paper text-ink hover:bg-ink hover:text-on-ink",
  quiet: "bg-strip text-ink hover:bg-line",
  light: "bg-paper text-ink hover:bg-bg",
};

/** Square, uppercase, tracked button used across the site (0px radius by design). */
export default function Button({
  href,
  children,
  variant = "solid",
  icon = "arrow-right",
  download,
  className,
}: Props) {
  const classes = cn(
    "group label-caps inline-flex items-center justify-center gap-3 px-7 py-4 transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97]",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          className={cn(
            "size-3.5 transition-transform duration-300",
            icon === "download" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-1",
          )}
          strokeWidth={1.8}
        />
      )}
    </>
  );

  // External URLs and static files (feed.xml, resume.pdf) bypass client-side routing
  const plain = /^(https?:|mailto:|tel:)/.test(href) || /\.\w+$/.test(href);
  if (plain || download) {
    return (
      <a
        href={href}
        className={classes}
        download={download || undefined}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
