import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import CodeBlock from "@/components/blog/CodeBlock";
import PostCard from "@/components/blog/PostCard";
import CtaBanner from "@/components/sections/CtaBanner";
import FilterList from "@/components/sections/FilterList";
import PageIntro from "@/components/sections/PageIntro";
import { isOn, safeHref } from "@/lib/links";
import { getContent } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { blog } = await getContent();
  return { title: blog.seo.title, description: blog.seo.description };
}

export default async function BlogPage() {
  const content = await getContent();
  if (!content.navigation.pages.blog) notFound();
  const { blog, socials } = content;
  const posts = blog.posts.filter(isOn);
  const [featured, ...rest] = posts;
  const topicLabel = (id: string, fallback: string) => blog.topics.find((t) => t.id === id)?.label ?? fallback;
  const featuredCode = featured?.sections.flatMap((s) => s.blocks).find((b) => b.type === "code");
  const linkedin = socials.find((s) => s.icon === "linkedin" && isOn(s));
  const topics = blog.topics.filter((t) => rest.some((p) => p.topic === t.id));

  return (
    <>
      <PageIntro eyebrow={blog.intro.eyebrow} lines={blog.intro.lines} accent={blog.intro.accent} lead={blog.intro.lead || undefined} />

      {/* Featured */}
      {featured && (
        <section className="border-b border-line bg-strip py-14 md:py-20">
          <div className="container-page">
            <div className="mb-6 flex items-center justify-between" data-reveal>
              <Eyebrow tone="ink">{blog.latestLabel}</Eyebrow>
            </div>
            <article className="group grid grid-cols-1 gap-8 border border-line bg-paper p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10" data-reveal>
              <div className="flex flex-col justify-between lg:col-span-7">
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-body-sm font-semibold text-violet">{topicLabel(featured.topic, featured.topicLabel)}</span>
                    <span className="text-line">•</span>
                    <time className="label-caps text-muted" dateTime={featured.date}>
                      {formatDate(featured.date)}
                    </time>
                    <span className="text-line">•</span>
                    <span className="label-caps text-muted">{featured.readMinutes} Min Read</span>
                  </div>
                  <Link href={`/blog/${featured.slug}/`}>
                    <h2 className="mb-5 font-serif text-[1.9rem] leading-tight text-ink transition-colors group-hover:text-violet sm:text-headline-lg">
                      {featured.title.lead} <span className="italic text-violet">{featured.title.accent}</span>
                    </h2>
                  </Link>
                  <p className="mb-8 text-body-md text-muted">{featured.excerpt}</p>
                </div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <Button href={`/blog/${featured.slug}/`}>{blog.readLabel}</Button>
                  <div className="flex flex-wrap gap-1.5">
                    {featured.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </div>
              <div className="min-w-0 lg:col-span-5 [&_figure]:my-0">
                {featuredCode?.type === "code" && (
                  <CodeBlock code={featuredCode.code.split("\n").slice(0, 16).join("\n") + "\n  // …"} file={featuredCode.file} lang={featuredCode.lang} />
                )}
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Index */}
      {rest.length > 0 && (
        <section className="border-b border-line bg-bg py-16 md:py-24">
          <div className="container-page">
            <SectionHeader eyebrow={blog.index.eyebrow} title={blog.index.title} size="md" aside={blog.index.aside || undefined} />
            <FilterList
              filters={[{ id: "all", label: blog.allLabel }, ...topics]}
              search={{ placeholder: blog.searchPlaceholder }}
              empty={blog.emptyText}
              listClassName="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              items={rest.map((p) => ({
                id: p.slug,
                tags: [p.topic],
                text: `${p.title.lead} ${p.title.accent} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase(),
                node: <PostCard post={p} topicLabel={topicLabel(p.topic, p.topicLabel)} readLabel={blog.readLabel} />,
              }))}
            />
          </div>
        </section>
      )}

      {/* Follow along */}
      {blog.follow.visible && (
        <section className="border-b border-line bg-strip py-14 md:py-20">
          <div className="container-page">
            <div className="grid grid-cols-1 items-center gap-8 border border-line bg-paper p-6 sm:p-10 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-7">
                <Eyebrow className="mb-3">{blog.follow.eyebrow}</Eyebrow>
                <h3 className="mb-2 font-serif text-[1.8rem] leading-tight text-ink sm:text-headline-lg">{blog.follow.title}</h3>
                <p className="max-w-xl text-body-md text-muted">{blog.follow.body}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
                {blog.follow.rssLabel && (
                  <Button href="/feed.xml" icon="rss">
                    {blog.follow.rssLabel}
                  </Button>
                )}
                {linkedin && blog.follow.linkedinLabel && (
                  <Button href={safeHref(linkedin.href)} variant="outline" icon="external">
                    {blog.follow.linkedinLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaBanner banner={blog.cta} />
    </>
  );
}
