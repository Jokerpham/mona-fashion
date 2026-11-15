"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { pushOrder, newId } from "@/lib/store";
export default function CheckoutPage(){
  const {items,total,clear}=useCart(); const [done,setDone]=useState(false);
  if(done) return <div className="container-x pt-16 pb-24 text-center"><h1 className="text-3xl font-light">Đặt hàng thành công 🎉</h1><p className="text-neutral-500 mt-4">Cảm ơn bạn đã mua sắm tại MONA Fashion. Đơn hàng sẽ được xác nhận qua email / điện thoại.</p></div>;
  return (<div className="container-x pt-12 pb-20 grid md:grid-cols-2 gap-12">
    <form onSubmit={async e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); try { await pushOrder({ id:newId("MONA"), date:new Date().toISOString(), customer:{ name:String(fd.get("name")||""), phone:String(fd.get("phone")||""), email:String(fd.get("email")||"")||undefined, address:String(fd.get("address")||"") }, items:items.map(i=>({name:i.product.name,size:i.size,qty:i.qty,price:i.product.price})), total, payment:String(fd.get("payment")||"COD"), status:"Chờ xác nhận" }); clear(); setDone(true); } catch { alert("Đặt hàng chưa lưu được, bạn kiểm tra lại rồi thử lại nhé."); }}} className="space-y-4">
      <h1 className="text-2xl font-light tracking-widest">THANH TOÁN</h1>
      <input name="name" required placeholder="Họ và tên" className="border w-full px-4 py-3" /><input name="phone" required placeholder="Số điện thoại" className="border w-full px-4 py-3" /><input name="email" type="email" placeholder="Email" className="border w-full px-4 py-3" /><input name="address" required placeholder="Địa chỉ giao hàng" className="border w-full px-4 py-3" />
      <select name="payment" className="border w-full px-4 py-3"><option>COD - Thanh toán khi nhận hàng</option><option>Chuyển khoản ngân hàng</option><option>Ví MoMo / ZaloPay</option></select>
      <button className="bg-[#23232c] text-white w-full py-4 tracking-widest text-sm font-heading">ĐẶT HÀNG</button>
    </form>
    <div><h2 className="font-semibold tracking-widest">ĐƠN HÀNG</h2>
      <div className="space-y-3 mt-5">{items.map((i,idx)=><div key={idx} className="flex justify-between text-sm"><span>{i.product.name} × {i.qty} ({i.size})</span><span>{formatPrice(i.product.price*i.qty)}</span></div>)}</div>
      <div className="border-t mt-6 pt-4 flex justify-between font-semibold"><span>Tổng cộng</span><span>{formatPrice(total)}</span></div>
    </div>
  </div>);
}
