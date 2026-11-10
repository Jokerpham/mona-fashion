import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAppOrder, toDbPayment, toDbStatus } from "@/lib/db-map";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

export async function GET() {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows.map(toAppOrder));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  const items = Array.isArray(body.items) ? body.items : [];
  if (!body?.customer?.name || !body?.customer?.phone || items.length === 0) {
    return NextResponse.json({ error: "Thiếu thông tin đơn hàng" }, { status: 400 });
  }
  const subtotal = items.reduce(
    (sum: number, i: any) => sum + Number(i.price ?? 0) * Number(i.qty ?? 0),
    0,
  );
  const total = Number(body.total ?? subtotal);
  const code = String(body.id ?? "").trim();
  if (!code) return NextResponse.json({ error: "Thiếu mã đơn hàng" }, { status: 400 });
  const created = await prisma.order.create({
    data: {
      code,
      customerName: String(body.customer.name),
      phone: String(body.customer.phone),
      email: body.customer.email ? String(body.customer.email) : null,
      address: String(body.customer.address ?? ""),
      paymentMethod: toDbPayment(String(body.payment ?? "COD")),
      status: toDbStatus(String(body.status ?? "Chờ xác nhận")),
      subtotal,
      shippingFee: Math.max(0, total - subtotal),
      total,
      note: body.note ? String(body.note) : null,
      items: {
        create: items.map((i: any) => ({
          productName: String(i.name),
          size: String(i.size ?? ""),
          price: Number(i.price ?? 0),
          quantity: Number(i.qty ?? 0),
          subtotal: Number(i.price ?? 0) * Number(i.qty ?? 0),
        })),
      },
    },
    include: { items: true },
  });
  return NextResponse.json(toAppOrder(created), { status: 201 });
}
