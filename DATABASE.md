# Cơ sở dữ liệu MONA Fashion

CSDL được thiết kế đúng theo các tính năng đã có trên web. Có 3 cách dùng, chọn 1:

> Cập nhật 2026-10-25: web đã nối vào CSDL thật. App đang chạy thử bằng
> SQLite qua Prisma (`prisma/schema.prisma` dùng provider sqlite,
> `DATABASE_URL` trong `.env` trỏ tới `database/sqlite/mona.db`). Shop,
> Trang chủ và Admin đều đọc/ghi qua các API trong `src/app/api/`
> (sản phẩm, đơn hàng, tin nhắn, người đăng ký) — không còn lưu trong
> trình duyệt nữa. Khi lên Vercel / bán thật, chuyển schema Prisma về
> provider postgresql và đổi `DATABASE_URL` sang database ngoài.
> Nạp lại dữ liệu mẫu: tạo bảng bằng `prisma db push` rồi chạy
> `node prisma/seed.cjs` (tự đọc `DATABASE_URL` từ `.env`).

| Cách | File | Khi nào dùng |
|---|---|---|
| **PostgreSQL** (khuyên dùng khi bán thật) | `database/postgres/schema.sql` + `seed.sql` | Deploy Vercel / Supabase / VPS |
| **SQLite** (chạy thử ngay, không cần cài server) | `database/sqlite/mona.db` (đã tạo sẵn + đã có dữ liệu) | Mở xem/thử trên máy cá nhân |
| **Prisma ORM** (khi nối code NextJS vào DB) | `prisma/schema.prisma` | Lập trình API đọc/ghi DB |

## Sơ đồ bảng (12 bảng)

```
users ──< cart_items >── products ──< product_images
  │           │             │  └──────< product_sizes
  │           │             ├────────< wishlist_items >── users
  └──< orders ┘             └────────< order_items >── orders
categories ──< products
posts (tin tức) · contact_messages (form Liên hệ) · newsletter_subscribers (form Ưu đãi đặc biệt)
```

| Bảng | Nội dung | Quan hệ chính |
|---|---|---|
| `users` | Tài khoản (My Account): tên, email (duy nhất), mật khẩu đã băm scrypt, role customer/admin, sđt, địa chỉ | 1 user có nhiều đơn/giỏ/wishlist |
| `categories` | Danh mục shop: Accessories, Bags, Footwear, Man, Woman | 1 danh mục có nhiều sản phẩm |
| `products` | Sản phẩm: tên, slug, mô tả, giá (VNĐ), giá gốc khi sale, tag best/new/sale | Thuộc 1 `categories` |
| `product_images` | Ảnh của sản phẩm (URL, thứ tự) | Thuộc 1 `products`, xoá theo sản phẩm |
| `product_sizes` | Size + tồn kho từng size (khóa chính: product_id + size) | Thuộc 1 `products` |
| `cart_items` | Giỏ hàng: user đã đăng nhập **hoặc** `session_id` của khách vãng lai, size, số lượng | Trỏ tới `users` + `products`, không trùng (user, phiên, sản phẩm, size) |
| `wishlist_items` | Sản phẩm yêu thích (nút trái tim trên ảnh) | Khóa chính (user_id, product_id) |
| `orders` | Đơn hàng: mã đơn (vd MONA539976), người nhận, sđt, địa chỉ, thanh toán cod/bank/momo, trạng thái pending → confirmed → shipping → done/cancelled, tạm tính, phí ship, tổng | Thuộc 1 `users` (có thể NULL nếu khách vãng lai) |
| `order_items` | Từng dòng trong đơn: tên + giá **chụp lại lúc đặt** (đổi giá sau này không làm sai đơn cũ) | Thuộc 1 `orders` |
| `posts` | Bài tin tức/Blog: tiêu đề, slug, chuyên mục Fashion/Inspiration/Shopping/Lifestyle/Minimalism, tóm tắt, nội dung, ảnh | — |
| `contact_messages` | Tin nhắn từ form trang Liên hệ, cờ `is_read` | — |
| `newsletter_subscribers` | Email đăng ký ở banner "Ưu đãi đặc biệt / Nhận tư vấn miễn phí" | Email duy nhất |

Quy ước tiền: lưu số nguyên VNĐ (không lưu số thập phân). Miễn phí ship từ 500.000đ là logic ở tầng ứng dụng khi tính `shipping_fee` cho `orders`.

## Dữ liệu mẫu đã nạp sẵn

- 5 danh mục, **8 sản phẩm** (đúng tên/giá trên web hiện tại), 8 ảnh, 24 dòng size
- **8 bài viết** Blog
- 1 tài khoản demo để test đăng nhập: **demo@mona.local / demo123**
  (mật khẩu đã băm scrypt — hãy **xoá hoặc đổi** tài khoản này trước khi bán thật)

## Cách chạy

### SQLite (nhanh nhất)
File `database/sqlite/mona.db` mở bằng [DB Browser for SQLite](https://sqlitebrowser.org/) là xem/sửa được ngay.
Tạo lại từ đầu:
```bash
sqlite3 database/sqlite/mona.db < database/sqlite/schema.sql
sqlite3 database/sqlite/mona.db < database/sqlite/seed.sql
```

### PostgreSQL
```bash
createdb mona_fashion
psql mona_fashion -f database/postgres/schema.sql
psql mona_fashion -f database/postgres/seed.sql
```
Hoặc với Supabase / Vercel Postgres: dán lần lượt 2 file SQL vào SQL Editor và Run.

### Prisma (nối vào NextJS ở bước tiếp theo)
```bash
cp .env.example .env   # điền DATABASE_URL thật
npm i -D prisma && npm i @prisma/client
npx prisma migrate dev --name init
npx prisma studio      # mở giao diện xem dữ liệu
```

> Lưu ý: web hiện tại vẫn đang đọc dữ liệu mẫu từ `src/data/` và lưu giỏ/tài khoản
> trong trình duyệt. CSDL này là tầng dữ liệu hoàn chỉnh để bước tiếp theo nối API
> (đăng ký/đăng nhập, đặt hàng, quản trị sản phẩm) vào — khi bạn sẵn sàng mình sẽ nối luôn.
