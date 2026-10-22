"use client";

import { useEffect } from "react";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** The private dashboard is never reported, so the numbers only describe real visitors. */
function skipDashboard<T extends { url: string }>(event: T): T | null {
  return new URL(event.url, "http://x").pathname.startsWith("/dashboard") ? null : event;
}

/** Vercel Web Analytics (visitors, pages, referrers) and Speed Insights (real-user Web Vitals). */
export default function Telemetry() {
  // The CV is the only `download` link on the site (footer, home, about, contact), so one
  // delegated listener covers every button without making those server components client ones.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[download]");
      if (link) track("cv_download", { page: location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Analytics beforeSend={(e: BeforeSendEvent) => skipDashboard(e)} />
      <SpeedInsights beforeSend={skipDashboard} />
    </>
  );
}
