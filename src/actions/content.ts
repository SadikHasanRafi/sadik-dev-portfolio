"use server";

import { revalidatePath } from "next/cache";
import { log } from "@/lib/log";
import { isAuthenticated } from "@/lib/session";
import { saveContent } from "@/lib/store";
import type { SiteContent } from "@/types";

const MAX_BYTES = 4 * 1024 * 1024;

export type SaveContentResult =
  | { ok: true; content: SiteContent; savedAt: string }
  | { ok: false; error: string; unauthorized?: boolean };

/** Validates and saves the dashboard's content, then regenerates the static public pages. */
export async function saveSiteContent(data: unknown): Promise<SaveContentResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, unauthorized: true, error: "Your session expired — open the dashboard again from the Let’s Talk popup." };
  }
  if (JSON.stringify(data ?? null).length > MAX_BYTES) return { ok: false, error: "Content is too large" };

  let saved: SiteContent;
  try {
    saved = await saveContent(data);
  } catch (err) {
    log.error("content", "Saving to MongoDB failed", err);
    return {
      ok: false,
      error: process.env.MONGODB_URI
        ? "Couldn't reach the database. Your edits are still here — try again."
        : "MONGODB_URI isn't set on the server, so changes can't be saved.",
    };
  }
  // Every public page is static; mark them all to regenerate on their next visit.
  revalidatePath("/", "layout");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
  log.info("content", "Site content saved");
  return { ok: true, content: saved, savedAt: new Date().toISOString() };
}
