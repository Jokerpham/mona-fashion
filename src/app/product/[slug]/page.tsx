"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useProducts } from "@/lib/store";
import { useCoupons, applicableCoupons } from "@/lib/coupons";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export const runtime = "edge"; // Cloudflare Pages yêu cầu route động chạy Edge Runtime.

export default function ProductPage({ params }: { params: { slug: string } }){
  const { products } = useProducts();
  const product = products.find(p=>p.slug===params.slug);
  const [qty,setQty]=useState(1);
  const [liked,setLiked]=useState(false);
  const [added,setAdded]=useState<{slug:string;qty:number}|null>(null);
  const {add,setOpen}=useCart();
  const { coupons } = useCoupons();
  const [copied, setCopied] = useState("");
  const codes = product ? applicableCoupons(coupons, product) : [];
  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).then(() => { setCopied(code); setTimeout(() => setCopied(""), 2000); }).catch(() => {});
  };
  if(!product) return notFound();
  const related = products.filter(p=>p.id!==product.id).slice(0,4);
  return (<div className="container-x pt-12 pb-20">
    {added && added.slug===product.slug && (<div className="bg-[#f7f6f7] px-6 py-5 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <button onClick={()=>setOpen(true)} className="bg-[#23232c] text-white px-8 py-4 text-sm">Xem giỏ hàng</button>
      <p className="text-neutral-700">{added.qty} × “{product.name}” đã được thêm vào giỏ hàng.</p>
    </div>)}
    <div className="grid md:grid-cols-2 gap-10">
      <div className="relative aspect-[4/5] bg-neutral-100"><Image src={product.image} alt={product.name} fill className="object-cover" /></div>
      <div className="text-center">
        <h1 className="text-4xl font-light">{product.name}</h1>
        <p className="text-neutral-500 leading-relaxed mt-6">{product.description}</p>
        <div className="mt-6">
          <p className="text-amber-500 tracking-[0.3em] text-lg">★★★★★</p>
          <p className="text-neutral-500 text-sm mt-2">(5 đánh giá của khách hàng)</p>
        </div>
        <p className="text-3xl font-medium mt-8">{formatPrice(product.price)} {product.oldPrice && <span className="line-through text-neutral-400 text-xl font-normal ml-2">{formatPrice(product.oldPrice)}</span>}</p>
        <div className="flex items-center justify-center gap-3 mt-10 font-heading">
          <div className="flex items-center border border-neutral-300 text-[#7C7C80]">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-4 py-4" aria-label="Giảm số lượng">−</button>
            <span className="px-3 text-sm font-medium">{qty}</span>
            <button onClick={()=>setQty(q=>q+1)} className="px-4 py-4" aria-label="Tăng số lượng">+</button>
          </div>
          <button onClick={()=>{add(product,product.sizes[0]||"Free",qty,false); setAdded({slug:product.slug,qty}); window.scrollTo({top:0,behavior:"smooth"});}} className="bg-[#23232c] text-white px-8 py-4 text-sm flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
              <path d="M5 8h14l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8z" strokeLinejoin="round" />
              <path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" strokeLinecap="round" />
            </svg>
            Thêm vào giỏ hàng
          </button>
          <button onClick={()=>setLiked(v=>!v)} aria-label={liked ? "Bỏ yêu thích" : "Thêm vào yêu thích"} aria-pressed={liked} title="Yêu thích" className={`border border-neutral-300 w-[52px] h-[52px] grid place-items-center ${liked ? "text-red-500" : "text-neutral-500"}`}>
            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
              <path d="M12 20.7C6.4 17 3 13.6 3 9.9 3 7.2 5 5 7.7 5c1.7 0 3.3.9 4.3 2.3C13 5.9 14.6 5 16.3 5 19 5 21 7.2 21 9.9c0 3.7-3.4 7.1-9 10.8z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="border-t border-neutral-200 mt-12 pt-6 text-sm">
          <span className="text-neutral-500">DANH MỤC: </span><span className="font-medium text-black">{product.category.toUpperCase()}</span>
        </div>
        {codes.length > 0 && (
          <div className="border border-amber-200 bg-amber-50 mt-6 p-5 text-left">
            <p className="font-medium text-sm">Mã giảm giá áp dụng cho sản phẩm này</p>
            <ul className="mt-3 space-y-2">
              {codes.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 text-sm">
                  <span><span className="font-mono bg-white border px-2 py-0.5">{c.code}</span> <span className="text-neutral-600">−{c.percent}%</span></span>
                  <button onClick={() => copyCode(c.code)} className="border bg-white px-3 py-1.5 text-xs hover:border-black">{copied === c.code ? "Đã sao chép ✓" : "Sao chép mã"}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="border-t border-neutral-200 mt-6 pt-6 flex justify-center gap-12 text-xs tracking-[0.2em] text-neutral-500">
          <a href="#" className="hover:text-black">FACEBOOK</a>
          <a href="#" className="hover:text-black">TWITTER</a>
          <a href="#" className="hover:text-black">PINTEREST</a>
        </div>
      </div>
    </div>
    <h2 className="text-xl tracking-widest mt-20 mb-8 text-center">SẢN PHẨM LIÊN QUAN</h2>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{related.map(p=><ProductCard key={p.id} product={p} />)}</div>
  </div>);
}
