import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAppOrder, toDbStatus } from "@/lib/db-map";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

/* [id] ở đây là mã đơn (vd MONA...), không phải id số trong bảng. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  if (body.status === undefined) {
    return NextResponse.json({ error: "Thiếu trạng thái" }, { status: 400 });
  }
  const updated = await prisma.order.update({
    where: { code: params.id },
    data: { status: toDbStatus(String(body.status)) },
    include: { items: true },
  });
  return NextResponse.json(toAppOrder(updated));
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({ where: { code: params.id } });
  if (!order) return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });
  await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });
  return NextResponse.json({ ok: true });
}
