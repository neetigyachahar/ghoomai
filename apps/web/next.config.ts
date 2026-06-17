import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@repo/ui", "@repo/widgets", "@repo/hooks", "@repo/types"],
};

export default nextConfig;
