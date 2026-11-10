"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const inputCls =
  "w-full bg-transparent border-b border-neutral-300 focus:border-black outline-none py-3 placeholder:text-neutral-500";
const labelCls = "block text-[15px] text-neutral-500 mb-1";

// Icon con mắt: mở khi đang hiện mật khẩu, gạch chéo khi đang ẩn
function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      )}
    </svg>
  );
}

export default function AccountPage() {
  const { user, login, register, logout } = useAuth();
  const { count, setOpen } = useCart();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // login form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // register form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // hiện/ẩn mật khẩu (nút con mắt)
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  if (user) {
    return (
      <div className="container-x py-14 max-w-3xl">
        <h1 className="text-4xl font-light">My Account</h1>
        <div className="mt-10 border p-8">
          <p className="text-lg">
            Xin chào, <span className="font-medium">{user.name}</span>
          </p>
          <p className="text-neutral-500 mt-2">{user.email}</p>
          <div className="grid sm:grid-cols-3 gap-4 mt-8 text-center text-sm">
            <Link href="/shop" className="border py-5 hover:bg-neutral-50">Đơn hàng của tôi</Link>
            <Link href="/checkout" className="border py-5 hover:bg-neutral-50">Thanh toán</Link>
            <Link href="/contact" className="border py-5 hover:bg-neutral-50">Hỗ trợ / Liên hệ</Link>
          </div>
          <button
            onClick={logout}
            className="mt-8 bg-[#171a21] text-white px-8 py-3.5 text-sm tracking-[0.2em]"
          >
            ĐĂNG XUẤT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white">
      {/* Thanh mục phía trên phần mở tài khoản (theo ảnh mẫu) */}
      <div className="bg-[#f2f2f2]">
        <div className="container-x flex flex-wrap items-center justify-center gap-6 sm:gap-14 lg:gap-20 py-7 text-[15px] sm:text-[17px]">
          <button onClick={() => setOpen(true)} className="flex items-center text-neutral-500 hover:text-black">
            Shopping Cart
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e8e8e8] px-1 text-[11px] text-neutral-500">
              {count}
            </span>
          </button>
          <Link href="#" className="text-neutral-500 hover:text-black">Wishlist</Link>
          <Link href="#" className="text-neutral-500 hover:text-black">Order Tracking</Link>
          <span className="text-black border-b-2 border-black pb-1">Login</span>
        </div>
      </div>
      <div className="container-x py-10">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-light">My Account</h1>
          <Link href="/" aria-label="Đóng" className="text-3xl leading-none text-neutral-700 hover:text-black">
            ×
          </Link>
        </div>

        {/* Tabs như ảnh mẫu */}
        <div className="flex justify-center gap-16 mt-6">
          <button
            onClick={() => { setTab("login"); setError(""); setNotice(""); }}
            className={
              tab === "login"
                ? "text-2xl font-medium border-b-2 border-black pb-1"
                : "text-2xl text-neutral-400 pb-1 hover:text-black"
            }
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); setNotice(""); }}
            className={
              tab === "register"
                ? "text-2xl font-medium border-b-2 border-black pb-1"
                : "text-2xl text-neutral-400 pb-1 hover:text-black"
            }
          >
            Đăng ký
          </button>
        </div>

        <div className="max-w-[500px] mx-auto mt-14 pb-16">
          {error && (
            <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</p>
          )}
          {notice && (
            <p className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 mb-6">{notice}</p>
          )}

          {tab === "login" ? (
            <form
              className="space-y-9"
              onSubmit={(e) => {
                e.preventDefault();
                const r = login(identifier.trim(), password, remember);
                if (!r.ok) setError(r.error || "Đăng nhập thất bại");
              }}
            >
              <div>
                <label htmlFor="login-id" className={labelCls}>
                  Tên tài khoản hoặc địa chỉ email <span className="text-red-500">*</span>
                </label>
                <input id="login-id" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="login-pass" className={labelCls}>
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input id="login-pass" type={showLoginPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-10`} />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass((v) => !v)}
                    aria-label={showLoginPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    title={showLoginPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-black"
                  >
                    <EyeIcon open={showLoginPass} />
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-3 text-neutral-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-6 h-6 accent-neutral-300"
                />
                Ghi nhớ mật khẩu
              </label>
              <button type="submit" className="w-full bg-[#171a21] text-white py-6 text-sm tracking-[0.2em] hover:bg-black transition">
                ĐĂNG NHẬP
              </button>
              <p className="text-center pt-2">
                <Link href="/forgot-password" className="text-sm tracking-widest underline underline-offset-8">
                  QUÊN MẬT KHẨU?
                </Link>
              </p>
            </form>
          ) : (
            <form
              className="space-y-9"
              onSubmit={(e) => {
                e.preventDefault();
                if (regPassword.length < 6) {
                  setError("Mật khẩu cần tối thiểu 6 ký tự.");
                  return;
                }
                const r = register(name.trim(), email.trim(), regPassword);
                if (!r.ok) setError(r.error || "Đăng ký thất bại");
                else setNotice("Tạo tài khoản thành công. Chào mừng bạn đến MONA Fashion!");
              }}
            >
              <div>
                <label htmlFor="reg-name" className={labelCls}>
                  Tên tài khoản <span className="text-red-500">*</span>
                </label>
                <input id="reg-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="reg-email" className={labelCls}>
                  Địa chỉ email <span className="text-red-500">*</span>
                </label>
                <input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="reg-pass" className={labelCls}>
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input id="reg-pass" type={showRegPass ? "text" : "password"} required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={`${inputCls} pr-10`} />
                  <button
                    type="button"
                    onClick={() => setShowRegPass((v) => !v)}
                    aria-label={showRegPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    title={showRegPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-black"
                  >
                    <EyeIcon open={showRegPass} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Dữ liệu cá nhân của bạn sẽ được dùng để hỗ trợ trải nghiệm mua sắm,
                quản lý tài khoản và cho các mục đích trong chính sách bảo mật của MONA.
              </p>
              <button type="submit" className="w-full bg-[#171a21] text-white py-6 text-sm tracking-[0.2em] hover:bg-black transition">
                ĐĂNG KÝ
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
