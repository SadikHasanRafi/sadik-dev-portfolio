import SectionHeader from "@/components/ui/SectionHeader";
import FaqList from "@/components/sections/FaqList";
import { isOn } from "@/lib/links";
import type { Faq } from "@/types";

/** FAQ block with a two-column layout on desktop: heading left, questions right. */
export default function FaqSection({ faq, className = "bg-bg" }: { faq: Faq; className?: string }) {
  const items = faq.items.filter(isOn);
  if (!items.length) return null;
  return (
    <section className={`border-b border-line py-16 md:py-24 ${className}`}>
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <SectionHeader eyebrow={faq.eyebrow} title={faq.title} size="md" flush />
          {faq.aside && (
            <p className="mt-5 max-w-sm text-body-md text-muted" data-reveal>
              {faq.aside}
            </p>
          )}
        </div>
        <div className="lg:col-span-8">
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
