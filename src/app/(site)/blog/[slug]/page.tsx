import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/blog/CopyButton";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import Icon from "@/components/ui/Icon";
import Tag from "@/components/ui/Tag";
import CtaBanner from "@/components/sections/CtaBanner";
import { isOn, safeHref } from "@/lib/links";
import { getContent } from "@/lib/store";
import { delay, formatDate } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function findPost(slug: string) {
  const content = await getContent();
  if (!content.navigation.pages.blog) return { content, post: undefined };
  return { content, post: content.blog.posts.find((p) => p.slug === slug && isOn(p)) };
}

// Known posts are pre-rendered; posts added later in the dashboard render on first visit.
export async function generateStaticParams() {
  const content = await getContent();
  return content.blog.posts.filter(isOn).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { content, post } = await findPost(slug);
  if (!post) return {};
  const title = `${post.title.lead} ${post.title.accent}`;
  return {
    title,
    description: post.excerpt,
    openGraph: { type: "article", title, description: post.excerpt, publishedTime: post.date, authors: [content.identity.name] },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { content, post } = await findPost(slug);
  if (!post) notFound();

  const { identity, blog, socials, contact } = content;
  const { article } = blog;
  const title = `${post.title.lead} ${post.title.accent}`;
  const topicLabel = (id: string, fallback: string) => blog.topics.find((t) => t.id === id)?.label ?? fallback;
  const related = blog.posts.filter((p) => p.slug !== post.slug && isOn(p)).slice(0, 3);
  const citation = `${identity.name}. "${title}." ${formatDate(post.date)}. ${siteUrl}/blog/${post.slug}/`;
  const github = socials.find((s) => s.icon === "github" && isOn(s));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: identity.name },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ReadingProgress target="article-body" />

      {/* Breadcrumb */}
      <div className="border-b border-line bg-strip">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link href="/blog/" className="group label-caps inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              {article.backLabel}
            </Link>
            <span className="hidden font-mono text-xs text-line sm:inline">/</span>
            <span className="label-caps hidden text-violet sm:inline">{topicLabel(post.topic, post.topicLabel)}</span>
          </div>
          <div className="flex gap-2">
            {post.tags.slice(0, 2).map((t, i) => (
              <span key={t} className={i === 0 ? "label-caps border border-line bg-bg px-2 py-1 text-muted" : "label-caps bg-lavender px-2 py-1 text-violet"}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-line bg-bg">
        <div className="container-page pb-10 pt-12 md:pb-14 md:pt-16">
          <div className="anim-rise mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.75rem] uppercase tracking-wider text-muted">
            <time dateTime={post.date}>Published: {formatDate(post.date)}</time>
            <span className="text-line">•</span>
            <span>{post.readMinutes} Min Read</span>
          </div>
          <h1 className="anim-rise mb-6 max-w-5xl font-serif text-[2.2rem] leading-[1.1] tracking-tight text-ink sm:text-display-md lg:text-[3.9rem]" style={delay(80)}>
            {post.title.lead}{" "}
            <em className="font-normal accent-text underline decoration-violet/30 decoration-1 underline-offset-8">{post.title.accent}.</em>
          </h1>
          <p className="anim-rise mb-10 max-w-3xl text-body-md text-muted sm:text-body-lg" style={delay(160)}>
            {post.excerpt}
          </p>
          <div className="anim-rise flex flex-col justify-between gap-5 border-t border-line pt-6 sm:flex-row sm:items-center" style={delay(240)}>
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center bg-ink font-serif text-lg font-bold text-on-ink">{identity.initials}</span>
              <div>
                <span className="label-caps block text-ink">{identity.name}</span>
                <span className="text-body-sm text-muted">
                  {identity.role} · {contact.city}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <CopyButton text={citation} label={article.citationLabel} tone="light" className="border border-line bg-bg px-4 py-2.5" />
              {github && (
                <a
                  href={safeHref(github.href, "#")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps flex items-center gap-1.5 bg-ink px-4 py-2.5 text-on-ink transition-colors hover:bg-violet"
                >
                  <Icon name="github" className="size-3.5" /> {github.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="bg-bg py-12 md:py-16">
        <div className="container-page grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <article id="article-body" className="min-w-0 lg:col-span-8">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-14 scroll-mt-28" data-reveal="fade">
                <span className="mb-3 block text-body-sm font-semibold text-violet">{section.kicker}</span>
                <h2 className="mb-6 font-serif text-[1.75rem] leading-tight text-ink sm:text-headline-lg">{section.title}</h2>
                {section.blocks.map((block, i) => (
                  <PostBody key={i} block={block} />
                ))}
              </section>
            ))}

            {post.takeaway && (
              <section className="mb-10 border-2 border-violet bg-lavender/40 p-6 sm:p-8" data-reveal>
                <div className="flex items-start gap-4">
                  <Icon name="shield" className="mt-1 size-7 shrink-0 text-violet" />
                  <div>
                    <span className="mb-2 block text-body-sm font-semibold text-violet">{article.takeawayLabel}</span>
                    <p className="mb-3 font-serif text-[1.45rem] italic leading-snug text-ink sm:text-headline-md">“{post.takeaway}”</p>
                    <span className="font-mono text-[0.75rem] uppercase tracking-wider text-muted">— {identity.name}</span>
                  </div>
                </div>
              </section>
            )}

            {post.checklist.length > 0 && (
              <section className="border border-line bg-paper p-6 sm:p-8" data-reveal>
                <h3 className="mb-6 font-serif text-headline-md text-ink">{article.checklistLabel}</h3>
                <ul className="space-y-4">
                  {post.checklist.map((c) => (
                    <li key={c.title} className="flex items-start gap-3 text-body-md">
                      <span className="mt-1 flex size-4 shrink-0 items-center justify-center bg-ink text-on-ink">
                        <Icon name="check" className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-ink/85">
                        <strong className="strong-text">{c.title}:</strong> {c.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-4">
            {post.sections.length > 0 && (
              <div className="border border-line bg-strip p-5">
                <div className="mb-2 border-b border-line pb-3">
                  <span className="text-body-sm font-semibold text-ink">{article.tocLabel}</span>
                </div>
                <TableOfContents items={post.sections.map((s) => ({ id: s.id, title: s.title }))} />
              </div>
            )}

            {post.stack.length > 0 && (
              <div className="border border-line bg-paper p-5">
                <span className="mb-4 block text-body-sm font-semibold text-ink">{article.stackLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.stack.map((t, i) => (
                    <Tag key={t} tone={i < 2 ? "accent" : "default"}>
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {article.asideTitle && (
              <div data-dark className="bg-night p-5 text-white">
                <span className="label-caps mb-3 flex items-center gap-2 text-lavender-deep">
                  <Icon name="message" className="size-4" /> {article.asideTitle}
                </span>
                <p className="mb-5 text-body-sm text-night-muted">{article.asideBody}</p>
                {article.asideButton.label && (
                  <Link
                    href={safeHref(article.asideButton.href)}
                    className="group label-caps flex w-full items-center justify-center gap-2 bg-white px-4 py-3 text-[#111111] transition-colors hover:bg-lavender-deep"
                  >
                    {article.asideButton.label}
                    <Icon name="arrow-right" className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
                  </Link>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Read next */}
      {related.length > 0 && (
        <section className="border-y border-line bg-strip py-16 md:py-20">
          <div className="container-page">
            <div className="mb-10 flex items-end justify-between gap-4" data-reveal>
              <h2 className="font-serif text-[2rem] leading-tight text-ink sm:text-headline-lg">{article.relatedTitle}</h2>
              <Link href="/blog/" className="label-caps link-rule text-ink hover:text-violet">
                {article.relatedLink}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <div key={p.slug} data-reveal style={delay(i * 100)}>
                  <PostCard post={p} topicLabel={topicLabel(p.topic, p.topicLabel)} readLabel={blog.readLabel} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner banner={blog.cta} />
    </>
  );
}
