import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { navItems } from "@/lib/links";
import type { SiteContent } from "@/types";

/** Header + page + footer for every public page (and the 404). */
export default function SiteChrome({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  const { identity, navigation, contact, talk, theme } = content;
  return (
    <>
      <a
        href="#main"
        className="label-caps sr-only z-[60] bg-ink px-4 py-3 text-on-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header
        brand={{ name: identity.name, role: identity.role, initials: identity.initials, logo: identity.logo }}
        nav={navItems(content)}
        cta={navigation.cta}
        contact={{ email: contact.email, city: contact.city, utc: contact.utc }}
        talk={talk}
        themeToggle={theme.allowToggle}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer content={content} />
    </>
  );
}
