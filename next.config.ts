import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // clear image caching for logo src issues
    unoptimized: true,
  },
};

export default nextConfig;
