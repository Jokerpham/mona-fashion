"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";

const label = "block text-sm mb-1";
const field = "border w-full px-3 py-2.5 outline-none focus:border-black";

// Icon con mắt: mở khi đang hiện mật khẩu, gạch chéo khi đang ẩn
// (cùng mẫu với trang /account).
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

export default function AdminForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (next.length < 6) {
      setError("Mật khẩu mới cần tối thiểu 6 ký tự.");
      return;
    }
    if (next !== confirm) {
      setError("Mật khẩu nhập lại chưa khớp với mật khẩu mới.");
      return;
    }
    const r = resetPassword(email.trim(), next);
    if (!r.ok) {
      setError(r.error || "Đặt lại mật khẩu thất bại.");
      return;
    }
    logActivity(email.trim(), "Đặt lại mật khẩu", `Đặt lại mật khẩu quản trị cho ${email.trim()}.`);
    setNotice("Đặt lại mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.");
    setEmail("");
    setNext("");
    setConfirm("");
  };

  return (
    <div className="min-h-screen bg-[#171a21] flex items-center justify-center px-4">
      <form onSubmit={submit} className="bg-white w-full max-w-sm p-8 shadow-xl">
        <p className="text-center text-2xl tracking-[0.35em] font-light">MONA</p>
        <p className="text-center text-[10px] tracking-[0.5em] mt-1 text-neutral-500">FASHION — QUẢN TRỊ</p>
        <h1 className="text-lg font-medium mt-8 mb-4">Quên mật khẩu quản trị</h1>
        {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 mb-4">{error}</p>}
        {notice && <p className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 py-2 mb-4">{notice}</p>}
        <label htmlFor="fp-email" className={label}>Email quản trị</label>
        <input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mona.local" className={`${field} mb-4`} />
        <label htmlFor="fp-new" className={label}>Mật khẩu mới <span className="text-red-500">*</span></label>
        <div className="relative mb-4">
          <input id="fp-new" type={showNext ? "text" : "password"} required value={next} onChange={(e) => setNext(e.target.value)} className={`${field} pr-10`} />
          <button
            type="button"
            onClick={() => setShowNext((v) => !v)}
            aria-label={showNext ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            title={showNext ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-black"
          >
            <EyeIcon open={showNext} />
          </button>
        </div>
        <label htmlFor="fp-confirm" className={label}>Nhập lại mật khẩu mới <span className="text-red-500">*</span></label>
        <div className="relative mb-6">
          <input id="fp-confirm" type={showConfirm ? "text" : "password"} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`${field} pr-10`} />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            title={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-black"
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        <button className="bg-black font-heading text-white w-full py-3 tracking-[0.2em] text-sm hover:bg-neutral-800 transition-colors">ĐẶT LẠI MẬT KHẨU</button>
        <p className="text-xs text-neutral-500 mt-5 leading-relaxed">
          Bản demo chưa gửi email xác minh, nên đặt lại mật khẩu chỉ cần đúng email quản trị.
          Trước khi bán thật cần thay bằng hệ thống tài khoản thật có xác minh email.
        </p>
        <Link href="/admin" className="block text-center text-sm underline mt-5">← Về trang đăng nhập</Link>
      </form>
    </div>
  );
}
