import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  assetPrefix: '/wp-content/themes/hello-elementor-child/assets/out',
  basePath: '/wp-content/themes/hello-elementor-child/assets/out',
  images: {
    unoptimized: true, // Cần thiết cho static export
  },
  trailingSlash: true, // Tạo index.html trong mỗi thư mục
};

export default nextConfig;
