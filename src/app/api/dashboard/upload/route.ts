import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import sharp, { type OutputInfo } from "sharp";
import { isAuthenticated } from "@/lib/session";
import { saveUpload } from "@/lib/store";

const MAX_BYTES = 12 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

/**
 * Accepts an image (re-encoded to WebP, max 2400px wide) or a PDF and stores it
 * in MongoDB GridFS. SVG is rejected on purpose: it can carry scripts and would
 * be served from this origin.
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 12 MB" }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = randomBytes(10).toString("hex");

  try {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      if (bytes.subarray(0, 5).toString() !== "%PDF-") {
        return NextResponse.json({ error: "That doesn't look like a PDF" }, { status: 415 });
      }
      const name = `${id}.pdf`;
      await saveUpload(name, bytes, "application/pdf", file.name);
      return NextResponse.json({ src: `/media/${name}`, name: file.name });
    }

    if (!IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Use a PNG, JPG, WebP, GIF or AVIF image (or a PDF)" }, { status: 415 });
    }

    let image: { data: Buffer; info: OutputInfo };
    try {
      image = await sharp(bytes)
        .rotate()
        .resize({ width: 2400, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
    } catch {
      return NextResponse.json({ error: "Couldn't read that image" }, { status: 415 });
    }
    const name = `${id}.webp`;
    await saveUpload(name, image.data, "image/webp", file.name);
    return NextResponse.json({ src: `/media/${name}`, width: image.info.width, height: image.info.height });
  } catch (err) {
    console.error("[upload] Saving to MongoDB failed:", err);
    return NextResponse.json({ error: "Couldn't save the file — is the database reachable?" }, { status: 503 });
  }
}
