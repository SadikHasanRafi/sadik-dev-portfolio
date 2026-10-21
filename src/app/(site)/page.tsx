import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesStrip from "@/components/home/ServicesStrip";
import SelectedProjects from "@/components/home/SelectedProjects";
import AboutTeaser from "@/components/home/AboutTeaser";
import CtaBanner from "@/components/sections/CtaBanner";
import FaqSection from "@/components/sections/FaqSection";
import { getContent } from "@/lib/store";
import type { HomeSectionId, SiteContent } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getContent();
  return { ...(home.seo.title && { title: home.seo.title }), description: home.seo.description || undefined };
}

const sections: Record<HomeSectionId, (c: SiteContent) => React.ReactNode> = {
  hero: (c) => <Hero content={c} />,
  services: (c) => <ServicesStrip content={c} />,
  projects: (c) => <SelectedProjects content={c} />,
  about: (c) => <AboutTeaser content={c} />,
  faq: (c) => <FaqSection faq={c.home.faq} />,
  cta: (c) => <CtaBanner banner={c.home.cta} />,
};

/** Home page — section order and visibility come from the dashboard. */
export default async function HomePage() {
  const content = await getContent();
  const { identity, contact, socials } = content;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name,
    jobTitle: identity.role,
    email: `mailto:${contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: contact.city },
    sameAs: socials.filter((s) => s.visible !== false && s.href.startsWith("http")).map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      {content.home.sections
        .filter((s) => s.visible && sections[s.id])
        .map((s) => (
          <div key={s.id} className="contents">
            {sections[s.id](content)}
          </div>
        ))}
    </>
  );
}
