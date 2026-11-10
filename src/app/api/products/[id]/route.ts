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

function parseId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const pid = parseId(params.id);
  if (pid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  const row = await prisma.product.findUnique({ where: { id: pid }, include: productInclude });
  if (!row) return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  return NextResponse.json(toAppProduct(row));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const pid = parseId(params.id);
  if (pid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  const body = (await req.json()) as Record<string, any>; // Ep kieu: json() suy ra unknown do kieu global cua @cloudflare/workers-types
  const data: any = {};
  if (body.name !== undefined) data.name = String(body.name);
  if (body.slug !== undefined || body.name !== undefined)
    data.slug = String(body.slug ?? "").trim() || slugify(String(body.name ?? ""));
  if (body.description !== undefined) data.description = String(body.description);
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.oldPrice !== undefined) data.oldPrice = body.oldPrice ? Number(body.oldPrice) : null;
  if (body.tag !== undefined) data.tag = body.tag ? String(body.tag) : null;
  if (body.category !== undefined) {
    const categorySlug = String(body.category);
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: { slug: categorySlug, name: CATEGORY_LABELS[categorySlug] ?? categorySlug },
    });
    data.categoryId = category.id;
  }
  const updated = await prisma.product.update({ where: { id: pid }, data });
  if (body.image !== undefined) {
    await prisma.productImage.deleteMany({ where: { productId: pid } });
    const image = String(body.image).trim();
    if (image) await prisma.productImage.create({ data: { productId: pid, url: image, sortOrder: 0 } });
  }
  if (Array.isArray(body.sizes)) {
    /* Tạo lại danh sách size nhưng GIỮ tồn kho cũ của các size còn giữ lại
       (trước đây sửa nội dung sản phẩm làm tồn kho reset về 100). */
    const existing = await prisma.productSize.findMany({ where: { productId: pid } });
    const oldStock = new Map(existing.map((s) => [s.size, s.stock]));
    await prisma.productSize.deleteMany({ where: { productId: pid } });
    for (const size of body.sizes.filter(Boolean)) {
      const s = String(size);
      await prisma.productSize.create({
        data: { productId: pid, size: s, stock: oldStock.get(s) ?? 100 },
      });
    }
  }
  /* Sửa tồn kho theo size mà không đụng tới các trường khác. Chạy sau khối
     sizes ở trên để nếu gửi kèm cả sizes mới thì tồn kho mới vẫn được giữ. */
  if (Array.isArray(body.sizeStocks)) {
    for (const s of body.sizeStocks) {
      const size = String((s as any)?.size ?? "").trim();
      const stock = Number((s as any)?.stock);
      if (!size || !Number.isFinite(stock) || stock < 0) continue;
      await prisma.productSize.upsert({
        where: { productId_size: { productId: pid, size } },
        update: { stock: Math.floor(stock) },
        create: { productId: pid, size, stock: Math.floor(stock) },
      });
    }
  }
  const row = await prisma.product.findUnique({ where: { id: updated.id }, include: productInclude });
  return NextResponse.json(toAppProduct(row));
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const pid = parseId(params.id);
  if (pid === null) return NextResponse.json({ error: "Id không hợp lệ" }, { status: 400 });
  await prisma.productSize.deleteMany({ where: { productId: pid } });
  await prisma.productImage.deleteMany({ where: { productId: pid } });
  await prisma.product.delete({ where: { id: pid } });
  return NextResponse.json({ ok: true });
}
