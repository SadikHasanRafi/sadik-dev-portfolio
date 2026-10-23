import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Caveat, Geist_Mono, Jost, Lato } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/effects/Cursor";
import RevealObserver from "@/components/effects/RevealObserver";
import Telemetry from "@/components/effects/Telemetry";
import { getContent } from "@/lib/store";
import { themeCss, themeScript } from "@/lib/theme";

// Two main faces: Bodoni Moda (stand-in for Vanity, a high-contrast display serif) for big headings, Lato for everything small.
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["300", "400", "700", "900"] });
// Wide-tracked caps for all-caps accent phrases (stand-in for Anchorage).
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400"], preload: false });
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"] });
// Secondary faces: not preloaded, so they never compete with the hero text.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: "700", preload: false });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { identity, media, socials } = await getContent();
  const title = `${identity.name} | ${identity.role}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${identity.name}` },
    description: identity.description,
    authors: [{ name: identity.name, url: socials.find((s) => s.icon === "linkedin")?.href }],
    openGraph: {
      type: "website",
      siteName: identity.name,
      title,
      description: identity.description,
      images: [{ url: media.ogImage.src, width: media.ogImage.width, height: media.ogImage.height, alt: media.ogImage.alt }],
    },
    twitter: { card: "summary_large_image", images: [media.ogImage.src] },
    // Without an uploaded favicon, Next serves the generated app/icon.tsx and app/apple-icon.tsx.
    ...(identity.favicon && { icons: { icon: identity.favicon.src, apple: identity.favicon.src } }),
    alternates: { types: { "application/rss+xml": "/feed.xml" } },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { theme } = await getContent();
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: theme.light.bg },
      { media: "(prefers-color-scheme: dark)", color: theme.dark.bg },
    ],
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { theme } = await getContent();
  return (
    // data-theme is set before paint by the inline script, so React must not complain about it.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${lato.variable} ${bodoni.variable} ${jost.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <head>
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript(theme) }} />
      </head>
      <body className="flex min-h-screen flex-col">
        {children}
        <Cursor />
        <RevealObserver />
        <Telemetry />
      </body>
    </html>
  );
}
