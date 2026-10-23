import Link from "next/link";
import PostPlate from "@/components/blog/PostPlate";
import Tag from "@/components/ui/Tag";
import type { Post } from "@/types";
import { formatDate } from "@/lib/utils";

type Props = { post: Post; topicLabel?: string; readLabel?: string };

export default function PostCard({ post, topicLabel, readLabel = "Read post" }: Props) {
  const href = `/blog/${post.slug}/`;
  return (
    <article className="group flex h-full flex-col justify-between border border-line bg-paper p-6 transition-[border-color,transform] duration-500 ease-out-soft hover:border-ink lg:p-7">
      <div>
        <div className="mb-5 flex items-center justify-between gap-3 font-mono text-[0.72rem] text-muted">
          <span className="special-text text-body-sm">{topicLabel ?? post.topicLabel}</span>
          <time dateTime={post.date}>{formatDate(post.date, "short").toUpperCase()}</time>
        </div>
        <PostPlate post={post} />
        <Link href={href} className="block">
          <h3 className="mb-3 font-serif text-[1.45rem] leading-snug text-ink transition-colors duration-300 group-hover:text-violet">
            {post.title.lead} <span className="accent-text accent-sunset">{post.title.accent}</span>
          </h3>
        </Link>
        <p className="mb-6 text-body-sm text-muted">{post.excerpt}</p>
      </div>
      <div>
        <div className="mb-5 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <Tag key={t} className="uppercase">
              {t}
            </Tag>
          ))}
        </div>
        <Link
          href={href}
          className="label-caps flex items-center justify-between border-t border-line pt-4 text-ink transition-colors hover:text-violet"
          aria-label={`Read: ${post.title.lead} ${post.title.accent}`}
        >
          <span className="link-rule">
            {readLabel} · {post.readMinutes} min
          </span>
          <span className="text-violet transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
