import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import CopyButton from "@/components/blog/CopyButton";
import ContactForm from "@/components/contact/ContactForm";
import LocalTime from "@/components/contact/LocalTime";
import FaqSection from "@/components/sections/FaqSection";
import Ambient from "@/components/effects/Ambient";
import PageIntro from "@/components/sections/PageIntro";
import { isOn, safeHref, telHref } from "@/lib/links";
import { getContent } from "@/lib/store";
import { delay } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { contactPage } = await getContent();
  return { title: contactPage.seo.title, description: contactPage.seo.description };
}

export default async function ContactPage() {
  const content = await getContent();
  if (!content.navigation.pages.contact) notFound();
  const { contact, contactPage: page, socials, media } = content;
  const shownSocials = socials.filter(isOn);

  return (
    <>
      <PageIntro eyebrow={page.intro.eyebrow} lines={page.intro.lines} accent={page.intro.accent} lead={page.intro.lead || undefined} />

      <section className="border-b border-line bg-strip py-14 md:py-20">
        <div className="container-page grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Channels */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex flex-col gap-6 border border-line bg-paper p-6 sm:p-7" data-reveal>
              {contact.email && (
                <div>
                  <span className="mb-2 block text-body-sm text-muted">{page.labels.email}</span>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a href={`mailto:${contact.email}`} className="break-all font-serif text-[1.35rem] text-ink transition-colors hover:text-violet sm:text-headline-md">
                      {contact.email}
                    </a>
                    <CopyButton text={contact.email} tone="light" className="bg-strip px-3 py-2" />
                  </div>
                </div>
              )}

              <div className="h-px bg-line" />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {contact.phone && (
                  <div>
                    <span className="mb-2 block text-body-sm text-muted">{page.labels.phone}</span>
                    <a href={telHref(contact.phone)} className="block text-body-md font-medium text-ink hover:text-violet">
                      {contact.phone}
                    </a>
                    {contact.whatsapp && (
                      <a
                        href={safeHref(contact.whatsapp, "#")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-rule font-mono text-[0.75rem] text-muted hover:text-violet"
                      >
                        {page.labels.whatsapp}
                      </a>
                    )}
                  </div>
                )}
                {contact.city && (
                  <div>
                    <span className="mb-2 block text-body-sm text-muted">{page.labels.based}</span>
                    <span className="block text-body-md font-medium text-ink">{contact.city}</span>
                    <span className="font-mono text-[0.75rem] text-muted">
                      {contact.utc} · {page.labels.localTime} <LocalTime timeZone={contact.timezone} />
                    </span>
                  </div>
                )}
              </div>

              {page.labels.replyText && (
                <>
                  <div className="h-px bg-line" />
                  <div className="flex items-start gap-3">
                    <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-violet" />
                    <div>
                      <span className="block text-body-sm font-semibold text-ink">{page.labels.reply}</span>
                      <p className="text-body-sm text-muted">{page.labels.replyText}</p>
                    </div>
                  </div>
                </>
              )}

              {shownSocials.length > 0 && (
                <>
                  <div className="h-px bg-line" />
                  <div>
                    <span className="mb-3 block text-body-sm text-muted">{page.labels.elsewhere}</span>
                    <div className="flex flex-wrap gap-2">
                      {shownSocials.map((s) => (
                        <a
                          key={s.label + s.href}
                          href={safeHref(s.href, "#")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="label-caps flex items-center gap-2 bg-strip px-3 py-2.5 text-ink transition-colors duration-300 hover:bg-violet hover:text-on-ink"
                        >
                          <Icon name={s.icon} className="size-3.5" />
                          {s.handle || s.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {page.cv.visible && (
              <a
                href={media.cv.src}
                download={media.cv.name}
                data-dark
                data-reveal
                style={delay(160)}
                className="group flex items-center justify-between gap-4 bg-night p-5 text-white transition-colors hover:bg-night-2"
              >
                <span>
                  <span className="mb-1 block text-body-sm text-lavender-deep">{page.cv.label}</span>
                  <span className="font-serif text-[1.3rem]">{page.cv.title}</span>
                </span>
                <Icon name="download" className="size-6 text-lavender-deep transition-transform group-hover:translate-y-0.5" />
              </a>
            )}
          </div>

          {/* Form */}
          <div className="border border-line bg-paper p-6 sm:p-8 lg:col-span-7 lg:p-10" data-reveal="fade" style={delay(120)}>
            <h2 className="mb-8 border-b border-line pb-5 font-serif text-[1.6rem] leading-tight text-ink">{page.form.title}</h2>
            <ContactForm form={page.form} email={contact.email} />
          </div>
        </div>
      </section>

      {page.faq.visible && <FaqSection faq={page.faq} />}

      {/* Fast track */}
      {page.fastTrack.visible && (
        <section className="relative overflow-hidden bg-lavender">
          <Ambient variant="band" />
          <div className="container-page relative flex flex-col justify-between gap-8 py-14 md:py-16 lg:flex-row lg:items-center">
            <div className="max-w-2xl" data-reveal>
              <h2 className="mb-2 font-serif text-[1.9rem] leading-tight text-violet-ink sm:text-headline-lg">{page.fastTrack.title}</h2>
              <p className="text-body-md text-violet-ink/70">{page.fastTrack.body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row" data-reveal style={delay(120)}>
              {contact.whatsapp && page.fastTrack.whatsappLabel && (
                <Button href={safeHref(contact.whatsapp)} variant="light" icon="whatsapp">
                  {page.fastTrack.whatsappLabel}
                </Button>
              )}
              {page.fastTrack.callLabel && (
                <Button href={`mailto:${contact.email}?subject=${encodeURIComponent("Discovery call request")}`}>{page.fastTrack.callLabel}</Button>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
