"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PHRASE = "Mua 1 tặng 1";

// Typewriter effect for "Mua 1 tặng 1" — matches the original site's animation
export default function PromoBanner(){
  const [shown, setShown] = useState("");
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } });
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let hold: ReturnType<typeof setTimeout> | undefined;
    const typeOnce = () => {
      let i = 0;
      setShown("");
      timer = setInterval(() => {
        i += 1;
        setShown(PHRASE.slice(0, i));
        if (i >= PHRASE.length) {
          if (timer) clearInterval(timer);
          hold = setTimeout(typeOnce, 3500); // pause on the full phrase, then retype
        }
      }, 130);
    };
    typeOnce();
    return () => { if (timer) clearInterval(timer); if (hold) clearTimeout(hold); };
  }, [inView]);

  return (<section ref={sectionRef} className="relative h-80 md:h-[420px] overflow-hidden">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/images/site/banner-promo.jpg" alt="Mua 1 tặng 1" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
      <p className="text-white tracking-[0.3em] text-[11px] md:text-sm">CHỈ TRONG THÁNG NÀY</p>
      <h2 className="mt-4 flex flex-wrap items-center justify-center gap-3 font-heading">
        <span className="text-white font-extrabold text-4xl md:text-6xl">HOT !!!</span>
        <span className="bg-white text-[#252a3a] italic font-bold text-3xl md:text-5xl px-3 py-1">{shown}<span className="animate-pulse font-normal not-italic">|</span></span>
      </h2>
      <Link href="/shop" className="mt-7 bg-white text-neutral-900 px-9 py-3.5 text-[11px] tracking-[0.25em] hover:bg-black hover:text-white transition">XEM NGAY</Link>
    </div>
  </section>);
}
