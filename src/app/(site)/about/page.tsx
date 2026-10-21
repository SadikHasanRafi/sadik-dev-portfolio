import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon from "@/components/ui/Icon";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import CtaBanner from "@/components/sections/CtaBanner";
import { isOn, safeHref } from "@/lib/links";
import { getContent } from "@/lib/store";
import { delay } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getContent();
  return { title: about.seo.title, description: about.seo.description };
}

export default async function AboutPage() {
  const content = await getContent();
  if (!content.navigation.pages.about) notFound();
  const { about, media } = content;
  const experience = about.experience.items.filter(isOn);

  return (
    <>
      {/* Editorial hero & narrative */}
      <section className="border-b border-line bg-bg">
        <div className="container-page py-14 md:py-20 lg:py-24">
          {about.intro.eyebrow && (
            <div className="anim-rise mb-8">
              <Eyebrow>{about.intro.eyebrow}</Eyebrow>
            </div>
          )}

          <h1 className="mb-12 max-w-5xl font-serif text-[2.4rem] leading-[1.1] tracking-tight text-ink min-[400px]:text-[2.7rem] sm:text-display-md md:mb-16">
            {about.intro.lines.map((line, i) => (
              <span key={`${line}-${i}`} className="anim-rise sm:block" style={delay(80 + i * 90)}>
                {line}{" "}
              </span>
            ))}
            {about.intro.accent && (
              <span className="anim-rise inline-block italic text-violet sm:block" style={delay(80 + about.intro.lines.length * 90)}>
                {about.intro.accent}
              </span>
            )}
          </h1>

          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 lg:gap-10">
            {/* Portrait */}
            <div className="anim-rise flex flex-col gap-3 md:col-span-5 lg:col-span-4" style={delay(300)}>
              <div className="group relative aspect-[4/5] overflow-hidden bg-strip">
                <Image
                  src={media.portrait.src}
                  alt={about.portraitAlt || media.portrait.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 40vw, 92vw"
                  className={`origin-bottom scale-[1.14] object-cover object-[60%_center] transition-transform duration-[1.4s] ease-out-soft group-hover:scale-[1.18] ${media.portraitDark ? "only-light" : ""}`}
                />
                {media.portraitDark && (
                  <Image
                    src={media.portraitDark.src}
                    alt={about.portraitAlt || media.portraitDark.alt || media.portrait.alt}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 40vw, 92vw"
                    className="only-dark origin-bottom scale-[1.14] object-cover object-[60%_center] transition-transform duration-[1.4s] ease-out-soft group-hover:scale-[1.18]"
                  />
                )}
              </div>
              {about.availability.visible && (
                <div className="flex items-center justify-between bg-strip px-3 py-2.5 text-body-sm">
                  <span className="text-muted">{about.availability.label}</span>
                  <span className="flex items-center gap-2 font-medium text-violet">
                    <span className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-70" />
                      <span className="relative size-1.5 rounded-full bg-ok" />
                    </span>
                    {about.availability.value}
                  </span>
                </div>
              )}
            </div>

            {/* Narrative */}
            <div className="flex h-full flex-col justify-between gap-10 md:col-span-7 lg:col-span-8">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
                <div data-reveal>
                  <span className="label-caps mb-4 block text-muted">{about.background.label}</span>
                  <p className="mb-4 text-body-lg text-ink">{about.background.lead}</p>
                  <p className="text-body-md text-muted">{about.background.body}</p>
                </div>
                <div data-reveal style={delay(120)}>
                  <span className="label-caps mb-4 block text-muted">{about.thesis.label}</span>
                  <blockquote className="mb-4 border-l-2 border-violet pl-5 font-serif text-[1.45rem] italic leading-snug text-ink sm:text-headline-md">
                    {about.thesis.quote}
                  </blockquote>
                  <p className="text-body-md text-muted">{about.thesis.body}</p>
                </div>
              </div>

              {(about.buttons.cv || about.buttons.work.label) && (
                <div className="flex flex-col gap-4 border border-line bg-paper p-5 sm:flex-row sm:flex-wrap sm:items-center sm:p-6" data-reveal>
                  {about.buttons.cv && (
                    <Button href={media.cv.src} download icon="download">
                      {about.buttons.cv}
                    </Button>
                  )}
                  {about.buttons.work.label && (
                    <Button href={safeHref(about.buttons.work.href)} variant="quiet">
                      {about.buttons.work.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      {about.tools.groups.length > 0 && (
        <section className="border-b border-line bg-strip py-16 md:py-24">
          <div className="container-page">
            <SectionHeader eyebrow={about.tools.eyebrow} title={about.tools.title} aside={about.tools.aside || undefined} />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {about.tools.groups.map((g, i) => (
                <article
                  key={`${g.title}-${i}`}
                  className="group flex flex-col justify-between border border-line bg-paper p-6 transition-[border-color,transform] duration-500 ease-out-soft hover:border-ink lg:p-7"
                  data-reveal
                  style={delay(i * 90)}
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-body-sm font-medium text-muted">{g.index}</span>
                      <Icon name={g.icon} className="size-5 text-violet" />
                    </div>
                    <h3 className="mb-3 font-serif text-[1.6rem] leading-tight text-ink">{g.title}</h3>
                    <p className="mb-7 text-body-sm text-muted">{g.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tools.map((t) => (
                      <Tag key={t} tone={t === g.accent ? "accent" : "plain"}>
                        {t}
                      </Tag>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {about.tools.integrations.length > 0 && (
              <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center" data-reveal>
                <span className="text-body-sm text-muted sm:mr-4">{about.tools.integrationsLabel}</span>
                <div className="flex flex-wrap gap-2">
                  {about.tools.integrations.map((t) => (
                    <Tag key={t} tone="paper">
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Timeline */}
      {experience.length > 0 && (
        <section className="border-b border-line bg-bg py-16 md:py-24">
          <div className="container-page">
            <SectionHeader eyebrow={about.experience.eyebrow} title={about.experience.title} aside={about.experience.aside || undefined} />
            <ol className="relative flex flex-col gap-6 md:gap-8">
              {experience.map((item, i) => (
                <li
                  key={`${item.org}-${item.role}-${i}`}
                  className="group relative border border-line bg-paper p-6 transition-colors duration-500 hover:border-ink sm:p-8 lg:p-10"
                  data-reveal
                  style={delay(i * 80)}
                >
                  <span aria-hidden className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-violet transition-transform duration-700 ease-out-soft group-hover:scale-y-100" />
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                    <div className="flex flex-col lg:col-span-3">
                      <span className="font-mono text-[0.8rem] font-semibold text-violet">{item.period.toUpperCase()}</span>
                      <span className="label-caps mt-2 text-muted">{item.role}</span>
                      <span className="mt-2 font-serif text-[1.6rem] leading-tight text-ink">{item.org}</span>
                      <span className="text-body-sm text-muted">{item.context}</span>
                    </div>
                    <div className="lg:col-span-6">
                      <p className="mb-5 text-body-md text-ink">{item.summary}</p>
                      <ul className="flex flex-col gap-2 text-body-sm text-muted">
                        {item.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5">
                            <span className="font-bold text-violet">↳</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {item.stack.length > 0 && (
                      <div className="flex flex-col lg:col-span-3 lg:items-end">
                        <span className="mb-3 text-body-sm text-muted">{about.experience.stackLabel}</span>
                        <div className="flex flex-wrap gap-1.5 lg:justify-end">
                          {item.stack.map((t) => (
                            <Tag key={t} tone="plain">
                              {t}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Principles */}
      {about.principles.items.length > 0 && (
        <section className="border-b border-line bg-strip py-16 md:py-24">
          <div className="container-page">
            <SectionHeader eyebrow={about.principles.eyebrow} title={about.principles.title} aside={about.principles.aside || undefined} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {about.principles.items.map((p, i) => (
                <article
                  key={`${p.title}-${i}`}
                  className="group relative flex flex-col justify-between overflow-hidden border border-line bg-paper p-7"
                  data-reveal
                  style={delay(i * 100)}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-violet transition-transform duration-500 ease-out-soft group-hover:scale-x-100" />
                  <div>
                    <span className="mb-6 flex size-11 items-center justify-center bg-strip text-violet transition-colors duration-300 group-hover:bg-lavender">
                      <Icon name={p.icon} className="size-5" />
                    </span>
                    <span className="label-caps mb-2 block text-violet">{p.rule}</span>
                    <h3 className="mb-3 font-serif text-[1.6rem] leading-tight text-ink">{p.title}</h3>
                    <p className="text-body-sm text-muted">{p.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recognition & education */}
      {(about.achievements.visible || about.education.visible) && (
        <section className="border-b border-line bg-bg py-16 md:py-24">
          <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
            {about.achievements.visible && (
              <div className="lg:col-span-5" data-reveal>
                <Eyebrow className="mb-4">{about.achievements.eyebrow}</Eyebrow>
                <h2 className="mb-8 font-serif text-[2rem] leading-tight text-ink sm:text-headline-lg">{about.achievements.title}</h2>
                <ul className="divide-y divide-line border-y border-line">
                  {about.achievements.items.map((a, i) => (
                    <li key={a} className="flex items-baseline gap-5 py-5">
                      <span className="font-mono text-xs text-violet">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-body-md text-ink">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {about.education.visible && (
              <div className="lg:col-span-6 lg:col-start-7" data-reveal style={delay(120)}>
                <Eyebrow className="mb-4">{about.education.eyebrow}</Eyebrow>
                <h2 className="mb-8 font-serif text-[2rem] leading-tight text-ink sm:text-headline-lg">{about.education.title}</h2>
                <div className="border border-line bg-paper p-6 sm:p-8">
                  <span className="font-mono text-[0.8rem] font-semibold text-violet">{about.education.detail}</span>
                  <h3 className="mt-2 font-serif text-[1.5rem] leading-tight text-ink">{about.education.degree}</h3>
                  <p className="mt-1 text-body-sm text-muted">{about.education.school}</p>
                  {about.education.courses.length > 0 && (
                    <div className="mt-6 border-t border-line pt-5">
                      <span className="mb-3 block text-body-sm text-muted">{about.education.coursesLabel}</span>
                      <ul className="flex flex-col gap-2 text-body-sm text-ink">
                        {about.education.courses.map((c) => (
                          <li key={c} className="flex items-start gap-2.5">
                            <span className="font-bold text-violet">↳</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <CtaBanner banner={about.cta} />
    </>
  );
}
