"use client";
import { useState } from "react";
import { useProducts } from "@/lib/store";
import ProductCard from "./ProductCard";
const tabs=[{id:"best",label:"Best Sellers"},{id:"new",label:"New Products"},{id:"sale",label:"Sales Products"}] as const;
const PAGE_SIZE = 8;
export default function ProductSection(){
  const { products } = useProducts();
  const [tab,setTab]=useState<string>("best");
  const [page,setPage]=useState(0);
  /* Mỗi tab hiện đúng sản phẩm của tab đó: Best = tất cả, New/Sale = chỉ
     sản phẩm gắn thẻ đó. (Trước đây New/Sale ít hơn 4 cái thì tự nhảy về
     hiện tất cả nên bấm tab không đổi gì.) */
  const shown = tab==="best" ? products : products.filter(p=>p.tag===tab);
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = shown.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const changeTab = (id: string) => { setTab(id); setPage(0); };
  return (<section className="container-x py-16">
    <div className="flex justify-center gap-3 text-sm">
      {tabs.map(t=><button key={t.id} onClick={()=>changeTab(t.id)} className={tab===t.id?"bg-white text-black border border-neutral-300 shadow-sm rounded-full px-5 py-2 transition-all":"text-neutral-400 hover:text-black px-5 py-2 transition-colors"}>{t.label}</button>)}
    </div>
    {pageItems.length === 0 ? (
      <p className="text-center text-neutral-500 text-sm mt-10">Chưa có sản phẩm nào trong mục này.</p>
    ) : (
      <div key={`${tab}-${safePage}`} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10 animate-fadeUp">{pageItems.map(p=><ProductCard key={p.id} product={p} />)}</div>
    )}
    {pageCount > 1 && (
      <div className="flex flex-col items-center gap-3 mt-10">
        <p className="text-sm text-neutral-500">Trang {safePage + 1}/{pageCount}</p>
        <button onClick={() => setPage(safePage < pageCount - 1 ? safePage + 1 : 0)} className="border border-black px-8 py-3 text-sm tracking-[0.2em] hover:bg-black hover:text-white transition-colors">
          {safePage < pageCount - 1 ? "XEM THÊM" : "← VỀ TRANG ĐẦU"}
        </button>
      </div>
    )}
  </section>);
}
