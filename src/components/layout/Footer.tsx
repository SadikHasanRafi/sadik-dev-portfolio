import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import { isOn, navItems, safeHref, telHref } from "@/lib/links";
import type { SiteContent } from "@/types";

export default function Footer({ content }: { content: SiteContent }) {
  const { identity, footer, contact, socials, media, navigation } = content;
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace("{year}", String(year)).replace("{name}", identity.name);
  const servicesHref = navigation.pages.services ? "/services/" : "/";
  const shown = socials.filter(isOn);

  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-page pb-10 pt-16 lg:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-line pb-14 md:grid-cols-4 lg:grid-cols-12 lg:gap-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-3">
            <Logo brand={identity} className="mb-5" />
            <p className="max-w-xs text-body-sm text-muted">{footer.statement}</p>
            {footer.cvLabel && (
              <a
                href={media.cv.src}
                download={media.cv.name}
                className="group label-caps mt-6 inline-flex items-center gap-2 text-ink transition-colors hover:text-violet"
              >
                <span className="link-rule">{footer.cvLabel}</span>
                <Icon name="download" className="size-3.5 transition-transform group-hover:translate-y-0.5" />
              </a>
            )}
          </div>

          <div className="lg:col-span-2">
            <h3 className="label-caps mb-5 tracking-[0.2em] text-ink">{footer.quickLinksLabel}</h3>
            <ul className="space-y-3 text-body-sm text-muted">
              {navItems(content).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-rule transition-colors hover:text-violet">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {footer.services.length > 0 && (
            <div className="lg:col-span-2">
              <h3 className="label-caps mb-5 tracking-[0.2em] text-ink">{footer.servicesLabel}</h3>
              <ul className="space-y-3 text-body-sm text-muted">
                {footer.services.map((s) => (
                  <li key={s}>
                    <Link href={servicesHref} className="link-rule transition-colors hover:text-violet">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="col-span-2 md:col-span-1 lg:col-span-3">
            <h3 className="label-caps mb-5 tracking-[0.2em] text-ink">{footer.contactLabel}</h3>
            <ul className="space-y-3 text-body-sm text-muted">
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 transition-colors hover:text-violet">
                    <Icon name="mail" className="size-4 shrink-0 text-violet" />
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a href={telHref(contact.phone)} className="flex items-center gap-2.5 transition-colors hover:text-violet">
                    <Icon name="phone" className="size-4 shrink-0 text-violet" />
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.city && (
                <li className="flex items-center gap-2.5">
                  <Icon name="pin" className="size-4 shrink-0 text-violet" />
                  {contact.city}
                </li>
              )}
            </ul>
          </div>

          {shown.length > 0 && (
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <h3 className="label-caps mb-5 tracking-[0.2em] text-ink">{footer.followLabel}</h3>
              <div className="flex flex-wrap items-center gap-3">
                {shown.map((s) => (
                  <a
                    key={s.label + s.href}
                    href={safeHref(s.href, "#")}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center border border-line text-ink transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-violet hover:bg-violet hover:text-on-ink"
                  >
                    <Icon name={s.icon} className="size-[1.1rem]" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-center sm:flex-row">
          <p className="font-mono text-xs text-muted">{copyright}</p>
          <p className="text-body-sm text-muted">{footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
