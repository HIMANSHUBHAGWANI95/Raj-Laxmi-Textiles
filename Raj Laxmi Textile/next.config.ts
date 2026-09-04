import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project sits inside a directory that has its own lockfile higher up,
  // so pin the tracing root to the app itself.
  outputFileTracingRoot: path.join(__dirname),

  async redirects() {
    return [
      // The catalogue moved when the site went faceted.
      { source: "/products", destination: "/collections", permanent: true },
    ];
  },
};

export default nextConfig;
