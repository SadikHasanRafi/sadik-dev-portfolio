import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/effects/Cursor";
import RevealObserver from "@/components/effects/RevealObserver";
import Telemetry from "@/components/effects/Telemetry";
import { getContent } from "@/lib/store";
import { themeCss, themeScript } from "@/lib/theme";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
// Secondary faces: not preloaded, so they never compete with the hero text.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: "700", preload: false });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { identity, media, socials } = await getContent();
  const title = `${identity.name} — ${identity.role}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${identity.name}` },
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
    icons: {
      icon: identity.favicon?.src ?? "/favicon.svg",
      apple: identity.favicon?.src ?? "/apple-touch-icon.png",
    },
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
      className={`${geist.variable} ${playfair.variable} ${geistMono.variable} ${caveat.variable}`}
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
