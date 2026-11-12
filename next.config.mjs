import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cho phép next/image tải ảnh ngoài từ thoitrangbigsize.vn (sản phẩm
    // "Áo sơ mi nơ len" dùng link ảnh ngoài này; không có remotePatterns
    // thì ảnh bị vỡ trên shop dù admin vẫn hiện vì admin dùng <img> thường).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thoitrangbigsize.vn",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};
export default nextConfig;

// Chạy local (`npm run dev`): nạp các binding Cloudflare khai báo trong
// wrangler.toml — gồm database D1 "mona-fashion" (binding DB) — vào dev
// server dưới dạng D1 local (miniflare, dữ liệu lưu ở .wrangler/state).
// Nhờ vậy getRequestContext().env.DB có giá trị ngay cả khi chạy local,
// và các API route (Edge Runtime) dùng PrismaD1 y như trên Pages.
// Chỉ chạy ở development; lúc `next build` (NODE_ENV=production) thì bỏ qua.
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}
