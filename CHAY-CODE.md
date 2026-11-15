# Cách tải và chạy web MONA Fashion trên máy của bạn (Windows)

## Cách nhanh nhất — nhấp đúp 1 file
1. Tải file `mona-fashion-nextjs.zip` mình gửi trong chat, **giải nén** ra một thư mục (vd: Desktop).
2. Mở thư mục đã giải nén, nhấp đúp vào file **`chay-web.bat`**.
3. File này tự kiểm tra Node.js, tự cài thư viện (lần đầu hơi lâu), tự chạy web và mở trình duyệt vào **http://localhost:3000**.
4. Muốn tắt web: quay lại cửa sổ đen đang chạy, bấm **Ctrl + C**.

> Nếu máy chưa có Node.js, cửa sổ sẽ báo và dừng lại — bạn cài Node.js trước theo Bước 1 bên dưới rồi nhấp đúp lại file .bat.

## Cách thủ công bằng VS Code (4 bước)

**Bước 1 — Cài Node.js (chỉ làm 1 lần)**
- Vào https://nodejs.org → tải bản **LTS** → cài như phần mềm bình thường (cứ Next → Finish).
- Kiểm tra: mở Command Prompt, gõ `node -v` — hiện số phiên bản (vd v20.x / v22.x) là được.

**Bước 2 — Giải nén code**
- Nhấp phải vào file zip → *Extract All* → được thư mục `mona-fashion-nextjs`.

**Bước 3 — Mở thư mục bằng VS Code**
- Mở VS Code → *File → Open Folder* → chọn thư mục `mona-fashion-nextjs`.
- Mở Terminal trong VS Code: menu *Terminal → New Terminal* (hoặc phím tắt Ctrl + `).

**Bước 4 — Chạy 2 lệnh này (gõ từng lệnh, Enter, chờ chạy xong)**
```bash
npm install
npm run dev
```
Thấy dòng `Ready` / `Local: http://localhost:3000` là xong — mở trình duyệt vào **http://localhost:3000**.

## Các trang để kiểm tra
| Trang | Địa chỉ |
|---|---|
| Trang chủ | http://localhost:3000 |
| Cửa hàng | http://localhost:3000/shop |
| Sản phẩm (ví dụ) | http://localhost:3000/product/azure-tote |
| Tin tức / Blog | http://localhost:3000/blog |
| Liên hệ | http://localhost:3000/contact |
| Tài khoản (Đăng nhập/Đăng ký) | http://localhost:3000/account |
| Thanh toán | thêm sản phẩm vào giỏ rồi bấm Thanh toán |

## Xem cơ sở dữ liệu
- Cài **DB Browser for SQLite** (https://sqlitebrowser.org), mở file `database/sqlite/mona.db` trong thư mục code là xem được 12 bảng và dữ liệu mẫu.
- Tài khoản test trên web: tự Đăng ký tại `/account`, hoặc dùng giao diện DB để xem user demo `demo@mona.local`.

## Lỗi thường gặp
- **'npm' is not recognized** → chưa cài Node.js, hoặc cài xong chưa mở lại Terminal. Cài Node.js rồi đóng/mở lại VS Code.
- **Port 3000 is in use** → web đang chạy ở cửa sổ khác, tắt cửa sổ đó đi, hoặc chạy `npm run dev -- -p 3001` và vào cổng 3001.
- **Trang trắng / lỗi đỏ khi chạy `npm install`** → chụp màn hình lỗi gửi lại cho mình, mình xem và sửa giúp.
- Muốn chạy bản "thật" (nhanh hơn bản dev): `npm run build` rồi `npm start`, vẫn vào http://localhost:3000.

## Không muốn chạy trên máy mình?
Nhắn mình chữ **"deploy"** — mình hướng dẫn đưa web lên Vercel để có 1 đường link công khai, mở ở đâu cũng xem được, không cần cài gì trên máy.
