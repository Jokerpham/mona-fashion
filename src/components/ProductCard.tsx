"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

/* 3 icon tròn đen như ảnh mẫu: giỏ hàng / yêu thích / xem nhanh */
const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
    <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.2L20.5 7H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
    <path d="M12 20.7C6.4 17 3 13.6 3 9.9 3 7.2 5 5 7.7 5c1.7 0 3.3.9 4.3 2.3C13 5.9 14.6 5 16.3 5 19 5 21 7.2 21 9.9c0 3.7-3.4 7.1-9 10.8z" strokeLinejoin="round" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const circleBtn =
  "w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#1d1d1d] text-white grid place-items-center shadow-lg hover:bg-black hover:scale-110 active:scale-95 transition pointer-events-auto";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [touched, setTouched] = useState(false);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  // Desktop: hiện khi hover. Mobile/màn cảm ứng: chạm 1 lần vào ảnh để hiện 3 icon
  // (đồng thời luôn hiện sẵn trên màn nhỏ để dễ thấy), chạm vào icon mới thực hiện hành động.
  const overlayVisible = touched ? "opacity-100 translate-y-0" : "opacity-100 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-focus-within:opacity-100";

  return (
    <div className="group text-center">
      <div
        className="relative bg-[#f5f5f5] aspect-[4/5] overflow-hidden"
        onTouchStart={() => setTouched(true)}
      >
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-emerald-400 text-white text-[11px] px-2 py-1">
            -{discount}%
          </span>
        )}

        {/* 3 nút tròn đen ở đáy ảnh - đúng ảnh mẫu */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 transition-all duration-300 ${overlayVisible}`}
        >
          <button
            type="button"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            title="Thêm vào giỏ hàng"
            onClick={(e) => {
              e.preventDefault();
              add(product);
            }}
            className={circleBtn}
          >
            <CartIcon />
          </button>
          <button
            type="button"
            aria-label={liked ? `Bỏ yêu thích ${product.name}` : `Yêu thích ${product.name}`}
            aria-pressed={liked}
            title="Yêu thích"
            onClick={(e) => {
              e.preventDefault();
              setLiked((v) => !v);
            }}
            className={`${circleBtn} ${liked ? "text-red-400" : ""}`}
          >
            <HeartIcon filled={liked} />
          </button>
          <button
            type="button"
            aria-label={`Xem nhanh ${product.name}`}
            title="Xem nhanh"
            onClick={(e) => {
              e.preventDefault();
              setQuickView(true);
            }}
            className={circleBtn}
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="block mt-4 text-sm text-neutral-700 hover:text-black">
        {product.name}
      </Link>
      <p className="mt-1 text-[13px] font-semibold">
        {formatPrice(product.price)}
        {product.oldPrice && (
          <span className="line-through text-neutral-400 font-normal ml-1">{formatPrice(product.oldPrice)}</span>
        )}
      </p>

      {/* Popup Xem nhanh khi bấm icon con mắt */}
      {quickView && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={`Xem nhanh ${product.name}`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setQuickView(false)} />
          <div className="relative bg-white w-full max-w-2xl grid md:grid-cols-2 text-left shadow-2xl">
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[380px] bg-[#f5f5f5]">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="p-7">
              <button
                onClick={() => setQuickView(false)}
                aria-label="Đóng xem nhanh"
                className="absolute top-3 right-4 text-3xl leading-none text-neutral-500 hover:text-black"
              >
                ×
              </button>
              <p className="text-[11px] tracking-[0.3em] text-neutral-400 uppercase">{product.category}</p>
              <h3 className="text-2xl font-light mt-2">{product.name}</h3>
              <p className="text-lg font-semibold mt-3">
                {formatPrice(product.price)}
                {product.oldPrice && (
                  <span className="line-through text-neutral-400 text-sm font-normal ml-2">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mt-4">{product.description}</p>
              <p className="text-sm mt-5">
                Size: <span className="font-medium">{product.sizes.join(", ")}</span>
              </p>
              <button
                onClick={() => {
                  add(product);
                  setQuickView(false);
                }}
                className="w-full bg-[#171a21] text-white py-3.5 mt-6 text-sm tracking-[0.2em]"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
              <Link
                href={`/product/${product.slug}`}
                className="block text-center text-sm underline underline-offset-4 mt-4"
              >
                Xem chi tiết sản phẩm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
