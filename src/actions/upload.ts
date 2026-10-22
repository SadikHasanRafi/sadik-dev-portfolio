"use server";

import { randomBytes } from "node:crypto";
import sharp, { type OutputInfo } from "sharp";
import { log } from "@/lib/log";
import { isAuthenticated } from "@/lib/session";
import { saveUpload } from "@/lib/store";

const MAX_BYTES = 12 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

export type UploadResult =
  | { ok: true; src: string; width?: number; height?: number; name?: string }
  | { ok: false; error: string };

/**
 * Accepts an image (re-encoded to WebP, max 2400px wide) or a PDF and stores it
 * in Vercel Blob (GridFS when no Blob token is configured). SVG is rejected on purpose: it can carry scripts and would
 * be served from this origin.
 */
export async function uploadFile(form: FormData): Promise<UploadResult> {
  if (!(await isAuthenticated())) return { ok: false, error: "Unauthorized" };

  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file received" };
  if (file.size > MAX_BYTES) return { ok: false, error: "File is larger than 12 MB" };

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = randomBytes(10).toString("hex");

  try {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      if (bytes.subarray(0, 5).toString() !== "%PDF-") return { ok: false, error: "That doesn't look like a PDF" };
      const name = `${id}.pdf`;
      const src = await saveUpload(name, bytes, "application/pdf", file.name);
      log.info("upload", "PDF uploaded", { src, bytes: bytes.length });
      return { ok: true, src, name: file.name };
    }

    if (!IMAGE_TYPES.includes(file.type)) return { ok: false, error: "Use a PNG, JPG, WebP, GIF or AVIF image (or a PDF)" };

    let image: { data: Buffer; info: OutputInfo };
    try {
      image = await sharp(bytes)
        .rotate()
        .resize({ width: 2400, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
    } catch {
      return { ok: false, error: "Couldn't read that image" };
    }
    const name = `${id}.webp`;
    const src = await saveUpload(name, image.data, "image/webp", file.name);
    log.info("upload", "Image uploaded", { src, bytesIn: bytes.length, bytesOut: image.data.length });
    return { ok: true, src, width: image.info.width, height: image.info.height };
  } catch (err) {
    log.error("upload", "Saving the upload failed", err, { name: file.name, size: file.size });
    return { ok: false, error: "Couldn't save the file — check the Blob store / database connection." };
  }
}
