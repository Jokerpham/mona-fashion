"use client";
import { Fragment, useState } from "react";
import { useProducts, slugify, type Product } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";
import {
  canDeleteProduct,
  canEditProductContent,
  canEditStock,
  canResetProducts,
} from "@/lib/roles";
import { formatPrice } from "@/lib/format";

const CATEGORIES = [
  { id: "woman", label: "Woman" },
  { id: "man", label: "Man" },
  { id: "accessories", label: "Accessories" },
  { id: "bags", label: "Bags" },
  { id: "footwear", label: "Footwear" },
];
const TAGS = [
  { id: "", label: "Không gắn thẻ" },
  { id: "best", label: "Best Sellers" },
  { id: "new", label: "New Products" },
  { id: "sale", label: "Sales (giảm giá)" },
];

type Form = {
  name: string; slug: string; price: string; oldPrice: string;
  category: string; tag: string; sizes: string; image: string; description: string;
};
const EMPTY: Form = { name: "", slug: "", price: "", oldPrice: "", category: "woman", tag: "", sizes: "S,M,L", image: "", description: "" };

export default function AdminProducts() {
  const { products, addProduct, updateProduct, updateProductStock, deleteProduct, resetProducts } = useProducts();
  const { user } = useAuth();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState("");
  const [stockEditing, setStockEditing] = useState<{ id: number; name: string; stocks: { size: string; stock: number }[] } | null>(null);
  const [stockError, setStockError] = useState("");

  const canContent = canEditProductContent(user?.role);
  const canStock = canEditStock(user?.role);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(""); setShowForm(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, slug: p.slug, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      category: p.category, tag: p.tag || "", sizes: p.sizes.join(","),
      image: p.image, description: p.description,
    });
    setError("");
    setShowForm(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const price = parseInt(form.price.replace(/[^\d]/g, ""), 10);
    if (!name || !price) { setError("Hãy nhập tên sản phẩm và giá bán hợp lệ."); return; }
    const slug = (form.slug.trim() || slugify(name));
    if (products.some((p) => p.slug === slug && p.id !== editing?.id)) {
      setError("Đường dẫn (slug) này đã có sản phẩm khác dùng. Hãy đổi slug khác.");
      return;
    }
    const oldPrice = form.oldPrice ? parseInt(form.oldPrice.replace(/[^\d]/g, ""), 10) : undefined;
    const data: Product = {
      id: editing ? editing.id : Math.max(0, ...products.map((p) => p.id)) + 1,
      slug, name, price,
      ...(oldPrice ? { oldPrice } : {}),
      category: form.category as Product["category"],
      ...((form.tag ? { tag: form.tag } : {}) as object),
      image: form.image.trim() || "/images/products/cotton-t-shirt.jpg",
      description: form.description.trim(),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
    } as Product;
    if (editing) {
      updateProduct(data);
      const pricePart = editing.price !== price ? ` Giá: ${formatPrice(editing.price)} → ${formatPrice(price)}.` : "";
      logActivity(user?.email, "Sửa sản phẩm", `Sửa "${name}".${pricePart}`);
    } else {
      addProduct(data);
      logActivity(user?.email, "Tạo sản phẩm", `Tạo "${name}" (${formatPrice(price)}).`);
    }
    setShowForm(false);
  };

  const openStockEditor = (p: Product) => {
    const stocks = (p.sizeStocks ?? []).map((s) => ({ size: s.size, stock: s.stock }));
    setStockEditing({ id: p.id, name: p.name, stocks });
    setStockError("");
  };

  const saveStock = async () => {
    if (!stockEditing) return;
    const before = products.find((p) => p.id === stockEditing.id);
    const changes = stockEditing.stocks
      .map((s) => {
        const old = (before?.sizeStocks ?? []).find((x) => x.size === s.size)?.stock;
        return old !== undefined && old !== s.stock ? `${s.size}: ${old} → ${s.stock}` : null;
      })
      .filter(Boolean) as string[];
    try {
      await updateProductStock(stockEditing.id, stockEditing.stocks);
      logActivity(
        user?.email,
        "Sửa tồn kho",
        changes.length > 0
          ? `"${stockEditing.name}": ${changes.join(", ")}.`
          : `Mở sửa tồn kho "${stockEditing.name}" (không đổi số lượng).`,
      );
      setStockEditing(null);
    } catch (err: any) {
      setStockError(err?.message || "Không lưu được tồn kho.");
    }
  };

  const removeProduct = (p: Product) => {
    if (!confirm(`Xoá sản phẩm "${p.name}"?`)) return;
    deleteProduct(p.id);
    logActivity(user?.email, "Xoá sản phẩm", `Xoá "${p.name}".`);
  };

  const field = "border w-full px-3 py-2.5 outline-none focus:border-black bg-white";
  const label = "block text-sm mb-1 font-medium";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Sản phẩm</h1>
          <p className="text-sm text-neutral-500 mt-1">Thêm / sửa / xoá sản phẩm — thay đổi áp dụng ngay ra trang Shop và Trang chủ.</p>
        </div>
        <div className="flex gap-2">
          {canResetProducts(user?.role) && (
            <button onClick={() => { if (confirm("Khôi phục danh sách sản phẩm mẫu ban đầu? Mọi thay đổi sản phẩm sẽ mất.")) { resetProducts(); logActivity(user?.email, "Khôi phục sản phẩm mẫu", "Khôi phục danh sách sản phẩm mẫu ban đầu."); } }} className="border bg-white px-4 py-2.5 text-sm hover:border-black">Khôi phục mẫu</button>
          )}
          {canContent && (
            <button onClick={openAdd} className="bg-black font-heading text-white px-4 py-2.5 text-sm tracking-wider hover:bg-neutral-800">+ THÊM SẢN PHẨM</button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white shadow-sm p-5 md:p-6 mt-6">
          <h2 className="font-medium mb-4">{editing ? `Sửa sản phẩm: ${editing.name}` : "Thêm sản phẩm mới"}</h2>
          {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 mb-4">{error}</p>}
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={label}>Tên sản phẩm *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className={field} placeholder="Ví dụ: Áo Sơ Mi Linen" /></div>
            <div><label className={label}>Đường dẫn (slug)</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={field} placeholder="ao-so-mi-linen" /></div>
            <div><label className={label}>Giá bán (đ) *</label><input required inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={field} placeholder="350000" /></div>
            <div><label className={label}>Giá gốc (đ) — để trống nếu không giảm giá</label><input inputMode="numeric" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className={field} placeholder="450000" /></div>
            <div><label className={label}>Danh mục</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
            <div><label className={label}>Thẻ hiển thị</label><select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className={field}>{TAGS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
            <div><label className={label}>Size (cách nhau dấu phẩy)</label><input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className={field} placeholder="S,M,L hoặc 36,37,38 hoặc Free" /></div>
            <div><label className={label}>Ảnh chính (đường dẫn)</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={field} placeholder="/images/products/ten-anh.jpg" /></div>
            <div className="md:col-span-2"><label className={label}>Mô tả</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} placeholder="Mô tả ngắn về sản phẩm…" /></div>
          </div>
          {form.image && (
            <div className="mt-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="Xem trước ảnh" className="w-16 h-20 object-cover bg-neutral-100" />
              <p className="text-sm text-neutral-500">Xem trước ảnh chính. Ảnh phải nằm trong thư mục <code>public/images/products</code> của code (hoặc dán link ảnh đầy đủ https://…).</p>
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <button className="bg-black font-heading text-white px-6 py-2.5 text-sm tracking-wider hover:bg-neutral-800">{editing ? "LƯU THAY ĐỔI" : "THÊM SẢN PHẨM"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="border bg-white px-6 py-2.5 text-sm hover:border-black">Huỷ</button>
          </div>
        </form>
      )}

      {stockError && <p className="bg-red-50 text-red-700 text-sm px-4 py-3 mt-6">{stockError}</p>}

      <div className="bg-white shadow-sm mt-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-neutral-500 border-b">
              <th className="px-5 py-3 font-medium">Sản phẩm</th>
              <th className="px-5 py-3 font-medium">Danh mục</th>
              <th className="px-5 py-3 font-medium">Giá</th>
              <th className="px-5 py-3 font-medium">Tồn kho theo size</th>
              <th className="px-5 py-3 font-medium">Thẻ</th>
              <th className="px-5 py-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <Fragment key={p.id}>
                <tr className="border-b hover:bg-neutral-50">
                  <td className="px-5 py-3 align-top">
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-11 h-14 object-cover bg-neutral-100" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-neutral-400">/product/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 align-top capitalize">{p.category}</td>
                  <td className="px-5 py-3 align-top">{formatPrice(p.price)}{p.oldPrice && <span className="block text-xs text-neutral-400 line-through">{formatPrice(p.oldPrice)}</span>}</td>
                  <td className="px-5 py-3 align-top">
                    {p.sizeStocks && p.sizeStocks.length > 0 ? (
                      <span>
                        {p.sizeStocks.map((s, i) => (
                          <span key={s.size}>
                            {i > 0 && <span className="text-neutral-300"> · </span>}
                            {s.size}:{" "}
                            <span className={s.stock <= 5 ? "font-semibold text-amber-700" : undefined}>{s.stock}</span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-neutral-400">{p.sizes.join(" · ") || "—"}</span>
                    )}
                    {canStock && p.sizeStocks && p.sizeStocks.length > 0 && (
                      <button onClick={() => openStockEditor(p)} className="block underline text-xs mt-1">Sửa tồn kho</button>
                    )}
                  </td>
                  <td className="px-5 py-3 align-top">{p.tag || "—"}</td>
                  <td className="px-5 py-3 align-top text-right whitespace-nowrap">
                    {canContent && <button onClick={() => openEdit(p)} className="underline mr-4">Sửa</button>}
                    {canDeleteProduct(user?.role) && <button onClick={() => removeProduct(p)} className="underline text-red-600">Xoá</button>}
                  </td>
                </tr>
                {stockEditing?.id === p.id && (
                  <tr className="border-b bg-neutral-50">
                    <td colSpan={6} className="px-5 py-4">
                      <p className="font-medium text-sm">Sửa tồn kho: {p.name}</p>
                      <p className="text-xs text-neutral-500 mt-1">Chỉ sửa số lượng theo size, không đổi tên/giá/size. Số 5 trở xuống sẽ hiện cảnh báo sắp hết hàng.</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {stockEditing.stocks.map((s, i) => (
                          <label key={s.size} className="text-sm">
                            Size {s.size}
                            <input
                              type="number"
                              min={0}
                              value={s.stock}
                              onChange={(e) => {
                                const v = Math.max(0, parseInt(e.target.value || "0", 10) || 0);
                                setStockEditing({
                                  ...stockEditing,
                                  stocks: stockEditing.stocks.map((x, j) => (j === i ? { ...x, stock: v } : x)),
                                });
                              }}
                              className="border bg-white px-2 py-1.5 ml-2 w-20 outline-none focus:border-black"
                            />
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={saveStock} className="bg-black font-heading text-white px-5 py-2 text-sm hover:bg-neutral-800">LƯU TỒN KHO</button>
                        <button onClick={() => setStockEditing(null)} className="border bg-white px-5 py-2 text-sm hover:border-black">Huỷ</button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
