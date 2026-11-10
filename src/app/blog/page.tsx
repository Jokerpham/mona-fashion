"use client";
import { useState } from "react";
import { posts } from "@/data/posts";

// Đúng thứ tự trong ảnh mẫu: All Blog Posts / Inspiration / Shopping / Fashion / Lifestyle / Minimalism
const categories = ["All Blog Posts", "Inspiration", "Shopping", "Fashion", "Lifestyle", "Minimalism"];

export default function BlogPage() {
  const [cat, setCat] = useState("All Blog Posts");
  const list = cat === "All Blog Posts" ? posts : posts.filter((p) => p.category === cat);

  return (
    <div className="bg-white">
      {/* ===== Hero Blog giống y hệt ảnh mẫu =====
          Ảnh nền xám, người mẫu quay lưng áo len xám, chữ "Blog" trắng mảnh ở giữa,
          hàng chuyên mục nằm ở đáy hero, mục đang chọn gạch chân trắng. */}
      <section className="relative h-[480px] md:h-[560px] overflow-hidden bg-[#d9d9d9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/site/blog-hero.jpg"
          alt="Blog - MONA Fashion"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/10" />

        <h1 className="absolute inset-0 grid place-items-center text-white text-7xl md:text-8xl font-light tracking-wide pointer-events-none">
          Blog
        </h1>

        <nav
          aria-label="Chuyên mục tin tức"
          className="absolute bottom-8 inset-x-0 flex flex-wrap justify-center gap-x-10 gap-y-3 px-4"
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={
                cat === c
                  ? "text-white text-[17px] font-light border-b-2 border-white pb-1.5"
                  : "text-white/85 text-[17px] font-light pb-1.5 hover:text-white"
              }
            >
              {c}
            </button>
          ))}
        </nav>
      </section>

      {/* ===== Lưới bài viết theo chuyên mục đang chọn ===== */}
      <section className="container-x py-14 pb-20">
        {list.length === 0 ? (
          <p className="text-center text-neutral-500">Chưa có bài viết trong chuyên mục này.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {list.map((p) => (
              <article key={p.id} className="bg-[#f7f7f7] group cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-56 object-cover group-hover:opacity-90 transition"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-sm leading-snug">{p.title}</h3>
                  <p className="text-[11px] tracking-[0.25em] text-neutral-400 mt-3 uppercase">{p.category}</p>
                  <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{p.excerpt}</p>
                  <span className="text-[11px] tracking-widest mt-4 inline-block">↗ XEM NGAY</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
