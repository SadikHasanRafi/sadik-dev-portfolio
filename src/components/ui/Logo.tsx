import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

export type Brand = { name: string; role: string; initials: string; logo: ImageAsset | null };

/** Monogram (or uploaded logo) with name and role. */
export default function Logo({ brand, className }: { brand: Brand; className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label={`${brand.name}, home`}>
      {brand.logo ? (
        <Image
          src={brand.logo.src}
          alt=""
          width={brand.logo.width}
          height={brand.logo.height}
          sizes="72px"
          className="h-9 w-auto max-w-[7rem] object-contain"
        />
      ) : (
        <span className="flex size-9 items-center justify-center border border-ink font-serif text-lg font-bold leading-none tracking-tight transition-colors duration-300 group-hover:bg-ink group-hover:text-on-ink">
          {brand.initials}
        </span>
      )}
      <span className="flex flex-col">
        <span className="text-[0.72rem] font-semibold uppercase leading-tight tracking-[0.2em] text-ink">{brand.name}</span>
        <span className="mt-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.25em] text-muted">{brand.role}</span>
      </span>
    </Link>
  );
}
