import { ImageResponse } from "next/og";
import { getContent } from "@/lib/store";

/** Bodoni Moda subset for the monogram (same face as the navbar logo); falls back to the default font offline. */
async function loadFont(text: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@700&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

/** The navbar monogram (boxed initials) as a PNG, driven by the dashboard's "Monogram letters". */
export async function monogramIcon(px: number) {
  const { identity } = await getContent();
  const initials = (identity.initials || "SR").trim().slice(0, 3).toUpperCase();
  const font = await loadFont(initials);
  const border = Math.max(2, Math.round(px * 0.045));
  const inset = Math.round(px * 0.14);
  const fontSize = Math.round(px * (initials.length > 2 ? 0.3 : 0.38));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
        <div
          style={{
            width: `calc(100% - ${inset * 2}px)`,
            height: `calc(100% - ${inset * 2}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `${border}px solid #111111`,
            color: "#111111",
            fontSize,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            ...(font && { fontFamily: "Bodoni Moda" }),
          }}
        >
          {initials}
        </div>
      </div>
    ),
    { width: px, height: px, ...(font && { fonts: [{ name: "Bodoni Moda", data: font, weight: 700 as const, style: "normal" as const }] }) },
  );
}
