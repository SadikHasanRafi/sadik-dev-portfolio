import Image from "next/image";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon from "@/components/ui/Icon";
import RotatingBadge from "@/components/ui/RotatingBadge";
import { safeHref } from "@/lib/links";
import { delay } from "@/lib/utils";
import type { SiteContent } from "@/types";

export default function Hero({ content }: { content: SiteContent }) {
  const { hero } = content.home;
  const portrait = content.media.portrait;
  return (
    <section className="relative overflow-hidden border-b border-line" aria-labelledby="hero-title">
      <div className="container-page grid gap-6 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pt-0">
        {/* Copy */}
        <div className="relative z-10 flex flex-col justify-center lg:col-span-6 lg:py-20">
          {hero.greeting && <Eyebrow className="anim-rise mb-6">{hero.greeting}</Eyebrow>}

          <h1
            id="hero-title"
            className="mb-8 font-serif text-[2.2rem] font-normal leading-[1.08] tracking-tight text-ink min-[400px]:text-[2.6rem] sm:text-[3.6rem] lg:text-[3.9rem] xl:text-[4.4rem]"
          >
            {hero.lines.map((line, i) => (
              <span key={`${line}-${i}`} className="anim-rise block" style={delay(80 + i * 90)}>
                {line}
              </span>
            ))}
            {hero.accent && (
              <span className="anim-rise block font-medium italic text-violet" style={delay(80 + hero.lines.length * 90)}>
                {hero.accent}
              </span>
            )}
          </h1>

          <div className="anim-rule mb-8 h-[1.5px] w-12 bg-ink" style={delay(420)} />

          {hero.description && (
            <p className="anim-rise mb-10 max-w-lg text-body-md text-muted sm:text-[1rem]" style={delay(380)}>
              {hero.description}
            </p>
          )}

          <div className="anim-rise flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4" style={delay(460)}>
            {hero.primary.label && <Button href={safeHref(hero.primary.href)}>{hero.primary.label}</Button>}
            {hero.secondary.label && (
              <Button href={safeHref(hero.secondary.href)} variant="outline" icon={null}>
                {hero.secondary.label}
              </Button>
            )}
          </div>

          {hero.scrollLabel && (
            <a
              href="#services"
              className="anim-fade label-caps mt-12 hidden items-center gap-2 tracking-[0.25em] text-muted transition-colors hover:text-ink sm:inline-flex lg:mt-16"
              style={delay(700)}
            >
              {hero.scrollLabel}
              <Icon name="arrow-down" className="animate-nudge size-3.5 text-violet" strokeWidth={1.8} />
            </a>
          )}
        </div>

        {/* Portrait */}
        <div className="relative flex items-end justify-center lg:col-span-6 lg:justify-end">
          <div className="anim-fade relative w-full max-w-[440px] sm:max-w-[520px] lg:mt-10 lg:max-w-[580px]" style={delay(150)}>
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              preload
              sizes="(min-width: 1024px) 580px, (min-width: 640px) 520px, 92vw"
              className="portrait-mask h-auto w-full"
            />
            {hero.showBadge && (
              <RotatingBadge
                text={hero.badge}
                signature={`${content.identity.shortName}.`}
                className="absolute right-0 top-0 size-24 text-violet sm:size-32 lg:-right-2"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
