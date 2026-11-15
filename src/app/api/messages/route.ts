import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAppMessage } from "@/lib/db-map";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

export async function GET(req: Request) {
  /* ?email=... : khách tra cứu tin nhắn mình đã gửi (khớp đúng email;
     cột email dùng collation utf8mb4_unicode_ci nên so sánh không phân
     biệt hoa thường). Không có ?email= thì trả toàn bộ như cũ. */
  const email = new URL(req.url).searchParams.get("email")?.trim();
  const rows = await prisma.contactMessage.findMany({
    where: email ? { email: { equals: email } } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows.map(toAppMessage));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: "Thiếu thông tin liên hệ" }, { status: 400 });
  }
  const created = await prisma.contactMessage.create({
    data: {
      name: String(body.name),
      email: String(body.email),
      subject: body.subject ? String(body.subject) : null,
      message: String(body.message),
    },
  });
  return NextResponse.json(toAppMessage(created), { status: 201 });
}
