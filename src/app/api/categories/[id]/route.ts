import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

/* Chỉ sửa tên hiển thị — slug giữ nguyên để không đứt liên kết sản phẩm. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const cid = parseId(params.id);
  if (cid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Hãy nhập tên danh mục." }, { status: 400 });
  const updated = await prisma.category.update({ where: { id: cid }, data: { name } });
  const count = await prisma.product.count({ where: { categoryId: cid, isActive: true } });
  return NextResponse.json({ id: updated.id, name: updated.name, slug: updated.slug, productCount: count });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const cid = parseId(params.id);
  if (cid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  const count = await prisma.product.count({ where: { categoryId: cid } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Danh mục còn ${count} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước khi xoá.` },
      { status: 400 },
    );
  }
  await prisma.category.delete({ where: { id: cid } });
  return NextResponse.json({ ok: true });
}
