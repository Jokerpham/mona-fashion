import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { D1Database } from "@cloudflare/workers-types";

// Client Prisma dùng chung cho cả app (tránh tạo nhiều kết nối khi dev reload).
// Chạy `npx prisma generate` sau khi cài đặt để sinh client đúng theo schema.
//
// Web chỉ chạy với database D1 (SQLite) qua adapter PrismaD1 — vì mọi API
// route đều chạy Edge Runtime (Cloudflare Pages yêu cầu vậy), mà Prisma
// Client thường (không adapter) KHÔNG chạy được trên Edge Runtime.
//
// D1 binding DB lấy từ request context, có giá trị ở cả hai chỗ:
//  - Trên Cloudflare Pages: binding DB thật, khai báo trong wrangler.toml
//    (database D1 "mona-fashion").
//  - Chạy local (`npm run dev`): D1 local (miniflare) do setupDevPlatform()
//    trong next.config.mjs nạp từ wrangler.toml — dữ liệu lưu ở
//    .wrangler/state, seed bằng file mona-fashion-d1-v2.sql (xem README).
//
// DATABASE_URL trong .env CHỈ còn dùng cho lệnh Prisma CLI (db push,
// generate, seed) với file SQLite local — code web lúc chạy KHÔNG đọc
// DATABASE_URL nữa. Vì vậy đừng đổi DATABASE_URL để đổi database của web;
// muốn đổi dữ liệu local thì seed lại D1 local (xem README).
//
// LƯU Ý: file này được nhúng vào các route chạy Edge Runtime — không dùng
// `import path from "path"` hay bất kỳ module Node nào khác ở đây, vì
// webpack của Edge không phân giải được chúng.

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Cache ở cấp module: trên Pages, binding D1 của worker là cố định nên
// dùng chung một client cho mọi request; local dev thì dùng chung client
// D1 local (tránh mở nhiều kết nối khi reload).
let cachedClient: PrismaClient | undefined;

function buildClient(): PrismaClient {
  const log: ("error" | "warn")[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
  // Lấy D1 binding từ request context. Ngoài Pages runtime và ngoài dev
  // server có setupDevPlatform (next.config.mjs), lệnh này ném lỗi.
  try {
    const env = getRequestContext().env as unknown as { DB?: D1Database };
    if (env.DB) {
      return new PrismaClient({ adapter: new PrismaD1(env.DB), log });
    }
  } catch {
    // Rơi xuống lỗi rõ ràng bên dưới (thay vì client thường, vốn không
    // chạy được trên Edge Runtime).
  }
  throw new Error(
    "Không lấy được database D1 (binding DB). " +
      "Khi chạy local, hãy chạy `npm run dev` (next.config.mjs tự nạp D1 local qua setupDevPlatform). " +
      "Khi chạy trên Cloudflare Pages, hãy gắn binding D1 DB cho project (xem wrangler.toml)."
  );
}

function getClient(): PrismaClient {
  if (cachedClient) return cachedClient;
  if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
    cachedClient = globalForPrisma.prisma;
    return cachedClient;
  }
  const client = buildClient();
  cachedClient = client;
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

/* Lazy: KHÔNG khởi tạo PrismaClient ngay lúc import file, vì client chưa
   sinh ra (chưa chạy prisma generate) sẽ ném lỗi ngay khi new — làm hỏng
   cả bước build của Next. Dùng Proxy để client chỉ được tạo ra khi API
   thật sự gọi tới nó lúc chạy web, khi đó generate đã chạy xong rồi. */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient() as any;
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
