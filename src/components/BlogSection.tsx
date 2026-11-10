"use client";
import { useState } from "react";
import { posts } from "@/data/posts";
import CollectionsSection from "@/components/CollectionsSection";
const cats=["Tất cả","Fashion","Inspiration","Shopping"];
const tickerItems=[
  {title:"Friday Finest The Best of The Week",image:"/images/posts/post-1.jpg"},
  {title:"5 Fashion Labels on the Rise this Summer",image:"/images/posts/post-2.jpg"},
  {title:"A Guide To The Best Accessories For Fall",image:"/images/posts/post-3.jpg"},
  {title:"The Best Street Style From Brooklyn's 2016",image:"/images/posts/post-4.jpg"},
  {title:"A Minimalist Coat is A Must For Fall",image:"/images/posts/post-5.jpg"},
  {title:"Best Dressed: The Week in Outfits",image:"/images/posts/post-6.jpg"},
  {title:"Breaking Down The Fall 2016 Collections",image:"/images/posts/post-8.jpg"},
  {title:"How To Wear Dresses Over Pants",image:"/images/posts/post-7.jpg"},
  {title:"2017 Fashion Trends for Jewelry",image:"/images/posts/post-9.jpg"},
];
export default function BlogSection(){
  const [cat,setCat]=useState("Tất cả");
  const [off,setOff]=useState(7);
  const [showMore,setShowMore]=useState(false);
  const toggleMore=()=>{ const next=!showMore; setShowMore(next); if(next) setTimeout(()=>document.getElementById("collections")?.scrollIntoView({behavior:"smooth",block:"start"}),60); };
  const shownTicker=[0,1,2,3].map(k=>tickerItems[(off+k)%tickerItems.length]);
  const list = cat==="Tất cả"?posts:posts.filter(p=>p.category===cat);
  return (<section className="bg-[#f7f7f7] py-16"><div className="container-x">
    <div className="bg-white border border-neutral-200 flex items-stretch h-[68px] overflow-hidden">
      <div className="shrink-0 bg-[#1e2333] text-white flex items-center pl-6 pr-12 text-[15px] font-medium" style={{clipPath:"polygon(0 0, 84% 0, 100% 100%, 0 100%)"}}>Nổi bật</div>
      <div className="flex-1 flex items-center overflow-hidden px-2">{shownTicker.map((t,i)=>(<div key={i} className="flex items-center gap-3 px-3 min-w-0 flex-1">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={t.image} alt="" className="w-[84px] h-[46px] object-cover shrink-0" /><span className="truncate text-[15px] text-neutral-600">{t.title}</span></div>))}</div>
      <div className="flex flex-col shrink-0 w-9">
        <button aria-label="Tin trước" onClick={()=>setOff((off+tickerItems.length-1)%tickerItems.length)} className="flex-1 bg-[#1e2333] text-white grid place-items-center hover:bg-black text-lg leading-none border-b border-white/20">‹</button>
        <button aria-label="Tin tiếp" onClick={()=>setOff((off+1)%tickerItems.length)} className="flex-1 bg-[#1e2333] text-white grid place-items-center hover:bg-black text-lg leading-none">›</button>
      </div>
    </div>
    <div className="flex justify-center gap-3 mt-8 flex-wrap">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={cat===c?"bg-black text-white px-4 py-1.5 text-sm":"px-4 py-1.5 text-sm text-neutral-500"}>{c}</button>)}</div>
    <div className="grid md:grid-cols-3 gap-6 mt-8">{(list.length?list:posts).slice(0,6).map(p=>(<article key={p.id} className="bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
      <div className="p-5"><h3 className="font-semibold text-[13px] tracking-wide leading-snug">{p.title}</h3><p className="text-[10px] tracking-[0.25em] text-neutral-400 mt-4 uppercase">{p.category}</p><p className="text-sm text-neutral-500 mt-2 line-clamp-2">{p.excerpt}</p><span className="text-[11px] tracking-widest mt-4 inline-block">↗ XEM NGAY</span></div>
    </article>))}</div>
    <div className="text-center mt-10"><button onClick={toggleMore} className="bg-neutral-900 text-white px-8 py-3 text-xs tracking-[0.2em] hover:bg-black">{showMore?"THU GỌN":"XEM THÊM"}</button></div>
    {showMore && <CollectionsSection />}
  </div></section>);
}
