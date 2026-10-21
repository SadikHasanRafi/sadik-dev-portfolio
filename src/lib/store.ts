import { Readable } from "node:stream";
import { cache } from "react";
import { defaultContent } from "@/content/defaults";
import { mergeWithDefaults } from "@/lib/merge";
import { db, isMongoConfigured, uploadsBucket } from "@/lib/mongo";
import type { SiteContent } from "@/types";

/**
 * MongoDB-backed content store.
 *  - `site_content`    one document ({ _id: "site" }) with everything the dashboard edits
 *  - `content_history` a snapshot per save (newest 30 kept) for recovery
 *  - GridFS `uploads`  images and PDFs uploaded from the dashboard
 */
const CONTENT_ID = "site";
const HISTORY_LIMIT = 30;

let warned = false;
/**
 * Last content read from (or written to) MongoDB, used if the database is briefly
 * unreachable. Kept on globalThis because API routes and pages get separate
 * copies of this module.
 */
const memory = globalThis as unknown as { __lastGoodContent?: SiteContent };

type ContentDoc = { _id: string; data: unknown; updatedAt: Date; revision: number };
type HistoryDoc = { data: unknown; savedAt: Date; revision: number };

/** Current site content (saved edits over defaults). Cached per request. */
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!isMongoConfigured()) {
    if (!warned) console.warn("[store] MONGODB_URI is not set — rendering default content.");
    warned = true;
    return defaultContent;
  }
  try {
    const doc = await (await db()).collection<ContentDoc>("site_content").findOne({ _id: CONTENT_ID });
    memory.__lastGoodContent = mergeWithDefaults(defaultContent, doc?.data ?? null);
    return memory.__lastGoodContent;
  } catch (err) {
    // During `next build` without database access, pre-render the defaults.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.error("[store] Could not reach MongoDB during build, using defaults:", err);
      return defaultContent;
    }
    // At runtime, render the last content this server saw; with none, fail the
    // render so Next keeps serving the previously generated page where it can.
    if (memory.__lastGoodContent) {
      console.error("[store] MongoDB unreachable, serving the last known content:", err);
      return memory.__lastGoodContent;
    }
    throw err;
  }
});

/** Validates against the defaults' shape, saves, and records a history snapshot. */
export async function saveContent(input: unknown): Promise<SiteContent> {
  const next = mergeWithDefaults(defaultContent, input);
  const database = await db();
  const now = new Date();

  const saved = await database
    .collection<ContentDoc>("site_content")
    .findOneAndUpdate(
      { _id: CONTENT_ID },
      { $set: { data: next, updatedAt: now }, $inc: { revision: 1 } },
      { upsert: true, returnDocument: "after", projection: { revision: 1 } },
    );

  const history = database.collection<HistoryDoc>("content_history");
  await history.insertOne({ data: next, savedAt: now, revision: saved?.revision ?? 0 });
  const stale = await history.find({}, { projection: { _id: 1 } }).sort({ savedAt: -1 }).skip(HISTORY_LIMIT).toArray();
  if (stale.length) await history.deleteMany({ _id: { $in: stale.map((d) => d._id) } });

  memory.__lastGoodContent = next;
  return next;
}

/** Stores an uploaded file in GridFS under `filename`. */
export async function saveUpload(filename: string, bytes: Buffer, contentType: string, originalName: string) {
  const bucket = await uploadsBucket();
  await new Promise<void>((resolve, reject) => {
    Readable.from(bytes)
      .pipe(bucket.openUploadStream(filename, { metadata: { contentType, originalName } }))
      .on("finish", () => resolve())
      .on("error", reject);
  });
}

/** Looks up an upload and returns a web stream of its bytes, or null if missing. */
export async function readUpload(filename: string) {
  const bucket = await uploadsBucket();
  const file = await bucket.find({ filename }).limit(1).next();
  if (!file) return null;
  const stream = Readable.toWeb(bucket.openDownloadStream(file._id)) as ReadableStream<Uint8Array>;
  return { stream, length: file.length, contentType: String(file.metadata?.contentType ?? "application/octet-stream") };
}
