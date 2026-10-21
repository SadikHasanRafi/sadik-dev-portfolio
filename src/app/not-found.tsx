import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import SiteChrome from "@/components/layout/SiteChrome";
import Ambient from "@/components/effects/Ambient";
import { getContent } from "@/lib/store";
import { delay } from "@/lib/utils";

export const metadata = { title: "Page Not Found" };

export default async function NotFound() {
  const content = await getContent();
  return (
    <SiteChrome content={content}>
      <section className="relative overflow-hidden border-b border-line">
        <Ambient variant="intro" />
        <div className="container-page relative flex min-h-[70vh] flex-col justify-center py-20">
          <Eyebrow className="anim-rise mb-6">Error 404 / Route Not Found</Eyebrow>
          <h1
            className="anim-rise max-w-3xl font-serif text-[2.75rem] leading-[1.08] tracking-tight sm:text-display-md lg:text-display-lg"
            style={delay(80)}
          >
            This endpoint returned <span className="italic text-violet">nothing.</span>
          </h1>
          <p className="anim-rise mt-6 max-w-lg text-body-md text-muted" style={delay(160)}>
            The page you requested doesn&apos;t exist or has moved. Let&apos;s route you somewhere useful.
          </p>
          <div className="anim-rise mt-10 flex flex-col gap-3 sm:flex-row" style={delay(240)}>
            <Button href="/">Back to Home</Button>
            {content.navigation.pages.work && (
              <Button href="/work/" variant="outline" icon={null}>
                View Work
              </Button>
            )}
          </div>
          <pre className="anim-fade mt-14 max-w-md overflow-x-auto bg-night p-4 font-mono text-xs text-night-muted" style={delay(400)}>
            <span className="text-lavender-deep">GET</span> {"<unknown route>"}
            {"\n"}
            <span className="text-alert">404</span> Not Found · handled gracefully
          </pre>
        </div>
      </section>
    </SiteChrome>
  );
}
