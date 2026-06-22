import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/seo-agency-in-:location",
        destination: "/locations/:location",
      },
    ];
  },
};

export default nextConfig;
