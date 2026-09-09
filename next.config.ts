import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include .data/ directory in Vercel's serverless function bundles
  // so fs.readFileSync/existsSync can access seed data files at runtime.
  outputFileTracingIncludes: {
    "/api/**": ["./.data/**"],
  },

  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(Array.isArray(config.watchOptions?.ignored)
          ? config.watchOptions.ignored
          : []),
        "**/.data/**",
        "**/.git/**",
      ],
    };
    return config;
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
