"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** The private dashboard is never reported, so the numbers only describe real visitors. */
function skipDashboard<T extends { url: string }>(event: T): T | null {
  return new URL(event.url, "http://x").pathname.startsWith("/dashboard") ? null : event;
}

/** Vercel Web Analytics (visitors, pages, referrers) and Speed Insights (real-user Web Vitals). */
export default function Telemetry() {
  return (
    <>
      <Analytics beforeSend={(e: BeforeSendEvent) => skipDashboard(e)} />
      <SpeedInsights beforeSend={skipDashboard} />
    </>
  );
}
