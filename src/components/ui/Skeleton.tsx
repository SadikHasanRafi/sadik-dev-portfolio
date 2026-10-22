import { cn } from "@/lib/utils";

/** Placeholder block for loading UI. Size it with width/height classes. */
export default function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("skeleton", className)} style={style} />;
}

/** Page header placeholder matching PageIntro's rhythm. */
export function IntroSkeleton() {
  return (
    <section className="border-b border-line bg-bg">
      <div className="container-page py-14 md:py-20 lg:py-24">
        <Skeleton className="mb-8 h-3 w-40" />
        <Skeleton className="mb-4 h-10 w-full max-w-3xl sm:h-14" />
        <Skeleton className="mb-8 h-10 w-2/3 max-w-xl sm:h-14" />
        <Skeleton className="mb-2.5 h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </div>
    </section>
  );
}

/** Wraps skeleton content so assistive tech announces a single busy region. */
export function LoadingRegion({ label = "Loading", children }: { label?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}
