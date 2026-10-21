import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { getContent, saveContent } from "@/lib/store";

const MAX_BYTES = 4 * 1024 * 1024;

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getContent());
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await request.text();
  if (raw.length > MAX_BYTES) return NextResponse.json({ error: "Content is too large" }, { status: 413 });

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let saved;
  try {
    saved = await saveContent(data);
  } catch (err) {
    console.error("[content] Saving to MongoDB failed:", err);
    const missing = !process.env.MONGODB_URI;
    return NextResponse.json(
      { error: missing ? "MONGODB_URI isn't set on the server, so changes can't be saved." : "Couldn't reach the database. Your edits are still here — try again." },
      { status: 503 },
    );
  }
  // Every public page is static; mark them all to regenerate on their next visit.
  revalidatePath("/", "layout");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, content: saved, savedAt: new Date().toISOString() });
}
