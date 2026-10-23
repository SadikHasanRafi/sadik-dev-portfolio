import Link from "next/link";
import Ambient from "@/components/effects/Ambient";
import SiteChrome from "@/components/layout/SiteChrome";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon from "@/components/ui/Icon";
import { navItems } from "@/lib/links";
import { getContent } from "@/lib/store";
import { delay } from "@/lib/utils";

export const metadata = { title: "Page Not Found" };

export default async function NotFound() {
  const content = await getContent();
  const links = navItems(content).filter((item) => item.id !== "home");

  return (
    <SiteChrome content={content}>
      <section className="relative overflow-hidden border-b border-line">
        <Ambient variant="intro" />
        <div className="container-page relative grid min-h-[75vh] items-center gap-12 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div>
            <Eyebrow className="anim-rise mb-6" marker>
              Error 404 · Route not found
            </Eyebrow>

            <p
              aria-hidden
              className="anim-rise select-none font-serif text-[7rem] leading-[0.9] tracking-tight min-[400px]:text-[9rem] sm:text-[12rem] lg:text-[14rem]"
              style={delay(60)}
            >
              <span className="text-outline">4</span>
              <span className="animate-float inline-block text-violet">0</span>
              <span className="text-outline">4</span>
            </p>

            <h1
              className="anim-rise mt-6 max-w-xl font-sans font-light uppercase tracking-[0.07em] text-[1.8rem] leading-[1.25] text-ink sm:text-[2.5rem]"
              style={delay(160)}
            >
              This page wandered <span className="accent-text accent-sunset">off the map.</span>
            </h1>
            <p className="anim-rise mt-5 max-w-md text-body-md text-muted sm:text-body-lg" style={delay(240)}>
              The link may be broken or the page has moved. Head back home, or jump straight to something useful.
            </p>

            <div className="anim-rise mt-9 flex flex-col gap-3 sm:flex-row" style={delay(320)}>
              <Button href="/">Back to Home</Button>
              {content.navigation.pages.contact && (
                <Button href="/contact/" variant="outline" icon={null}>
                  Report a broken link
                </Button>
              )}
            </div>
          </div>

          {links.length > 0 && (
            <nav aria-label="Pages you might want" className="anim-rise" style={delay(400)}>
              <p className="label-caps mb-4 text-muted">Try one of these</p>
              <ul className="border-t border-line">
                {links.map((item, i) => (
                  <li key={item.id} className="border-b border-line">
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-4 bg-bg/60 px-1 py-5 transition-[padding,background-color] duration-300 hover:bg-paper hover:px-4"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-body-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-serif text-headline-md leading-none text-ink">{item.label}</span>
                      </span>
                      <Icon
                        name="arrow-right"
                        className="size-4 text-violet transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={1.8}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>
    </SiteChrome>
  );
}
