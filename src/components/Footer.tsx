"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pushSubscriber } from "@/lib/store";

/* Icon đặc (solid) giống hệt bản gốc: ghim địa chỉ, phong bì, điện thoại */
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[19px] h-[19px] shrink-0 mt-[3px]" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[19px] h-[19px] shrink-0" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[19px] h-[19px] shrink-0" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  /* Nút về đầu trang nổi: luôn đi theo khi lướt lên/xuống, chỉ hiện khi đã
     lướt xuống khỏi đầu trang, bấm thì cuộn mượt về đầu. */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="font-sans">
      {/* ===== Banner Ưu đãi đặc biệt + đăng ký nhận tư vấn (đúng ảnh mẫu) ===== */}
      <section className="relative overflow-hidden bg-[#a9d3e0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/site/newsletter.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#9fd0e2]/60" />
        <div className="relative container-x text-center py-20 md:py-24">
          <p className="text-[22px] font-light text-neutral-800">Ưu đãi đặc biệt</p>
          <h2 className="mt-4 text-[30px] md:text-[40px] leading-snug font-bold text-neutral-900 max-w-4xl mx-auto">
            Nhận tư vấn miễn phí với các chuyên gia của MONA
          </h2>
          {subscribed ? (
            <p className="mt-9 inline-block bg-white px-6 py-4 text-[15px] font-medium text-emerald-700">
              Đăng ký thành công ✓ MONA sẽ liên hệ tư vấn qua email {email}
            </p>
          ) : (
            <form
              className="mt-9 flex justify-center"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await pushSubscriber(email.trim());
                  setSubscribed(true);
                } catch {
                  alert("Đăng ký chưa lưu được, bạn thử lại nhé.");
                }
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">Email của bạn</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sample@mail.com"
                className="w-[240px] md:w-[260px] bg-white px-4 py-3.5 text-[15px] placeholder:text-neutral-400 outline-none"
              />
              <button
                type="submit"
                className="bg-[#171a21] text-white px-7 md:px-9 text-[15px] font-semibold hover:bg-black transition"
              >
                Đăng ký
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ===== Footer chính 4 cột (cỡ chữ, khoảng cách, icon đúng ảnh mẫu) ===== */}
      <section className="container-x grid md:grid-cols-[1.3fr_1.05fr_1.05fr_1.4fr] gap-12 py-[60px]">
        <div>
          {/* Logo MONA FASHION: chữ MONA đậm giãn rộng, FASHION nhỏ giữa 2 vạch ngang */}
          <p className="leading-none text-black inline-block">
            <span className="block font-heading text-[30px] font-bold tracking-[0.28em] pl-[0.28em] text-center">MONA</span>
            <span className="mt-2 flex items-center gap-2.5">
              <span className="h-[2px] flex-1 bg-black" />
              <span className="text-[9px] font-semibold tracking-[0.5em] pl-[0.5em]">FASHION</span>
              <span className="h-[2px] flex-1 bg-black" />
            </span>
          </p>
          <p className="text-neutral-500 mt-7 leading-[1.9] text-[15px] max-w-[300px]">
            MONA là sự lựa chọn hoàn hảo cho Cửa hàng trực tuyến của bạn.
          </p>
          <p className="mt-7 flex items-center gap-6" aria-label="Mạng xã hội">
            <a href="#" aria-label="Facebook" className="opacity-90 hover:opacity-100 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/site/icons/facebook.svg" alt="Facebook" className="h-[17px] w-auto" />
            </a>
            <a href="#" aria-label="Twitter" className="opacity-90 hover:opacity-100 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/site/icons/twitter.svg" alt="Twitter" className="h-[17px] w-auto" />
            </a>
            <a href="#" aria-label="Tumblr" className="opacity-90 hover:opacity-100 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/site/icons/tumblr.svg" alt="Tumblr" className="h-[17px] w-auto" />
            </a>
          </p>
        </div>

        <nav aria-label="Về chúng tôi">
          <h4 className="text-[19px] font-semibold text-black mb-8">Về chúng tôi</h4>
          <ul className="space-y-6 text-[15px] text-neutral-600">
            <li><Link href="/blog" className="hover:text-black">Thông tin mới nhất</Link></li>
            <li><a href="#" className="hover:text-black">Giải đáp</a></li>
            <li><Link href="/contact" className="hover:text-black">Liên hệ</Link></li>
            <li><Link href="/shop" className="hover:text-black">Cửa hàng</Link></li>
            <li><Link href="/cuoi-tuan" className="hover:text-black">Cuối tuần này</Link></li>
          </ul>
        </nav>

        <nav aria-label="Cửa hàng">
          <h4 className="text-[19px] font-semibold text-black mb-8">Cửa hàng</h4>
          <ul className="space-y-6 text-[15px] text-neutral-600">
            <li><Link href="/shop" className="hover:text-black">Accessories</Link></li>
            <li><Link href="/shop" className="hover:text-black">Bags</Link></li>
            <li><Link href="/shop" className="hover:text-black">Footwear</Link></li>
            <li><Link href="/shop" className="hover:text-black">Man</Link></li>
            <li><Link href="/shop" className="hover:text-black">Woman</Link></li>
          </ul>
        </nav>

        <div>
          <h4 className="text-[19px] font-semibold text-black mb-8">Liên hệ</h4>
          <ul className="space-y-6 text-[15px] text-neutral-600">
            <li className="flex gap-3.5 text-[#2b2b2b]">
              <PinIcon />
              <span className="leading-[1.85] text-neutral-600">
                1073/23 Cách Mạng Tháng 8, P.7,<br />Q.Tân Bình, TP.HCM
              </span>
            </li>
            <li className="flex gap-3.5 items-center text-[#2b2b2b]">
              <MailIcon />
              <a href="mailto:info@themona.global" className="text-neutral-600 hover:text-black">info@themona.global</a>
            </li>
            <li className="flex gap-3.5 items-center text-[#2b2b2b]">
              <PhoneIcon />
              <a href="tel:0313728397" className="text-neutral-600 hover:text-black">0313728397</a>
            </li>
          </ul>
        </div>
      </section>

      {/* ===== Thanh bản quyền ===== */}
      <div className="relative bg-[#f1f1f1] text-center text-sm text-neutral-500 py-4 px-4">
        © Thiết kế website và lập trình bởi{" "}
        <span className="font-bold text-neutral-700">MONA</span>
        <span className="font-semibold text-[#8b2fe0]"> .Media / Website</span>
      </div>
      {/* Nút về đầu trang nổi: hình tròn trắng góc phải, đi theo khi lướt
          lên/xuống, chỉ hiện khi đã lướt xuống khỏi đầu trang. */}
      <button
        aria-label="Về đầu trang"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border-2 border-black bg-white text-black text-lg grid place-items-center hover:bg-black hover:text-white transition-all duration-300 ${showTop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        ↑
      </button>
    </footer>
  );
}
