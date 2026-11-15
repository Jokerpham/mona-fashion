"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container-x py-14 max-w-[500px]">
      <h1 className="text-4xl font-light text-center">Quên mật khẩu?</h1>
      {sent ? (
        <div className="mt-10 bg-emerald-50 border border-emerald-200 p-6 text-center">
          <p className="text-emerald-700 font-medium">Đã ghi nhận yêu cầu ✓</p>
          <p className="text-sm text-neutral-500 mt-2">
            Nếu email tồn tại trong hệ thống, link đặt lại mật khẩu sẽ được gửi tới email của bạn.
          </p>
          <Link href="/account" className="inline-block underline mt-5 text-sm">Quay lại Đăng nhập</Link>
        </div>
      ) : (
        <form
          className="mt-10 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <p className="text-neutral-500 text-sm leading-relaxed">
            Nhập địa chỉ email bạn đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.
          </p>
          <div>
            <label htmlFor="fp-email" className="block text-[15px] text-neutral-500 mb-1">
              Địa chỉ email <span className="text-red-500">*</span>
            </label>
            <input
              id="fp-email"
              type="email"
              required
              className="w-full bg-transparent border-b border-neutral-300 focus:border-black outline-none py-3"
            />
          </div>
          <button className="w-full bg-[#171a21] text-white py-5 text-sm tracking-[0.2em]">
            GỬI LINK ĐẶT LẠI MẬT KHẨU
          </button>
          <p className="text-center">
            <Link href="/account" className="text-sm underline underline-offset-4">Quay lại Đăng nhập</Link>
          </p>
        </form>
      )}
    </div>
  );
}
