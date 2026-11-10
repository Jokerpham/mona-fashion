import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAppReply } from "@/lib/db-map";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

/* Lấy toàn bộ lượt trả lời của một tin nhắn liên hệ, theo thứ tự thời gian. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const mid = parseId(params.id);
  if (mid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  const msg = await prisma.contactMessage.findUnique({ where: { id: mid } });
  if (!msg) return NextResponse.json({ error: "Không tìm thấy tin nhắn" }, { status: 404 });
  const rows = await prisma.messageReply.findMany({
    where: { messageId: mid },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(rows.map(toAppReply));
}

/* Gửi một lượt trả lời mới vào đoạn chat (admin hoặc khách đều dùng chung). */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const mid = parseId(params.id);
  if (mid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  const body = (await req.json().catch(() => null)) as Record<string, any> | null; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  const text = typeof body?.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Nội dung trả lời không được để trống" }, { status: 400 });
  }
  if (body?.sender !== "admin" && body?.sender !== "customer") {
    return NextResponse.json({ error: "Người gửi không hợp lệ" }, { status: 400 });
  }
  const msg = await prisma.contactMessage.findUnique({ where: { id: mid } });
  if (!msg) return NextResponse.json({ error: "Không tìm thấy tin nhắn" }, { status: 404 });
  const created = await prisma.messageReply.create({
    data: { messageId: mid, sender: body.sender, body: text },
  });
  return NextResponse.json(toAppReply(created), { status: 201 });
}
