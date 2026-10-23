import Ambient from "@/components/effects/Ambient";
import MagneticCta from "@/components/sections/MagneticCta";
import { safeHref } from "@/lib/links";
import { delay } from "@/lib/utils";
import type { Banner } from "@/types";

/** Full-bleed lavender band that closes most pages. Headline matches the home hero style. */
export default function CtaBanner({ banner }: { banner: Banner }) {
  if (!banner.visible) return null;
  return (
    <section className="relative overflow-hidden bg-lavender">
      <Ambient variant="band" />
      <div className="container-page relative flex flex-col justify-between gap-8 py-14 md:py-20 lg:flex-row lg:items-center">
        <div className="max-w-2xl" data-reveal>
          {banner.eyebrow && (
            <span className="label-caps mb-4 flex items-center gap-2.5 text-violet">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping bg-violet opacity-60" />
                <span className="relative size-1.5 bg-violet" />
              </span>
              {banner.eyebrow}
            </span>
          )}
          <h2 className="font-sans text-[1.7rem] font-light uppercase leading-[1.2] tracking-[0.07em] text-ink sm:text-[2.2rem] lg:text-[2.5rem]">
            {banner.title} <span className="accent-text">{banner.accent}</span>
          </h2>
          {banner.body && <p className="mt-4 max-w-xl text-body-md text-muted">{banner.body}</p>}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center" data-reveal style={delay(120)}>
          {banner.button.label && <MagneticCta href={safeHref(banner.button.href)} label={banner.button.label} />}
          {banner.secondary.visible && banner.secondary.label && (
            <a
              href={safeHref(banner.secondary.href)}
              className="label-caps link-rule self-start text-ink transition-colors hover:text-violet sm:self-center"
            >
              {banner.secondary.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
