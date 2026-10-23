import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Ambient from "@/components/effects/Ambient";
import Icon from "@/components/ui/Icon";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import CtaBanner from "@/components/sections/CtaBanner";
import PageIntro from "@/components/sections/PageIntro";
import { isOn } from "@/lib/links";
import { getContent } from "@/lib/store";
import { delay } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { services } = await getContent();
  return { title: services.seo.title, description: services.seo.description };
}

export default async function ServicesPage() {
  const content = await getContent();
  if (!content.navigation.pages.services) notFound();
  const { services } = content;
  const items = services.items.filter(isOn);
  const engagements = services.engagements.items.filter(isOn);

  return (
    <>
      <PageIntro
        eyebrow={services.intro.eyebrow}
        lines={services.intro.lines}
        accent={services.intro.accent}
        lead={services.intro.lead || undefined}
      />

      {/* Disciplines */}
      {items.length > 0 && (
        <section className="border-b border-line bg-strip py-16 md:py-24">
          <div className="container-page">
            <SectionHeader eyebrow={services.list.eyebrow} title={services.list.title} size="md" aside={services.list.aside || undefined} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              {items.map((s, i) => (
                <article
                  key={s.slug}
                  id={s.slug}
                  className="group flex scroll-mt-24 flex-col justify-between border border-line bg-paper p-6 transition-colors duration-500 hover:border-ink sm:p-8"
                  data-reveal
                  style={delay((i % 2) * 100)}
                >
                  <div>
                    <div className="mb-4 flex items-start gap-4">
                      <Icon name={s.icon} className="mt-1 size-7 shrink-0 text-violet transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.4} />
                      <h2 className="font-sans font-light uppercase tracking-[0.07em] text-[1.4rem] leading-[1.25] text-ink transition-colors duration-300 group-hover:text-violet sm:text-[1.8rem]">
                        {s.title}
                      </h2>
                    </div>
                    <p className="mb-7 text-body-md text-muted">{s.body}</p>
                    {s.deliverables.length > 0 && (
                      <>
                        <span className="mb-3 block text-body-sm font-semibold text-ink">{services.list.deliverablesLabel}</span>
                        <ul className="mb-8 space-y-2 text-body-sm text-muted">
                          {s.deliverables.map((d) => (
                            <li key={d} className="flex items-start gap-2.5">
                              <span className="mt-[0.45rem] size-1 shrink-0 bg-violet" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  {s.stack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 bg-strip p-3">
                      <span className="mr-1 text-body-sm text-muted">{services.list.stackLabel}</span>
                      {s.stack.map((t) => (
                        <Tag key={t} tone="paper">
                          {t}
                        </Tag>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How I think + diagram */}
      {services.philosophy.visible && (
        <section className="border-b border-line bg-bg py-14 md:py-20">
          <div className="container-page">
            <div data-dark data-reveal className="relative flex flex-col items-center justify-between gap-10 overflow-hidden bg-night p-6 text-white sm:p-10 lg:flex-row lg:p-14">
              <Ambient variant="dark" />
              <div className="relative max-w-xl">
                <h3 className="mb-4 font-serif text-[1.8rem] leading-tight sm:text-headline-lg">{services.philosophy.title}</h3>
                <p className="text-body-md text-white/75">{services.philosophy.body}</p>
              </div>
              <FlowDiagram />
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {services.process.visible && services.process.steps.length > 0 && (
        <section className="border-b border-line bg-strip py-16 md:py-24">
          <div className="container-page">
            <SectionHeader eyebrow={services.process.eyebrow} title={services.process.title} size="md" aside={services.process.aside || undefined} />
            <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.process.steps.map((p, i) => (
                <li
                  key={`${p.phase}-${i}`}
                  className="group relative flex flex-col justify-between border border-line bg-paper p-6 lg:p-7"
                  data-reveal
                  style={delay(i * 100)}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-violet transition-transform duration-500 ease-out-soft group-hover:scale-x-100" />
                  <div>
                    <span className="special-text mb-4 inline-block text-body-sm">{p.phase}</span>
                    <h3 className="mb-3 font-serif text-[1.45rem] leading-tight text-ink">{p.title}</h3>
                    <p className="mb-6 text-body-sm text-muted">{p.body}</p>
                  </div>
                  {p.deliverable && <div className="bg-strip px-3 py-2.5 text-body-sm text-muted">{p.deliverable}</div>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Engagement models */}
      {services.engagements.visible && engagements.length > 0 && (
        <section className="border-b border-line bg-bg py-16 md:py-24">
          <div className="container-page">
            <SectionHeader
              eyebrow={services.engagements.eyebrow}
              title={services.engagements.title}
              size="md"
              aside={services.engagements.aside || undefined}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {engagements.map((m, i) => (
                <article
                  key={`${m.title}-${i}`}
                  className="relative flex flex-col justify-between border border-line bg-strip p-7 transition-colors duration-500 ease-out-soft hover:bg-paper lg:p-8"
                  data-reveal
                  style={delay(i * 100)}
                >
                  <div>
                    <span className="special-text mb-3 inline-block text-body-sm">{m.kicker}</span>
                    <h3 className="mb-3 font-serif text-[1.55rem] leading-tight text-ink">{m.title}</h3>
                    <p className="mb-7 text-body-sm text-muted">{m.body}</p>
                    <ul className="mb-8 space-y-2.5 text-body-sm">
                      {m.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2.5">
                          <Icon name="check" className="size-4 shrink-0 text-violet" strokeWidth={2} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {m.commitment && <span className="border-t border-line pt-5 text-body-sm text-muted">{m.commitment}</span>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner banner={services.cta} />
    </>
  );
}

/** Request path drawn as a blueprint: client → API guard → database, with the audit loop back. */
function FlowDiagram() {
  return (
    <svg viewBox="0 0 300 184" className="relative h-auto w-full max-w-[22rem] shrink-0 text-lavender-deep" fill="none" aria-hidden>
      <rect x="8" y="8" width="84" height="50" fill="#2A2A2D" stroke="currentColor" strokeWidth="1.2" />
      <text x="50" y="31" fill="#F2F0F0" fontSize="9.5" fontWeight="600" textAnchor="middle" className="font-sans">CLIENT / POS</text>
      <text x="50" y="45" fill="#A0A0A3" fontSize="8" textAnchor="middle" className="font-sans">JWT Session</text>

      <path d="M92 33h46" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.2" className="flow-dash" />
      <path d="m138 30 6 3-6 3z" fill="currentColor" />

      <rect x="146" y="8" width="146" height="50" fill="#2A2A2D" stroke="currentColor" strokeWidth="1.2" />
      <text x="219" y="29" fill="#F2F0F0" fontSize="9.5" fontWeight="600" textAnchor="middle" className="font-sans">EXPRESS API · RBAC</text>
      <text x="219" y="45" fill="#CEBDFF" fontSize="8" textAnchor="middle" className="font-sans">authorize(&quot;orders:create&quot;)</text>

      <path d="M219 58v38" stroke="currentColor" strokeWidth="1.2" />
      <path d="m216 96 3 6 3-6z" fill="currentColor" />

      <rect x="146" y="104" width="146" height="68" fill="#1C1B1B" stroke="#CEBDFF" strokeWidth="1.2" />
      <text x="219" y="128" fill="#F2F0F0" fontSize="9.5" fontWeight="600" textAnchor="middle" className="font-sans">POSTGRESQL · LEDGER</text>
      <text x="219" y="143" fill="#A0A0A3" fontSize="8" textAnchor="middle" className="font-sans">Unique keys · Transactions</text>
      <text x="219" y="158" fill="#CEBDFF" fontSize="8" textAnchor="middle" className="font-sans">Audit trail on every change</text>

      <path d="M146 138H50V58" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.2" className="flow-dash" />
      <path d="m47 64 3-6 3 6z" fill="currentColor" />
      <text x="56" y="130" fill="#A0A0A3" fontSize="7.5" className="font-sans">200 OK · idempotent</text>
    </svg>
  );
}
