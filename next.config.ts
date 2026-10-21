import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public pages are statically generated and regenerated when the dashboard saves.
  trailingSlash: true,
  // `next dev` only trusts localhost by default; also allow the loopback IP.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // Bundled images + dashboard uploads (served by app/media/[file]).
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/media/**", search: "" },
    ],
    deviceSizes: [640, 960, 1280, 1600, 2048],
    imageSizes: [240, 320, 480],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
