import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products as SEED_PRODUCTS } from "@/data/products";
import { CATEGORY_LABELS } from "@/lib/db-map";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Cloudflare Pages yeu cau route dong chay Edge Runtime.

/* Khôi phục danh sách sản phẩm mẫu ban đầu (nút "Khôi phục mẫu" ở Admin).
   Chỉ reset sản phẩm/ảnh/size, không đụng tới đơn hàng, tin nhắn, đăng ký. */
export async function POST() {
  await prisma.productSize.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  for (const p of SEED_PRODUCTS) {
    const category = await prisma.category.upsert({
      where: { slug: p.category },
      update: {},
      create: { slug: p.category, name: CATEGORY_LABELS[p.category] ?? p.category },
    });
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        tag: p.tag ?? null,
        categoryId: category.id,
        images: { create: [{ url: p.image, sortOrder: 0 }] },
        sizes: { create: p.sizes.map((size) => ({ size })) },
      },
    });
  }
  return NextResponse.json({ ok: true, count: SEED_PRODUCTS.length });
}
