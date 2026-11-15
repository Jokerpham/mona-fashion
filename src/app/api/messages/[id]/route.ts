import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAppMessage } from "@/lib/db-map";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

/* Đảo trạng thái đã đọc / chưa đọc. */
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const mid = parseId(params.id);
  if (mid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  const row = await prisma.contactMessage.findUnique({ where: { id: mid } });
  if (!row) return NextResponse.json({ error: "Không tìm thấy tin nhắn" }, { status: 404 });
  const updated = await prisma.contactMessage.update({
    where: { id: mid },
    data: { isRead: !row.isRead },
  });
  return NextResponse.json(toAppMessage(updated));
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const mid = parseId(params.id);
  if (mid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  await prisma.contactMessage.delete({ where: { id: mid } });
  return NextResponse.json({ ok: true });
}
