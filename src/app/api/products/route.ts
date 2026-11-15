import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAppProduct, CATEGORY_LABELS } from "@/lib/db-map";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  sizes: true,
};

export async function GET() {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { id: "asc" },
  });
  return NextResponse.json(rows.map(toAppProduct));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  if (!name || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Thiếu tên hoặc giá sản phẩm" }, { status: 400 });
  }
  const slug = String(body.slug ?? "").trim() || slugify(name);
  const categorySlug = String(body.category ?? "woman");
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {},
    create: { slug: categorySlug, name: CATEGORY_LABELS[categorySlug] ?? categorySlug },
  });
  const sizes: string[] = Array.isArray(body.sizes) ? body.sizes.filter(Boolean) : [];
  const image = String(body.image ?? "").trim();
  const created = await prisma.product.create({
    data: {
      name,
      slug,
      description: String(body.description ?? ""),
      price,
      oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
      tag: body.tag ? String(body.tag) : null,
      categoryId: category.id,
      images: image ? { create: [{ url: image, sortOrder: 0 }] } : undefined,
      sizes: { create: sizes.map((size) => ({ size: String(size) })) },
    },
    include: productInclude,
  });
  return NextResponse.json(toAppProduct(created), { status: 201 });
}
