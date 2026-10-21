import Link from "next/link";
import Icon from "@/components/ui/Icon";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectPreview from "@/components/sections/ProjectPreview";
import { isOn } from "@/lib/links";
import { delay } from "@/lib/utils";
import type { SiteContent } from "@/types";

export default function SelectedProjects({ content }: { content: SiteContent }) {
  const section = content.home.projects;
  const projects = content.work.projects.filter(isOn).slice(0, Math.max(1, section.limit));
  if (!projects.length) return null;
  const workOn = content.navigation.pages.work;

  return (
    <section id="work" className="border-b border-line bg-bg py-16 md:py-24">
      <div className="container-page">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          aside={
            workOn && section.viewAllLabel ? (
              <Link href="/work/" className="group label-caps inline-flex items-center gap-2 tracking-[0.2em] text-ink transition-colors hover:text-violet">
                <span className="link-rule">{section.viewAllLabel}</span>
                <Icon name="arrow-right" className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
              </Link>
            ) : (
              section.aside || undefined
            )
          }
        />

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p, i) => (
            <Link key={p.slug} href={workOn ? `/work/#${p.slug}` : "#work"} className="group block" data-reveal style={delay(i * 100)}>
              <div className="mb-4 overflow-hidden transition-transform duration-500 ease-out-soft group-hover:-translate-y-1">
                <ProjectPreview preview={p.preview} stack={p.stack} image={p.image} />
              </div>
              <h3 className="label-caps flex items-center justify-between text-[0.75rem] font-bold tracking-[0.16em] text-ink transition-colors group-hover:text-violet">
                {p.name}
                <Icon
                  name="arrow-right"
                  className="size-3.5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  strokeWidth={1.8}
                />
              </h3>
              <p className="mt-1 text-body-sm text-muted">{p.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
