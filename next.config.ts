import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nosmocking",
  assetPrefix: "/nosmocking/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
