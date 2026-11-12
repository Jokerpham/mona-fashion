"use client";
import { useEffect, useRef, useState } from "react";
import { useProducts } from "@/lib/store";
import ProductCard from "./ProductCard";
const tabs=[{id:"best",label:"Best Sellers"},{id:"new",label:"New Products"},{id:"sale",label:"Sales Products"}] as const;
const PAGE_SIZE = 8;
export default function ProductSection(){
  const { products } = useProducts();
  const [tab,setTab]=useState<string>("best");
  const [page,setPage]=useState(0);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });

  /* Đo vị trí nút tab đang active để đặt khung trắng chạy theo nó. */
  const movePill = () => {
    const el = tabRefs.current[tab];
    if (!el) return;
    setPill({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight, ready: true });
  };
  /* Chạy lại mỗi khi đổi tab (khung trượt sang tab mới). */
  useEffect(movePill, [tab]);
  /* Chạy lại lúc mở trang, khi đổi cỡ màn hình và khi font tải xong (chữ đổi
     rộng thì vị trí tab đổi theo). */
  useEffect(() => {
    movePill();
    window.addEventListener("resize", movePill);
    if (document.fonts) document.fonts.ready.then(movePill).catch(() => {});
    return () => window.removeEventListener("resize", movePill);
  }, []);

  /* Mỗi tab hiện đúng sản phẩm của tab đó: Best = tất cả, New/Sale = chỉ
     sản phẩm gắn thẻ đó. (Trước đây New/Sale ít hơn 4 cái thì tự nhảy về
     hiện tất cả nên bấm tab không đổi gì.) */
  const shown = tab==="best" ? products : products.filter(p=>p.tag===tab);
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = shown.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const changeTab = (id: string) => { setTab(id); setPage(0); };
  return (<section className="container-x py-16">
    {/* Thanh tab dính trên cùng khi cuộn (sticky, top 0, z 100), nền trắng mờ
        để chữ vẫn đọc được khi sản phẩm trôi qua bên dưới. */}
    <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur py-3 shadow-sm">
      <div className="relative flex justify-center gap-3 text-sm">
        {/* Khung trắng chạy theo tab đang active: trượt mượt 300ms. */}
        <span
          aria-hidden
          className={`absolute rounded-full bg-white border border-neutral-300 shadow-sm pointer-events-none transition-all duration-300 ease ${pill.ready ? "opacity-100" : "opacity-0"}`}
          style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }}
        />
        {tabs.map(t=><button key={t.id} ref={(el)=>{ tabRefs.current[t.id]=el; }} onClick={()=>changeTab(t.id)} className={`relative z-10 px-5 py-2 transition-colors ${tab===t.id?"text-black":"text-neutral-400 hover:text-black"}`}>{t.label}</button>)}
      </div>
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
