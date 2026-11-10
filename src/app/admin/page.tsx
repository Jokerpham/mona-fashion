"use client";
import Link from "next/link";
import { useOrders, useProducts, useMessages, useSubscribers } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";
import { canAccessSection, canDeleteOrder } from "@/lib/roles";
import { formatPrice } from "@/lib/format";

export default function AdminDashboard() {
  const { orders, deleteOrder } = useOrders();
  const { products } = useProducts();
  const { messages } = useMessages();
  const { subscribers } = useSubscribers();
  const { user } = useAuth();

  /* Doanh thu không tính đơn đã hủy và đơn hoàn trả. */
  const revenue = orders.filter((o) => o.status !== "Đã hủy" && o.status !== "Hoàn trả").reduce((s, o) => s + o.total, 0);
  const recent = orders.slice(0, 5);
  const canOrders = canAccessSection(user?.role, "orders");
  const canDelete = canDeleteOrder(user?.role);

  const allCards = [
    { label: "Doanh thu (đơn chưa huỷ)", value: formatPrice(revenue), href: "/admin/orders", section: "orders" as const },
    { label: "Đơn hàng", value: String(orders.length), href: "/admin/orders", section: "orders" as const },
    { label: "Sản phẩm đang bán", value: String(products.length), href: "/admin/products", section: "products" as const },
    { label: "Tin nhắn liên hệ", value: String(messages.length), href: "/admin/messages", section: "messages" as const },
    { label: "Email đăng ký tư vấn", value: String(subscribers.length), href: "/admin/subscribers", section: "subscribers" as const },
  ];
  const cards = allCards.filter((c) => canAccessSection(user?.role, c.section));

  return (
    <div>
      <h1 className="text-2xl font-light tracking-wide">Tổng quan shop</h1>
      <p className="text-sm text-neutral-500 mt-1">Số liệu lấy từ database của shop.</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-7">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white p-5 shadow-sm hover:shadow transition-shadow">
            <p className="text-[26px] font-semibold leading-none">{c.value}</p>
            <p className="text-[13px] text-neutral-500 mt-2">{c.label}</p>
          </Link>
        ))}
      </div>

      {canOrders && (
      <div className="bg-white shadow-sm mt-8">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-medium">Đơn hàng mới nhất</h2>
          <Link href="/admin/orders" className="text-sm underline">Xem tất cả</Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-neutral-500 text-sm">Chưa có đơn hàng nào. Khi khách đặt hàng ở trang Thanh toán, đơn sẽ hiện ở đây.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-neutral-500 border-b">
                  <th className="px-5 py-3 font-medium">Mã đơn</th>
                  <th className="px-5 py-3 font-medium">Khách hàng</th>
                  <th className="px-5 py-3 font-medium">Tổng tiền</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  {canDelete && <th className="px-5 py-3 font-medium text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="px-5 py-3 align-top font-medium">{o.id}</td>
                    <td className="px-5 py-3 align-top">{o.customer.name}</td>
                    <td className="px-5 py-3 align-top">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3 align-top">{o.status}</td>
                    {canDelete && (
                    <td className="px-5 py-3 align-top text-right">
                      <button title="Xoá đơn này" aria-label={`Xoá đơn ${o.id}`} onClick={() => { if (confirm(`Xoá đơn ${o.id}?`)) { deleteOrder(o.id); logActivity(user?.email, "Xoá đơn hàng", `Xoá đơn ${o.id} (${o.customer.name}, ${formatPrice(o.total)}).`); } }} className="text-red-600 text-base leading-none">🗑</button>
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
