import type { NextConfig } from "next";

// 部署到根站点：https://username.github.io/（专用 Pages 仓库 <username>.github.io）
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
