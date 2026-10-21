import { isOn } from "@/lib/links";
import { getContent } from "@/lib/store";

// Generated once and regenerated when the dashboard saves.
export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const { identity, blog, navigation } = await getContent();
  const posts = navigation.pages.blog ? blog.posts.filter(isOn) : [];

  const items = posts
    .map((p) => {
      const url = new URL(`/blog/${p.slug}/`, siteUrl).toString();
      return `    <item>
      <title>${escape(`${p.title.lead} ${p.title.accent}`)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(p.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(`${identity.name} — ${blog.seo.title || "Blog"}`)}</title>
    <link>${new URL("/blog/", siteUrl).toString()}</link>
    <description>${escape(identity.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
