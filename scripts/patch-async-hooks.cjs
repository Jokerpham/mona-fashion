// Vá tạm output của `vercel build` trước khi @cloudflare/next-on-pages
// đóng gói worker.
//
// Vấn đề: Next 14 nhúng `@next/request-context` vào các function bundle
// với require("async_hooks") trần (không có tiền tố node:). Bản build
// worker của next-on-pages dùng esbuild với platform "neutral" và chỉ coi
// "node:*" là external, nên nó không phân giải được "async_hooks" trần và
// build lỗi (đã thử alias webpack trong next.config.mjs — không có tác
// dụng vì webpack externalize builtin trước khi áp alias).
//
// Cách vá: đổi require("async_hooks") -> require("node:async_hooks").
// "node:*" đã nằm trong danh sách external của next-on-pages nên esbuild
// giữ nguyên câu require, và workerd chạy được với cờ nodejs_compat
// (đã bật trong wrangler.toml). Chỉ sửa file .js/.cjs trong
// .vercel/output/functions (không đụng .map).
//
// Chạy: node scripts/patch-async-hooks.cjs  (sau `vercel build`,
// trước `npx @cloudflare/next-on-pages --skip-build`).
// Xem thêm: npm run pages:build
const fs = require("fs");
const path = require("path");

const FUNCTIONS_DIR = path.join(__dirname, "..", ".vercel", "output", "functions");
const PATTERNS = [
  [/require\("async_hooks"\)/g, 'require("node:async_hooks")'],
  [/require\('async_hooks'\)/g, "require('node:async_hooks')"],
];

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && (full.endsWith(".js") || full.endsWith(".cjs"))) out.push(full);
  }
  return out;
}

if (!fs.existsSync(FUNCTIONS_DIR)) {
  console.error(`[patch-async-hooks] Không thấy ${FUNCTIONS_DIR} — chạy 'vercel build' trước.`);
  process.exit(1);
}

let filesPatched = 0;
let totalReplacements = 0;
for (const file of walk(FUNCTIONS_DIR, [])) {
  const src = fs.readFileSync(file, "utf8");
  let next = src;
  let count = 0;
  for (const [re, replacement] of PATTERNS) {
    next = next.replace(re, (m) => {
      count += 1;
      return replacement;
    });
  }
  if (count > 0) {
    fs.writeFileSync(file, next);
    filesPatched += 1;
    totalReplacements += count;
    console.log(`[patch-async-hooks] ${path.relative(process.cwd(), file)}: ${count} chỗ`);
  }
}
console.log(`[patch-async-hooks] Xong: ${totalReplacements} chỗ trong ${filesPatched} file.`);
