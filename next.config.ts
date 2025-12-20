import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  assetPrefix: '/wp-content/themes/hello-elementor-child/assets/out',
  // Không dùng basePath vì homepage render ở root domain, chỉ assets cần prefix
  images: {
    unoptimized: true, // Cần thiết cho static export
  },
  trailingSlash: true, // Tạo index.html trong mỗi thư mục
};

export default nextConfig;
