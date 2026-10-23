import Image from "next/image";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon from "@/components/ui/Icon";
import { isOn, safeHref } from "@/lib/links";
import { delay } from "@/lib/utils";
import type { SiteContent } from "@/types";

export default function AboutTeaser({ content }: { content: SiteContent }) {
  const { about, stats } = content.home;
  const { desk, deskDark, cv } = content.media;
  const shownStats = stats.filter(isOn);

  return (
    <section id="about" className="border-b border-line bg-strip py-16 md:py-24">
      <div className="container-page grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        {/* Philosophy & signature */}
        <div className="flex flex-col justify-center md:col-span-1 lg:col-span-4" data-reveal>
          {about.eyebrow && <Eyebrow className="mb-5">{about.eyebrow}</Eyebrow>}
          <h2 className="mb-6 font-sans text-[1.7rem] font-light uppercase leading-[1.2] tracking-[0.07em] text-ink sm:text-[2rem]">
            {about.title} <span className="accent-text">{about.accent}</span>
          </h2>
          <p className="mb-6 text-body-md text-muted">{about.body}</p>
          {about.signature && (
            <span className="mb-8 block -rotate-3 font-hand text-[2.6rem] leading-none text-violet">{about.signature}</span>
          )}
          <div className="flex flex-wrap gap-3">
            {about.cvLabel && (
              <Button href={cv.src} download variant="outline" icon="download">
                {about.cvLabel}
              </Button>
            )}
            {about.more.label && (
              <Button href={safeHref(about.more.href)} variant="quiet">
                {about.more.label}
              </Button>
            )}
          </div>
        </div>

        {/* Desk vignette */}
        <div className="flex items-center justify-center md:col-span-1 lg:col-span-4" data-reveal="scale" style={delay(120)}>
          <figure className="group w-full max-w-[420px] border border-line bg-paper p-3 sm:p-4">
            <div className="overflow-hidden">
              <Image
                src={desk.src}
                alt={desk.alt}
                width={desk.width}
                height={desk.height}
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 90vw"
                className={`h-auto w-full transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04] ${deskDark ? "only-light" : ""}`}
              />
              {deskDark && (
                <Image
                  src={deskDark.src}
                  alt={deskDark.alt || desk.alt}
                  width={deskDark.width}
                  height={deskDark.height}
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 90vw"
                  className="only-dark h-auto w-full transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04]"
                />
              )}
            </div>
          </figure>
        </div>

        {/* Stats */}
        <ul className="divide-y divide-line md:col-span-2 lg:col-span-4">
          {shownStats.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              className="group flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0 md:first:pt-5 lg:first:pt-0"
              data-reveal
              style={delay(160 + i * 80)}
            >
              <div className="flex items-center gap-5">
                <span className="flex size-11 items-center justify-center bg-lavender text-violet transition-colors duration-300 group-hover:bg-violet group-hover:text-on-ink">
                  <Icon name={s.icon} className="size-5" strokeWidth={1.7} />
                </span>
                <span className="font-serif text-[2.4rem] font-light leading-none tracking-tight text-ink">{s.value}</span>
              </div>
              <span className="label-caps max-w-[11rem] text-right font-bold tracking-[0.18em] text-muted">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
