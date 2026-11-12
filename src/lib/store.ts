"use client";
/* Kho dữ liệu dùng chung của shop, nay đọc/ghi qua API vào CSDL MySQL
   (Prisma) thay vì localStorage như trước. Nhờ vậy Shop, Trang chủ và
   Admin thấy chung một kho dữ liệu, kể cả khi mở bằng địa chỉ khác nhau
   trên cùng máy (localhost hay link loca.lt) — miễn là cùng trỏ về một
   server đang chạy. Giỏ hàng vẫn lưu riêng trong trình duyệt từng máy.
   Tên hàm giữ nguyên như bản cũ nên các trang không cần sửa gì thêm. */
import { useCallback, useEffect, useState } from "react";
import { products as SEED_PRODUCTS, type Product } from "@/data/products";

export type { Product };
export { slugify } from "@/lib/utils";

export type OrderItem = { name: string; size: string; qty: number; price: number };
export type Order = {
  id: string;
  date: string; // ISO
  customer: { name: string; phone: string; email?: string; address: string };
  items: OrderItem[];
  total: number;
  payment: string;
  status: "Chờ xác nhận" | "Đang chuẩn bị hàng" | "Đang giao" | "Đã giao" | "Đã hủy" | "Hoàn trả";
  note?: string;
};
export type ContactMessage = {
  id: string;
  date: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
};
/* Một lượt trả lời trong đoạn chat của một tin nhắn liên hệ. */
export type MessageReply = {
  id: string;
  messageId: string;
  sender: "admin" | "customer";
  body: string;
  date: string; // ISO
};
export type Subscriber = { email: string; date: string };

/* Danh mục sản phẩm (bảng categories trong CSDL). Slug là định danh liên
   kết với sản phẩm nên không đổi sau khi tạo — chỉ sửa tên hiển thị. */
export type Category = { id: number; name: string; slug: string; productCount: number };

export function useCategories() {
  const { list, refresh, ready } = useApiList<Category>("/api/categories", []);
  return {
    categories: list,
    ready,
    addCategory: async (c: { name: string; slug: string }) => {
      await api("/api/categories", { method: "POST", body: JSON.stringify(c) });
      await refresh();
    },
    updateCategory: async (id: number, name: string) => {
      await api(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) });
      await refresh();
    },
    deleteCategory: async (id: number) => {
      await api(`/api/categories/${id}`, { method: "DELETE" });
      await refresh();
    },
  };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = ((await res.json()) as Record<string, any>).error ?? ""; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
    } catch {}
    throw new Error(detail || `Lỗi kết nối CSDL (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/* Hook danh sách dùng chung cho Admin và trang bán hàng */
function useApiList<T>(path: string, seed: T[]) {
  const [list, setList] = useState<T[]>(seed);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(async () => {
    try {
      setList(await api<T[]>(path));
    } catch {
      /* Giữ dữ liệu mẫu khi CSDL chưa sẵn sàng, shop vẫn xem được hàng. */
    } finally {
      setReady(true);
    }
  }, [path]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { list, refresh, ready };
}

export function useProducts() {
  const { list, refresh, ready } = useApiList<Product>("/api/products", SEED_PRODUCTS);
  return {
    products: list,
    ready,
    addProduct: async (p: Product) => {
      await api("/api/products", { method: "POST", body: JSON.stringify(p) });
      await refresh();
    },
    updateProduct: async (p: Product) => {
      await api(`/api/products/${p.id}`, { method: "PATCH", body: JSON.stringify(p) });
      await refresh();
    },
    /* Chỉ sửa tồn kho theo size (không đụng tới tên/giá/size khác). */
    updateProductStock: async (id: number, sizeStocks: { size: string; stock: number }[]) => {
      await api(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify({ sizeStocks }) });
      await refresh();
    },
    deleteProduct: async (id: number) => {
      await api(`/api/products/${id}`, { method: "DELETE" });
      await refresh();
    },
    resetProducts: async () => {
      await api("/api/products/reset", { method: "POST" });
      await refresh();
    },
  };
}

export function useOrders() {
  const { list, refresh, ready } = useApiList<Order>("/api/orders", []);
  return {
    orders: list,
    ready,
    refreshOrders: refresh,
    setStatus: async (id: string, status: Order["status"]) => {
      await api(`/api/orders/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await refresh();
    },
    deleteOrder: async (id: string) => {
      await api(`/api/orders/${encodeURIComponent(id)}`, { method: "DELETE" });
      await refresh();
    },
  };
}

/* Số đơn "Chờ xác nhận" ở menu: chỉ đếm đơn CHƯA xem. Khi admin mở trang
   Đơn hàng, các đơn đang hiện được đánh dấu đã xem (lưu trong trình duyệt)
   nên số biến mất; đơn mới về sau vẫn hiện số lại. */
const ORDERS_SEEN_KEY = "mona-orders-seen";
export const ORDERS_SEEN_EVENT = "mona:orders-seen";
export function getSeenOrderIds(): string[] {
  try {
    const raw = localStorage.getItem(ORDERS_SEEN_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
export function markOrdersSeen(ids: string[]) {
  try {
    const prev = getSeenOrderIds();
    const merged = Array.from(new Set([...prev, ...ids]));
    if (merged.length === prev.length) return;
    localStorage.setItem(ORDERS_SEEN_KEY, JSON.stringify(merged));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(ORDERS_SEEN_EVENT));
}

/* Chuông tin nhắn: "Xóa hết" chỉ ẩn thông báo khỏi chuông (lưu trong trình
   duyệt), tin nhắn gốc vẫn còn nguyên ở trang Tin nhắn liên hệ. */
const BELL_DISMISSED_KEY = "mona-bell-dismissed";
export function getDismissedMessageIds(): string[] {
  try {
    const raw = localStorage.getItem(BELL_DISMISSED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
export function dismissMessages(ids: string[]) {
  try {
    const merged = Array.from(new Set([...getDismissedMessageIds(), ...ids]));
    localStorage.setItem(BELL_DISMISSED_KEY, JSON.stringify(merged));
  } catch {
    /* bỏ qua nếu trình duyệt chặn localStorage */
  }
}

export function useMessages() {
  const { list, refresh, ready } = useApiList<ContactMessage>("/api/messages", []);
  return {
    messages: list,
    ready,
    toggleRead: async (id: string) => {
      await api(`/api/messages/${encodeURIComponent(id)}`, { method: "PATCH" });
      await refresh();
    },
    deleteMessage: async (id: string) => {
      await api(`/api/messages/${encodeURIComponent(id)}`, { method: "DELETE" });
      await refresh();
    },
  };
}

export function useSubscribers() {
  const { list, refresh, ready } = useApiList<Subscriber>("/api/subscribers", []);
  return {
    subscribers: list,
    ready,
    deleteSubscriber: async (email: string) => {
      await api(`/api/subscribers/${encodeURIComponent(email)}`, { method: "DELETE" });
      await refresh();
    },
  };
}

/* Ghi dữ liệu từ các form phía khách hàng (checkout, liên hệ, newsletter) */
export async function pushOrder(order: Order) {
  await api("/api/orders", { method: "POST", body: JSON.stringify(order) });
}
export async function pushMessage(msg: ContactMessage): Promise<ContactMessage> {
  return api<ContactMessage>("/api/messages", { method: "POST", body: JSON.stringify(msg) });
}
/* Đoạn chat của tin nhắn liên hệ: lấy các lượt trả lời + gửi trả lời mới.
   sender = "admin" (trả lời trong trang quản trị) hoặc "customer" (khách
   nhắn tiếp từ trang Liên hệ). */
export async function fetchReplies(messageId: string): Promise<MessageReply[]> {
  return api(`/api/messages/${encodeURIComponent(messageId)}/replies`);
}
export async function postReply(
  messageId: string,
  sender: "admin" | "customer",
  body: string,
): Promise<MessageReply> {
  return api(`/api/messages/${encodeURIComponent(messageId)}/replies`, {
    method: "POST",
    body: JSON.stringify({ sender, body }),
  });
}
/* Khách tra cứu tin nhắn mình đã gửi bằng đúng email đã dùng gửi tin. */
export async function fetchMessagesByEmail(email: string): Promise<ContactMessage[]> {
  return api(`/api/messages?email=${encodeURIComponent(email)}`);
}
export async function pushSubscriber(email: string) {
  await api("/api/subscribers", { method: "POST", body: JSON.stringify({ email }) });
}

export function newId(prefix: string) {
  return prefix + Date.now().toString(36).toUpperCase();
}
