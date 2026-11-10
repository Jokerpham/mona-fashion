"use client";
import { useState } from "react";
import { useProducts } from "@/lib/store";
import ProductCard from "./ProductCard";
const tabs=[{id:"best",label:"Best Sellers"},{id:"new",label:"New Products"},{id:"sale",label:"Sales Products"}] as const;
export default function ProductSection(){
  const { products } = useProducts();
  const [tab,setTab]=useState<string>("best");
  const list = tab==="best" ? products : products.filter(p=>p.tag===tab);
  const shown = list.length>=4 ? list : products;
  return (<section className="container-x py-16">
    <div className="flex justify-center gap-10 text-sm text-neutral-500">
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={tab===t.id?"text-black border-b-2 border-black pb-2":"pb-2 hover:text-black"}>{t.label}</button>)}
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">{shown.slice(0,8).map(p=><ProductCard key={p.id} product={p} />)}</div>
  </section>);
}
