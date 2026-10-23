import Ambient from "@/components/effects/Ambient";
import Eyebrow from "@/components/ui/Eyebrow";
import { cn, delay } from "@/lib/utils";

type Props = {
  eyebrow: string;
  /** Plain lines, each on its own row from `sm` up */
  lines: string[];
  accent: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

/** Editorial page header shared by inner pages. */
export default function PageIntro({ eyebrow, lines, accent, lead, children, className }: Props) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line bg-bg", className)}>
      <Ambient variant="intro" className="anim-fade" />
      <div className="container-page relative py-14 md:py-20 lg:py-24">
        {eyebrow && (
          <div className="anim-rise mb-8">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        <h1 className="mb-8 max-w-5xl font-sans text-[2rem] font-light uppercase leading-[1.2] tracking-[0.07em] text-ink min-[400px]:text-[2.3rem] sm:text-[3rem] lg:text-[3.6rem]">
          {lines.map((line, i) => (
            <span key={`${line}-${i}`} className="anim-rise sm:block" style={delay(80 + i * 90)}>
              {line}{" "}
            </span>
          ))}
          {accent && (
            <span className="anim-rise inline-block accent-text sm:block" style={delay(80 + lines.length * 90)}>
              {accent}
            </span>
          )}
        </h1>
        {lead && (
          <p className="anim-rise max-w-2xl text-body-md text-muted sm:text-body-lg" style={delay(320)}>
            {lead}
          </p>
        )}
        {children && (
          <div className="anim-rise" style={delay(420)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
