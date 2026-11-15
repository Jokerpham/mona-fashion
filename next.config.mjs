import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages + @cloudflare/next-on-pages KHÔNG chạy được trình tối
  // ưu ảnh `/_next/image` của Next.js (trả 404), nên toàn bộ ảnh dùng
  // next/image (slide hero, ảnh sản phẩm) đều vỡ trên link thật, trong khi
  // ảnh <img> thường vẫn hiện. Bật unoptimized để next/image xuất thẳng
  // đường dẫn file tĩnh trong public/ (vd /images/site/slide-1.jpg), ảnh
  // vẫn hiện bình thường, chỉ không resize tự động.
  images: { unoptimized: true },
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
