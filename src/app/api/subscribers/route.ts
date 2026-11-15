import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAppSubscriber } from "@/lib/db-map";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

export async function GET() {
  const rows = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows.map(toAppSubscriber));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  const email = String(body.email ?? "").trim();
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
  }
  const row = await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
  return NextResponse.json(toAppSubscriber(row), { status: 201 });
}
