import type { Instrumentation } from "next";
import { registerOTel } from "@vercel/otel";
import { log } from "@/lib/log";

/** Sends traces (routes, fetches, MongoDB-adjacent spans) to Vercel Observability. */
export function register() {
  registerOTel({ serviceName: "sadik-portfolio" });
}

/** Every server error (render, route handler, server action, proxy) becomes one searchable log line. */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const digest = typeof err === "object" && err !== null && "digest" in err ? String(err.digest) : undefined;
  log.error("request", "Unhandled server error", err, {
    digest,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
    revalidateReason: context.revalidateReason,
  });
};
