import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

/* Danh mục sản phẩm: đọc bảng categories có sẵn, không đổi schema.
   Slug là định danh liên kết với sản phẩm nên chỉ đặt lúc tạo, về sau chỉ
   sửa tên hiển thị (xem route [id]). */
export async function GET() {
  const rows = await prisma.category.findMany({
    include: { products: { where: { isActive: true }, select: { id: true } } },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(
    rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, productCount: c.products.length })),
  );
}

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim() || slugify(name);
  if (!name || !slug) {
    return NextResponse.json({ error: "Hãy nhập tên danh mục." }, { status: 400 });
  }
  try {
    const created = await prisma.category.create({ data: { name, slug } });
    return NextResponse.json(
      { id: created.id, name: created.name, slug: created.slug, productCount: 0 },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Đường dẫn (slug) này đã được dùng." }, { status: 400 });
  }
}
