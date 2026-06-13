import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for slim production Docker images.
  output: "standalone",
};

export default nextConfig;
