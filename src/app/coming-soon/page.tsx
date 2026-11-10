"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* Trang "Coming soon" làm lại y hệt bản demo gốc (trendstore.monamedia.net/coming-soon):
   nửa trái là ảnh người mẫu váy lụa tím bên cửa sổ, nửa phải nền trắng gồm
   logo MONA FASHION, 2 dòng mô tả, đồng hồ đếm ngược Days/Hours/Mins/Sec,
   nút đen "Quay lại trang chủ" và hàng icon mạng xã hội.
   Trang hiển thị phủ toàn màn hình (không header/footer) như bản gốc.
   Muốn đồng hồ đếm ngược chạy thật: đặt ngày mở bán vào LAUNCH_DATE bên dưới,
   để null thì đồng hồ đứng ở 00 00 00 00 như bản gốc. */
const LAUNCH_DATE: string | null = null;

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

function useCountdown() {
  const [parts, setParts] = useState({ d: "00", h: "00", m: "00", s: "00" });
  useEffect(() => {
    if (!LAUNCH_DATE) return;
    const target = new Date(LAUNCH_DATE).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setParts({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return parts;
}

const socials = [
  { name: "Twitter", icon: "/images/site/icons/twitter.svg" },
  { name: "Facebook", icon: "/images/site/icons/facebook.svg" },
  { name: "Instagram", icon: "/images/site/icons/instagram.svg" },
  { name: "Pinterest", icon: "/images/site/icons/pinterest.svg" },
  { name: "Dribbble", icon: "/images/site/icons/dribbble.svg" },
];

export default function ComingSoonPage() {
  const { d, h, m, s } = useCountdown();
  const units = [
    { value: d, label: "Days" },
    { value: h, label: "Hours" },
    { value: m, label: "Mins" },
    { value: s, label: "Sec" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="grid md:grid-cols-2 min-h-full">
        {/* ===== Nửa trái: ảnh người mẫu ===== */}
        <div className="relative min-h-[46vh] md:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/site/coming-soon.jpg"
            alt="Coming soon - MONA Fashion"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>

        {/* ===== Nửa phải: nội dung ===== */}
        <div className="flex flex-col items-center justify-center text-center px-6 py-14 md:py-10">
          {/* Logo MONA FASHION */}
          <Link href="/" className="leading-none text-neutral-900">
            <span className="block font-heading text-4xl md:text-[42px] font-bold tracking-[0.28em] pl-[0.28em]">MONA</span>
            <span className="mt-2 flex items-center gap-3">
              <span className="h-px w-10 bg-neutral-900" />
              <span className="text-[11px] font-medium tracking-[0.55em] pl-[0.55em]">FASHION</span>
              <span className="h-px w-10 bg-neutral-900" />
            </span>
          </Link>

          <p className="mt-10 text-[#7c7c80] leading-relaxed">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <br />
            Ut enim ad minim veniam quis
          </p>

          {/* Đếm ngược */}
          <div className="mt-12 flex items-start justify-center gap-8 md:gap-12">
            {units.map((u) => (
              <div key={u.label}>
                <p className="font-heading text-6xl md:text-7xl font-extralight text-neutral-900 tabular-nums">{u.value}</p>
                <p className="mt-3 text-sm text-neutral-500">{u.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="mt-12 bg-[#262626] text-white text-[15px] px-9 py-4 hover:bg-black transition"
          >
            Quay lại trang chủ
          </Link>

          {/* Mạng xã hội */}
          <div className="mt-14 flex items-center gap-7">
            {socials.map((s) => (
              <a key={s.name} href="#" aria-label={s.name} className="opacity-40 hover:opacity-80 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.icon} alt={s.name} className="h-[18px] w-auto" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
