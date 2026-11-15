"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  { img: "/images/site/slide-1.jpg", title: "Bộ sưu tập “Mùa xuân”" },
  { img: "/images/site/slide-3.jpg", title: "Hè năng động" },
  { img: "/images/site/slide-5.jpg", title: "Ấm ấp Thu / Đông" },
];
const AUTOPLAY_MS = 4000; // tự chuyển ảnh sau mỗi 4 giây

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (i: number) => setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length),
    []
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Tự động chạy slider, dừng khi rê chuột vào
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, index]);

  return (
    <section
      className="relative overflow-hidden bg-beige"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Banner trang chủ"
    >
      <div className="relative h-[480px] md:h-[640px]">
        {/* Lớp phủ tối mờ dần ở mép trên — giúp chữ menu trắng trên header trong suốt luôn nổi rõ trên ảnh */}
        <div className="absolute inset-x-0 top-0 h-44 z-[15] pointer-events-none bg-gradient-to-b from-black/35 via-black/12 to-transparent" />
        {SLIDES.map((s, i) => (
          <div
            key={s.img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image src={s.img} alt={s.title} fill className="object-cover object-top" priority={i === 0} />
          </div>
        ))}

        {/* Ô chữ góc trái dưới — chữ đổi theo từng ảnh */}
        <div className="absolute inset-x-0 bottom-14 md:bottom-16 z-20">
          <div className="container-x">
            <div className="bg-[#f3efe9]/80 backdrop-blur-[2px] p-6 md:p-9 max-w-[300px] md:max-w-sm shadow-sm">
              <div key={index} className="animate-[heroFade_.6s_ease]">
                <p className="font-display text-[11px] md:text-xs tracking-[0.3em] uppercase text-ink">Mona Fashion</p>
                <h1 className="font-display text-[26px] md:text-4xl font-light mt-2 leading-snug text-ink">{SLIDES[index].title}</h1>
                <Link
                  href="/shop"
                  className="inline-block mt-5 bg-white text-ink font-display text-[11px] md:text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-ink hover:text-white transition-colors"
                >
                  Đến cửa hàng
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Chấm tròn phân trang */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.img}
              onClick={() => go(i)}
              aria-label={`Ảnh ${i + 1}: ${s.title}`}
              className={`rounded-full transition-all duration-300 ${
                i === index ? "w-7 h-2.5 bg-ink" : "w-2.5 h-2.5 bg-ink/35 hover:bg-ink/60"
              }`}
            />
          ))}
        </div>

        {/* Nút Prev / Next góc phải dưới (giống trang mẫu) */}
        <div className="absolute bottom-0 right-0 z-20 flex bg-[#f3efe9]/85 backdrop-blur-[2px]">
          <button onClick={prev} aria-label="Ảnh trước" className="px-4 md:px-5 py-3 md:py-3.5 text-2xl leading-none text-ink/70 hover:text-ink transition-colors">
            &#8249;
          </button>
          <button onClick={next} aria-label="Ảnh tiếp theo" className="px-4 md:px-5 py-3 md:py-3.5 text-2xl leading-none text-ink/70 hover:text-ink transition-colors">
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
