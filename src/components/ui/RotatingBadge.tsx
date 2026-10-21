import { cn } from "@/lib/utils";

/** Circular stamp with text on a path that slowly rotates around a signature. */
export default function RotatingBadge({ text, signature, className }: { text: string; signature: string; className?: string }) {
  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden>
      <svg viewBox="0 0 160 160" className="animate-spin-slow size-full">
        <defs>
          <path id="badge-circle" d="M 80,80 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
        </defs>
        <text fill="currentColor" fontSize="10.4" fontWeight="600" letterSpacing="3" className="font-sans">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-hand text-[2rem] font-bold text-violet -rotate-12">
        {signature}
      </span>
    </div>
  );
}
