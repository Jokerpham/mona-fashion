# MONA Fashion — NextJS E-commerce

Web bán hàng thời trang tái hiện giao diện MONA Fashion trong ảnh mẫu.

## Công nghệ
- Next.js 14 App Router + TypeScript
- Tailwind CSS
- React Context cho Giỏ hàng (thêm / xoá / tăng giảm, lưu localStorage)
- Dữ liệu mẫu trong `src/data/`

## Chạy dự án
```bash
npm install
npm run dev
# mở http://localhost:3000
```

## Cấu trúc
- `src/app/page.tsx` — Trang chủ (Hero, Promo, Best Sellers, Category, Blog)
- `src/app/shop/page.tsx` — Cửa hàng, lọc theo danh mục, tìm kiếm, sắp xếp giá
- `src/app/product/[slug]/page.tsx` — Chi tiết sản phẩm, chọn size, thêm giỏ
- `src/app/checkout/page.tsx` — Thanh toán / đặt hàng
- `src/app/blog/page.tsx`, `about`, `contact`
- `src/components/` — Header, Hero, ProductCard, CategoryGrid, BlogSection, Footer, CartDrawer
- `src/context/CartContext.tsx` — State giỏ hàng toàn cục
- `src/data/products.ts` / `posts.ts` — Dữ liệu sản phẩm & bài viết

## Tuỳ biến
- Đổi sản phẩm: sửa `src/data/products.ts` (tên, giá, sale, ảnh Unsplash)
- Đổi liên hệ ở Footer: `src/components/Footer.tsx`
- Đổi màu chủ đạo: `tailwind.config.ts` (beige / cream / ink)

## Cơ sở dữ liệu
Xem `DATABASE.md` — schema PostgreSQL/SQLite/Prisma, 12 bảng, đã có dữ liệu mẫu và file `database/sqlite/mona.db` chạy thử ngay.
