/* Chuyển đổi giữa dòng dữ liệu trong CSDL và kiểu dữ liệu app đang dùng
   (src/lib/store.ts). File này chỉ chạy phía server (API routes).
   Lưu ý: CSDL lưu trạng thái đơn và phương thức thanh toán bằng mã ngắn
   (pending/preparing/shipping/done/cancelled/returned, cod/bank/momo), còn
   giao diện hiển thị tiếng Việt — 2 hàm map dưới đây giữ cho 2 phía khớp
   nhau. QUAN TRỌNG: mã CSDL của các trạng thái cũ được giữ nguyên để đơn
   đã có trong CSDL vẫn hiển thị đúng — chỉ đổi nhãn hiển thị:
   pending (Mới) → "Chờ xác nhận", done (Hoàn thành) → "Đã giao";
   2 trạng thái mới dùng mã mới, chưa từng có trong CSDL cũ: preparing
   (Đang chuẩn bị hàng), returned (Hoàn trả). */
import type { Product } from "@/data/products";
import type { Order, ContactMessage, Subscriber, MessageReply } from "@/lib/store";

export const CATEGORY_LABELS: Record<string, string> = {
  woman: "Woman",
  man: "Man",
  accessories: "Accessories",
  bags: "Bags",
  footwear: "Footwear",
};

const STATUS_TO_DB: Record<Order["status"], string> = {
  "Chờ xác nhận": "pending",
  "Đang chuẩn bị hàng": "preparing",
  "Đang giao": "shipping",
  "Đã giao": "done",
  "Đã hủy": "cancelled",
  "Hoàn trả": "returned",
};
const STATUS_FROM_DB: Record<string, Order["status"]> = {
  pending: "Chờ xác nhận",
  confirmed: "Chờ xác nhận",
  preparing: "Đang chuẩn bị hàng",
  shipping: "Đang giao",
  done: "Đã giao",
  cancelled: "Đã hủy",
  returned: "Hoàn trả",
};

export function toDbStatus(status: string): string {
  return STATUS_TO_DB[status as Order["status"]] ?? "pending";
}
export function toAppStatus(status: string): Order["status"] {
  return STATUS_FROM_DB[status] ?? "Chờ xác nhận";
}
export function toDbPayment(payment: string): string {
  if (/momo/i.test(payment)) return "momo";
  if (/chuyển khoản|bank/i.test(payment)) return "bank";
  return "cod";
}
export function toAppPayment(method: string): string {
  if (method === "momo") return "Ví MoMo / ZaloPay";
  if (method === "bank") return "Chuyển khoản ngân hàng";
  return "COD - Thanh toán khi nhận hàng";
}

export function toAppProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    oldPrice: row.oldPrice ?? undefined,
    category: row.category?.slug ?? "woman",
    tag: row.tag ?? undefined,
    image: row.images?.[0]?.url ?? "",
    description: row.description ?? "",
    sizes: (row.sizes ?? []).map((s: any) => s.size),
    // Giữ tồn kho theo size để sidebar tính badge "sắp hết hàng" (mặc định 100 như Prisma).
    sizeStocks: (row.sizes ?? []).map((s: any) => ({
      size: s.size,
      stock: typeof s.stock === "number" ? s.stock : 100,
    })),
  };
}

export function toAppOrder(row: any): Order {
  return {
    id: row.code,
    date:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : new Date(row.createdAt).toISOString(),
    customer: {
      name: row.customerName,
      phone: row.phone,
      email: row.email ?? undefined,
      address: row.address,
    },
    items: (row.items ?? []).map((i: any) => ({
      name: i.productName,
      size: i.size,
      qty: i.quantity,
      price: i.price,
    })),
    total: row.total,
    payment: toAppPayment(row.paymentMethod),
    status: toAppStatus(row.status),
    note: row.note ?? undefined,
  };
}

export function toAppMessage(row: any): ContactMessage {
  return {
    id: String(row.id),
    date:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : new Date(row.createdAt).toISOString(),
    name: row.name,
    email: row.email,
    subject: row.subject ?? "",
    message: row.message,
    read: !!row.isRead,
  };
}

export function toAppReply(row: any): MessageReply {
  return {
    id: String(row.id),
    messageId: String(row.messageId),
    sender: row.sender === "customer" ? "customer" : "admin",
    body: row.body,
    date:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : new Date(row.createdAt).toISOString(),
  };
}

export function toAppSubscriber(row: any): Subscriber {
  return {
    email: row.email,
    date:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : new Date(row.createdAt).toISOString(),
  };
}
