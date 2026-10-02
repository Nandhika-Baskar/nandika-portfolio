import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are pre-optimised to WebP at fixed widths (see public/work) and served
  // with srcset, so the site needs no image runtime and can export statically.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
