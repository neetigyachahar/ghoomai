import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/widgets", "@repo/hooks"],
};

export default nextConfig;
