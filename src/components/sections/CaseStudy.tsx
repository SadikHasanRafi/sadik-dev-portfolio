import Icon from "@/components/ui/Icon";
import Tag from "@/components/ui/Tag";
import ProjectPreview from "@/components/sections/ProjectPreview";
import { safeHref } from "@/lib/links";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

/** Project write-up: a small system preview beside the story, alternating sides. */
export default function CaseStudy({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;

  return (
    <article id={project.slug} className="group grid scroll-mt-24 grid-cols-1 border border-line bg-paper lg:grid-cols-12">
      <div
        data-dark
        className={cn(
          "flex flex-col justify-center gap-8 bg-night p-6 sm:p-8 lg:col-span-5 lg:p-10",
          flip && "lg:order-2",
        )}
      >
        <div className="mx-auto w-full max-w-md">
          <ProjectPreview preview={project.preview} stack={project.stack} image={project.image} sizes="(min-width: 1024px) 28rem, 92vw" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <Tag key={t} tone="dark">
              {t}
            </Tag>
          ))}
        </div>
      </div>

      <div className={cn("flex flex-col justify-between gap-10 p-6 sm:p-8 lg:col-span-7 lg:p-12", flip && "lg:order-1")}>
        <div>
          <p className="mb-3 text-body-sm text-muted">
            {[project.eyebrow[1], project.status].filter(Boolean).join(" · ")}
          </p>
          <h2 className="mb-5 font-serif text-[1.9rem] leading-[1.15] tracking-tight text-ink sm:text-headline-lg">
            {project.title.lead}
            {project.title.accent && `: ${project.title.accent}`}
            {project.title.tail}
          </h2>
          <p className="mb-7 text-body-md text-muted">{project.summary}</p>

          {project.challenge.body && (
            <div className="mb-7 border-l-2 border-violet pl-5">
              <span className="mb-1.5 block text-body-sm font-semibold text-ink">{project.challenge.label}</span>
              <p className="text-body-sm text-muted">{project.challenge.body}</p>
            </div>
          )}

          <ul className="grid gap-2.5 text-body-sm text-ink">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <Icon name="check" className="mt-0.5 size-4 shrink-0 text-violet" strokeWidth={2} />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {project.outcomes.length > 0 && (
            <div className="grid grid-cols-2 gap-6 border-t border-line pt-7">
              {project.outcomes.map((o) => (
                <div key={o.label}>
                  <span className="mb-1 block font-serif text-[2.25rem] leading-none text-ink">{o.value}</span>
                  <span className="block text-body-sm font-medium text-ink">{o.label}</span>
                  <span className="mt-0.5 block text-body-sm text-muted">{o.note}</span>
                </div>
              ))}
            </div>
          )}
          {project.link?.href && (
            <a
              href={safeHref(project.link.href, "#")}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link label-caps mt-8 inline-flex items-center gap-2 text-ink transition-colors hover:text-violet"
            >
              <span className="link-rule">Visit {project.link.label}</span>
              <Icon name="external" className="size-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" strokeWidth={1.8} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
