import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseStudy from "@/components/sections/CaseStudy";
import CtaBanner from "@/components/sections/CtaBanner";
import FilterList from "@/components/sections/FilterList";
import PageIntro from "@/components/sections/PageIntro";
import { isOn } from "@/lib/links";
import { getContent } from "@/lib/store";
import { delay } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { work } = await getContent();
  return { title: work.seo.title, description: work.seo.description };
}

export default async function WorkPage() {
  const content = await getContent();
  if (!content.navigation.pages.work) notFound();
  const { work } = content;
  const projects = work.projects.filter(isOn);
  // Only offer filters that at least one visible project uses
  const filters = work.filters.filter((f) => projects.some((p) => p.categories.includes(f.id)));

  return (
    <>
      <PageIntro eyebrow={work.intro.eyebrow} lines={work.intro.lines} accent={work.intro.accent} lead={work.intro.lead || undefined} />

      {projects.length > 0 && (
        <section className="border-b border-line bg-strip py-14 md:py-20">
          <div className="container-page">
            <FilterList
              filters={[{ id: "all", label: work.allLabel }, ...filters]}
              listClassName="flex flex-col gap-10 md:gap-14"
              items={projects.map((p, i) => ({
                id: p.slug,
                tags: p.categories,
                node: <CaseStudy project={p} index={i} />,
              }))}
            />
          </div>
        </section>
      )}

      {work.values.visible && work.values.items.length > 0 && (
        <section className="border-b border-line bg-bg py-16 md:py-24">
          <div className="container-page">
            <SectionHeader eyebrow={work.values.eyebrow} title={work.values.title} aside={work.values.aside || undefined} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-8">
              {work.values.items.map((v, i) => (
                <article
                  key={`${v.title}-${i}`}
                  className="group flex flex-col justify-between border border-line bg-strip p-7 transition-colors duration-500 hover:border-ink hover:bg-paper"
                  data-reveal
                  style={delay(i * 100)}
                >
                  <div>
                    <span className="mb-6 flex size-11 items-center justify-center bg-ink text-on-ink transition-colors duration-300 group-hover:bg-violet">
                      <Icon name={v.icon} className="size-5" />
                    </span>
                    <span className="label-caps mb-2 block text-violet">{v.kicker}</span>
                    <h3 className="mb-3 font-serif text-headline-md leading-tight text-ink">{v.title}</h3>
                    <p className="text-body-sm text-muted">{v.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner banner={work.cta} />
    </>
  );
}
