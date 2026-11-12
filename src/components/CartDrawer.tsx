"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
export default function CartDrawer(){
  const {items,isOpen,setOpen,remove,changeQty,total}=useCart();
  if(!isOpen) return null;
  return (<div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
    <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
      <div className="flex justify-between items-center"><h2 className="font-semibold tracking-widest">GIỎ HÀNG</h2><button onClick={()=>setOpen(false)} className="text-2xl">×</button></div>
      {items.length===0 ? <p className="text-neutral-500 mt-8">Giỏ hàng đang trống.</p> : <>
        <div className="space-y-5 mt-6">{items.map((i,idx)=>(<div key={idx} className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={i.product.image} alt={i.product.name} className="w-20 h-24 object-cover bg-neutral-100" />
          <div className="flex-1"><p className="text-sm font-medium">{i.product.name}</p><p className="text-xs text-neutral-500 mt-1">Size: {i.size}</p>
          <div className="flex items-center gap-3 mt-2"><button onClick={()=>changeQty(i.product.slug,i.size,-1)} className="border px-2">-</button><span>{i.qty}</span><button onClick={()=>changeQty(i.product.slug,i.size,1)} className="border px-2">+</button></div>
          <p className="text-sm font-semibold mt-2">{formatPrice(i.product.price*i.qty)}</p></div>
          <button onClick={()=>remove(i.product.slug,i.size)} className="text-neutral-400">×</button>
        </div>))}</div>
        <div className="border-t mt-8 pt-4 flex justify-between font-semibold"><span>Tổng cộng</span><span>{formatPrice(total)}</span></div>
        <Link href="/checkout" onClick={()=>setOpen(false)} className="block text-center bg-black font-heading text-white py-3 mt-5 tracking-widest text-sm">THANH TOÁN</Link>
      </>}
    </aside>
  </div>);
}
