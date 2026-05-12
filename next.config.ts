import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/nosmokingsamdeok",
  assetPrefix: "/nosmokingsamdeok/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
