"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* Trang "Về chúng tôi" làm lại toàn bộ giống bản demo gốc (trendstore.monamedia.net/ve-chung-toi):
   hero ảnh cửa hàng + tiêu đề mảnh, câu chuyện thương hiệu + chữ ký MONA,
   đội ngũ 4 người trên nền xanh nhạt, Dịch vụ dạng carousel chấm tròn,
   banner "Phong cách" và mục "Hợp tác" với 5 logo đối tác. Toàn bộ ảnh là ảnh gốc của web mẫu. */

const team = [
  { name: "Nguyễn Thi Ngân", role: "CO-FOUNDER", img: "/images/about/about_image-4.jpg" },
  { name: "Nguyễn Văn Sâm", role: "PHOTOGRAPHY", img: "/images/about/about_image-3.jpg" },
  { name: "Đặng Mỹ Linh", role: "DESIGNER", img: "/images/about/about_image-5.jpg" },
  { name: "Mona", role: "CO-FOUNDER", img: "/images/about/about_image-6.jpg" },
];

const services = [
  { title: "Free Shipping", icon: "/images/about/icon-rocket.svg", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { title: "24/7 Support", icon: "/images/about/icon-social.svg", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae." },
  { title: "Payment Process", icon: "/images/about/icon-partnership.svg", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem." },
  { title: "Service Chair", icon: "/images/about/icon-chair.svg", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { title: "Clickbank", icon: "/images/about/icon-tap.svg", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae." },
  { title: "Presentation", icon: "/images/about/icon-presentation.svg", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem." },
  { title: "Law Advise", icon: "/images/about/icon-law.svg", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae." },
  { title: "Store Locations", icon: "/images/about/icon-location.svg", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
];

const PER_VIEW = 3;
const PAGES = Math.ceil(services.length / PER_VIEW);

export default function AboutPage() {
  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPage((p) => (p + 1) % PAGES), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-white">
      {/* ===== Hero: ảnh cửa hàng, chữ "Về chúng tôi" trắng mảnh ở đáy ===== */}
      <section className="relative h-[440px] md:h-[560px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about/about_image-2.jpg" alt="Về chúng tôi - MONA Fashion" className="absolute inset-0 w-full h-full object-cover object-center" />
        <h1 className="absolute inset-x-0 bottom-10 md:bottom-14 text-center text-white text-6xl md:text-7xl font-light tracking-wide drop-shadow-sm">
          Về chúng tôi
        </h1>
      </section>

      {/* ===== Câu chuyện thương hiệu ===== */}
      <section className="container-x py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/about/about_image-1.jpg" alt="Câu chuyện MONA Fashion" className="w-full h-auto object-cover" />
          <div>
            <h2 className="text-xl md:text-2xl font-medium text-neutral-900 leading-snug">
              The story of 4 Jahreszeiten began in 1985 with a small store located in Vienna, Austria and with one clear mission: to celebrate and empower women through exquisite clothing and refined accessories.
            </h2>
            <p className="mt-6 text-[#7c7c80] leading-[2.14]">
              Today, we praise you for the exciting journey of trust and style. By closely listening and embracing your desires, it is a pleasure to invite you to your new online shopping destination.
            </p>
            <p className="mt-5 text-[#7c7c80] leading-[2.14]">
              We proudly dedicate ourselves to shaping the world in which every woman feels the comfort and inspiration needed to develop and express her personal sense of style. Clothes and accessories are extensions that color the day of modern women. For this reason, partners with esteemed brands, such as Max Mara, Marina Rinaldi, Laurèl, Liu Jo, Coccinelle, Fabiana Filippi, Faliero Sarti and many more, who set high standards in crafting unique designs, using premium fabrics.
            </p>
            <div className="mt-10 text-right">
              <span className="inline-block font-heading italic font-semibold text-3xl tracking-wide text-neutral-900 -rotate-2">
                MONA
                <svg viewBox="0 0 120 12" className="w-full h-3 mt-0.5" aria-hidden="true">
                  <path d="M3 8 C 35 3, 80 3, 117 6" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Đội ngũ ===== */}
      <section className="bg-gradient-to-b from-[#e9f5fb] via-[#eef7fc] to-white">
        <div className="container-x py-16 md:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.name} className="w-full aspect-[3/4] object-cover object-top" />
                <div className="relative -mt-12 mx-3 md:mx-4 bg-white text-center px-2 py-5 shadow-[0_2px_18px_rgba(0,0,0,0.06)]">
                  <p className="font-heading font-semibold text-neutral-900 text-base md:text-lg leading-tight">{m.name}</p>
                  <p className="mt-1.5 text-[10px] md:text-[11px] tracking-[0.18em] text-neutral-500 uppercase">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Dịch vụ (carousel) ===== */}
      <section className="container-x py-16 md:py-24">
        <h2 className="text-center text-3xl md:text-4xl font-normal text-neutral-900">Dịch vụ</h2>
        <div className="mt-14 overflow-hidden">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${page * 100}%)` }}>
            {Array.from({ length: PAGES }).map((_, pi) => (
              <div key={pi} className="w-full shrink-0 grid sm:grid-cols-3 gap-10 px-1">
                {services.slice(pi * PER_VIEW, pi * PER_VIEW + PER_VIEW).map((s) => (
                  <div key={s.title} className="text-center px-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt={s.title} className="h-14 w-14 mx-auto" />
                    <h3 className="mt-6 text-lg font-medium text-neutral-900">{s.title}</h3>
                    <p className="mt-4 text-sm text-[#7c7c80] leading-[2]">{s.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex items-center justify-center gap-2.5">
          {Array.from({ length: PAGES }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Dịch vụ trang ${i + 1}`}
              className={i === page ? "h-[2px] w-8 bg-neutral-800 transition-all" : "h-[2px] w-4 bg-neutral-300 transition-all"}
            />
          ))}
        </div>
      </section>

      {/* ===== Banner Phong cách ===== */}
      <section className="relative h-[380px] md:h-[420px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/posts/post-5.jpg" alt="Phong cách MONA" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/90 text-lg md:text-xl font-light">Phong cách</p>
          <h2 className="mt-3 text-white text-3xl md:text-5xl font-semibold leading-tight max-w-4xl">
            Tìm sự bình yên và hạnh phúc nội tâm của bạn
          </h2>
          <Link href="/shop" className="mt-8 bg-white text-neutral-900 text-xs md:text-sm tracking-[0.2em] font-medium px-10 py-3.5 hover:bg-neutral-100 transition">
            CỬA HÀNG
          </Link>
        </div>
      </section>

      {/* ===== Hợp tác ===== */}
      <section className="container-x py-16 md:py-24">
        <h2 className="text-center text-3xl md:text-4xl font-normal text-neutral-900">Hợp tác</h2>
        <div className="mt-12 flex flex-wrap items-stretch justify-center gap-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="border border-neutral-200 w-[240px] h-[110px] grid place-items-center bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/about/brand-${n}.jpg`} alt={`Đối tác ${n}`} className="max-h-[64px] max-w-[180px] object-contain" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
