import type { MetadataRoute } from "next";
import { isOn, navItems } from "@/lib/links";
import { getContent } from "@/lib/store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const pages = navItems(content).map((item) => ({
    url: new URL(item.href, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: item.href === "/" ? 1 : 0.8,
  }));
  const articles = content.navigation.pages.blog
    ? content.blog.posts.filter(isOn).map((p) => ({
        url: new URL(`/blog/${p.slug}/`, siteUrl).toString(),
        lastModified: p.date,
        changeFrequency: "yearly" as const,
        priority: 0.6,
      }))
    : [];
  return [...pages, ...articles];
}
