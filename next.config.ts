import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public pages are statically generated and regenerated when the dashboard saves.
  trailingSlash: true,
  // `next dev` only trusts localhost by default; also allow the loopback IP.
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    // Dashboard saves (up to 4 MB of content) and uploads (up to 12 MB) go through server actions.
    serverActions: { bodySizeLimit: "13mb" },
  },
  images: {
    // Bundled images + dashboard uploads from before the move to Blob (served by app/media/[file]).
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/media/**", search: "" },
    ],
    // Images uploaded from the dashboard live in Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" }],
    deviceSizes: [640, 960, 1280, 1600, 2048],
    imageSizes: [240, 320, 480],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
