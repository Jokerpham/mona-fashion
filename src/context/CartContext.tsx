"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/data/products";
export type CartItem = { product: Product; size: string; qty: number };
type CartCtx = { items: CartItem[]; isOpen: boolean; setOpen: (v: boolean) => void; add: (p: Product, size?: string, qty?: number, openDrawer?: boolean) => void; remove: (slug: string, size: string) => void; changeQty: (slug: string, size: string, d: number) => void; total: number; count: number; clear: () => void };
const Ctx = createContext<CartCtx | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  useEffect(() => { try { const s = localStorage.getItem("mona-cart"); if (s) setItems(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { localStorage.setItem("mona-cart", JSON.stringify(items)); }, [items]);
  const add = (p: Product, size = p.sizes[0], qty = 1, openDrawer = true) => { setItems(prev => { const f = prev.find(i => i.product.slug === p.slug && i.size === size); return f ? prev.map(i => i === f ? { ...i, qty: i.qty + qty } : i) : [...prev, { product: p, size, qty }]; }); if (openDrawer) setOpen(true); };
  const remove = (slug: string, size: string) => setItems(prev => prev.filter(i => !(i.product.slug === slug && i.size === size)));
  const changeQty = (slug: string, size: string, d: number) => setItems(prev => prev.map(i => i.product.slug === slug && i.size === size ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <Ctx.Provider value={{ items, isOpen, setOpen, add, remove, changeQty, total, count, clear }}>{children}</Ctx.Provider>;
}
export const useCart = () => { const c = useContext(Ctx); if (!c) throw new Error("useCart must be used within CartProvider"); return c; };
