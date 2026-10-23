import Image from "next/image";
import Ambient from "@/components/effects/Ambient";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon from "@/components/ui/Icon";
import RotatingBadge from "@/components/ui/RotatingBadge";
import { safeHref } from "@/lib/links";
import { delay } from "@/lib/utils";
import type { SiteContent } from "@/types";

export default function Hero({ content }: { content: SiteContent }) {
  const { hero } = content.home;
  const { portrait, portraitDark } = content.media;
  return (
    <section className="relative overflow-hidden border-b border-line" aria-labelledby="hero-title">
      <Ambient variant="hero" className="anim-fade" />
      <div className="container-page grid gap-6 pt-10 sm:pt-14 xl:grid-cols-12 xl:gap-12 xl:pt-0">
        {/* Copy */}
        <div className="relative z-10 flex flex-col justify-center xl:col-span-6 xl:pb-20 xl:pt-4">
          {hero.greeting && <Eyebrow className="anim-rise mb-6">{hero.greeting}</Eyebrow>}

          <h1
            id="hero-title"
            className="mb-8 font-sans text-[1.75rem] font-light uppercase leading-[1.2] tracking-[0.07em] text-ink min-[400px]:text-[2rem] sm:text-[2.5rem] xl:text-[2.8rem] 2xl:text-[3rem]"
          >
            {hero.lines.map((line, i) => (
              <span key={`${line}-${i}`} className="anim-rise block" style={delay(80 + i * 90)}>
                {line}
              </span>
            ))}
            {hero.accent && (
              <span className="anim-rise block accent-text" style={delay(80 + hero.lines.length * 90)}>
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
            {hero.primary.label && <Button href={safeHref(hero.primary.href)} className="h-[3.25rem]">{hero.primary.label}</Button>}
            {hero.secondary.label && (
              <Button href={safeHref(hero.secondary.href)} variant="outline" icon={null} className="h-[3.25rem]">
                {hero.secondary.label}
              </Button>
            )}
          </div>

          {hero.scrollLabel && (
            <a
              href="#services"
              className="anim-fade label-caps mt-12 hidden items-center gap-2 tracking-[0.25em] text-muted transition-colors hover:text-ink sm:inline-flex xl:absolute xl:bottom-6 xl:left-0 xl:mt-0"
              style={delay(700)}
            >
              {hero.scrollLabel}
              <Icon name="arrow-down" className="animate-nudge size-3.5 text-violet" strokeWidth={1.8} />
            </a>
          )}
        </div>

        {/* Portrait */}
        <div className="relative flex items-end justify-center xl:col-span-6 xl:justify-center xl:pb-20 xl:pt-4">
          <div className="anim-fade relative w-full max-w-[380px] sm:max-w-[440px] xl:max-w-[540px]" style={delay(150)}>
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              preload
              sizes="(min-width: 1280px) 540px, (min-width: 640px) 440px, 92vw"
              className={`portrait-mask h-auto w-full ${portraitDark ? "only-light" : ""}`}
            />
            {portraitDark && (
              <Image
                src={portraitDark.src}
                alt={portraitDark.alt || portrait.alt}
                width={portraitDark.width}
                height={portraitDark.height}
                loading="eager"
                sizes="(min-width: 1280px) 540px, (min-width: 640px) 440px, 92vw"
                className="portrait-mask-dark only-dark h-auto w-full"
              />
            )}
            {hero.showBadge && (
              <RotatingBadge
                text={hero.badge}
                signature={`${content.identity.shortName}.`}
                className="absolute right-0 top-0 size-24 text-violet sm:size-32 xl:right-0"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
