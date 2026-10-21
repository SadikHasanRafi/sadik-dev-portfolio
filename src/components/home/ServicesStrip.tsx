import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { isOn } from "@/lib/links";
import { delay } from "@/lib/utils";
import type { SiteContent } from "@/types";

/** Recessed band with service columns split by hairlines. */
export default function ServicesStrip({ content }: { content: SiteContent }) {
  const items = content.services.items.filter(isOn);
  if (!items.length) return null;
  const linked = content.navigation.pages.services;

  return (
    <section id="services" className="border-b border-line bg-strip py-12 md:py-16" aria-label="Services">
      <div className="container-page">
        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {items.map((s, i) => (
            <Link
              key={s.slug}
              href={linked ? `/services/#${s.slug}` : "#services"}
              data-reveal
              style={delay(i * 90)}
              className="group flex flex-col py-7 sm:py-6 sm:pr-8 lg:px-8 lg:py-2 lg:first:pl-0 lg:last:pr-0"
            >
              <Icon
                name={s.icon}
                className="mb-5 size-8 text-violet transition-transform duration-500 ease-out-soft group-hover:-translate-y-1"
                strokeWidth={1.4}
              />
              <h2 className="label-caps mb-2.5 text-[0.75rem] font-bold tracking-[0.18em] text-ink transition-colors group-hover:text-violet">
                {s.short}
              </h2>
              <p className="text-body-sm text-muted">{s.shortBody}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
