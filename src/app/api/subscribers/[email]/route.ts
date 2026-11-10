import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

export async function DELETE(_req: Request, { params }: { params: { email: string } }) {
  const email = decodeURIComponent(params.email);
  await prisma.newsletterSubscriber.deleteMany({
    where: { email: { in: [email, email.toLowerCase()] } },
  });
  return NextResponse.json({ ok: true });
}
