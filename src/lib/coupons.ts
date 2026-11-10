"use client";
/* Mã giảm giá của shop (bản demo-grade): lưu trên trình duyệt này qua
   localStorage, chưa nối CSDL. Mỗi mã gắn cho tất cả sản phẩm, một danh
   mục, hoặc một sản phẩm cụ thể, mỗi mã một mức % riêng. */
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/products";

export type CouponScope = "all" | "category" | "product";
export type Coupon = {
  id: string;
  code: string;
  percent: number;
  scope: CouponScope;
  category?: Product["category"];
  productSlug?: string;
  active: boolean;
};

export const CATEGORY_LABELS_VI: Record<Product["category"], string> = {
  woman: "Nữ",
  man: "Nam",
  accessories: "Phụ kiện",
  bags: "Túi xách",
  footwear: "Giày dép",
};

const KEY = "mona-coupons";

const SEEDS: Coupon[] = [
  { id: "seed-mona10", code: "MONA10", percent: 10, scope: "all", active: true },
  { id: "seed-aonu20", code: "AONU20", percent: 20, scope: "category", category: "woman", active: true },
  { id: "seed-nam15", code: "NAM15", percent: 15, scope: "category", category: "man", active: true },
  { id: "seed-topper25", code: "TOPPER25", percent: 25, scope: "product", productSlug: "classic-topper", active: true },
];

export function scopeLabel(c: Coupon, products: Product[]): string {
  if (c.scope === "category" && c.category) return `Danh mục: ${CATEGORY_LABELS_VI[c.category]}`;
  if (c.scope === "product" && c.productSlug) {
    const p = products.find((x) => x.slug === c.productSlug);
    return `Sản phẩm: ${p ? p.name : c.productSlug}`;
  }
  return "Tất cả sản phẩm";
}

export function couponApplies(c: Coupon, p: Product): boolean {
  if (!c.active) return false;
  if (c.scope === "all") return true;
  if (c.scope === "category") return c.category === p.category;
  if (c.scope === "product") return c.productSlug === p.slug;
  return false;
}

export function applicableCoupons(coupons: Coupon[], p: Product): Coupon[] {
  return coupons.filter((c) => couponApplies(c, p));
}

export function newCouponId(): string {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(SEEDS);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCoupons(parsed);
      }
    } catch {}
  }, []);
  const save = useCallback((next: Coupon[]) => {
    setCoupons(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);
  return {
    coupons,
    addCoupon: (c: Coupon) => save([...coupons, c]),
    updateCoupon: (c: Coupon) => save(coupons.map((x) => (x.id === c.id ? c : x))),
    toggleCoupon: (id: string) =>
      save(coupons.map((x) => (x.id === id ? { ...x, active: !x.active } : x))),
    deleteCoupon: (id: string) => save(coupons.filter((x) => x.id !== id)),
  };
}
