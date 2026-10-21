import { readUpload } from "@/lib/store";

/** Serves dashboard uploads from GridFS. Names are random and never reused, so they cache forever. */
export async function GET(_request: Request, { params }: RouteContext<"/media/[file]">) {
  const { file } = await params;
  if (!/^[a-f0-9]{20}\.(webp|pdf)$/.test(file)) return new Response("Not found", { status: 404 });

  try {
    const upload = await readUpload(file);
    if (!upload) return new Response("Not found", { status: 404 });
    return new Response(upload.stream, {
      headers: {
        "Content-Type": upload.contentType,
        "Content-Length": String(upload.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[media] Reading from MongoDB failed:", err);
    return new Response("Temporarily unavailable", { status: 503 });
  }
}
