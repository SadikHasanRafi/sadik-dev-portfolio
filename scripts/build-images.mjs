// Builds the default images (WebP), the link-preview card and the touch icon.
// next/image resizes them on request; uploads from the dashboard skip this script.
// Run from the project root: npm run images
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "design/stitch_backend_developer_portfolio_website";
const OUT = "public/images";

await mkdir(OUT, { recursive: true });

const sources = {
  portrait: `${SRC}/Monochrome Portrait with Lavender Blob.png`,
  desk: `${SRC}/Minimalist Motivational Desk Vignette.png`,
};

for (const [name, file] of Object.entries(sources)) {
  const info = await sharp(file).webp({ quality: 80, effort: 6 }).toFile(`${OUT}/${name}.webp`);
  console.log(name, info.width, info.height, (info.size / 1024).toFixed(1) + "KB");
}

// Open Graph card: portrait on the right, editorial title on the left.
const portrait = await sharp(sources.portrait).resize({ height: 590 }).toBuffer();
const title = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F7F7F7"/>
  <rect x="64" y="64" width="44" height="44" fill="none" stroke="#111111" stroke-width="2"/>
  <text x="86" y="95" font-family="Georgia, serif" font-size="22" font-weight="700" fill="#111111" text-anchor="middle">SR</text>
  <text x="64" y="250" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="3.5" fill="#5B3FA8">SADIK HASAN RAFI — BACKEND DEVELOPER</text>
  <text x="64" y="320" font-family="Georgia, serif" font-size="50" fill="#111111">Building Backends</text>
  <text x="64" y="382" font-family="Georgia, serif" font-size="50" fill="#111111">That Quietly Power</text>
  <text x="64" y="444" font-family="Georgia, serif" font-size="50" font-style="italic" fill="#5B3FA8">Real Businesses.</text>
  <rect x="64" y="490" width="48" height="2" fill="#111111"/>
</svg>`);
await sharp(title)
  .composite([{ input: portrait, left: 1200 - 632, top: 40 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${OUT}/og.jpg`);

// Apple touch icon from the monogram.
const icon = Buffer.from(`
<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#111111"/>
  <rect x="24" y="24" width="132" height="132" fill="none" stroke="#FAFAFA" stroke-width="3"/>
  <text x="90" y="112" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#FAFAFA" text-anchor="middle">SR</text>
</svg>`);
await sharp(icon).png().toFile("public/apple-touch-icon.png");
console.log("og + apple icon done");
