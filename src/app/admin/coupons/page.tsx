"use client";
/* Mã giảm giá: mỗi mã gắn cho tất cả sản phẩm, một danh mục, hoặc một sản
   phẩm cụ thể, mỗi mã một mức % riêng. Form thêm mã có ô chọn phạm vi,
   thẻ mã hiện rõ "Áp dụng: …". Mã lưu trên trình duyệt này (bản demo). */
import { useState } from "react";
import {
  useCoupons,
  scopeLabel,
  CATEGORY_LABELS_VI,
  newCouponId,
  type Coupon,
  type CouponScope,
} from "@/lib/coupons";
import { useProducts } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";
import type { Product } from "@/data/products";

type Form = {
  code: string;
  percent: string;
  scope: CouponScope;
  category: Product["category"];
  productSlug: string;
  active: boolean;
};
const EMPTY: Form = {
  code: "",
  percent: "",
  scope: "all",
  category: "woman",
  productSlug: "",
  active: true,
};

export default function AdminCoupons() {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useCoupons();
  const { products } = useProducts();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const percent = parseInt(form.percent, 10);
    if (!code || !percent || percent < 1 || percent > 100) {
      setError("Hãy nhập mã và mức giảm từ 1 đến 100%.");
      return;
    }
    if (coupons.some((c) => c.code === code)) {
      setError("Mã này đã tồn tại.");
      return;
    }
    if (form.scope === "product" && !form.productSlug) {
      setError("Hãy chọn sản phẩm áp dụng.");
      return;
    }
    const c: Coupon = {
      id: newCouponId(),
      code,
      percent,
      scope: form.scope,
      active: form.active,
      ...(form.scope === "category" ? { category: form.category } : {}),
      ...(form.scope === "product" ? { productSlug: form.productSlug } : {}),
    };
    addCoupon(c);
    logActivity(user?.email, "Tạo mã giảm giá", `Tạo mã ${code} (−${percent}%).`);
    setShowForm(false);
    setForm(EMPTY);
    flash(`Đã thêm mã ${code}.`);
  };

  const remove = (c: Coupon) => {
    if (!confirm(`Xoá mã giảm giá "${c.code}"?`)) return;
    deleteCoupon(c.id);
    logActivity(user?.email, "Xoá mã giảm giá", `Xoá mã ${c.code}.`);
    flash(`Đã xóa mã giảm giá ${c.code}.`);
  };

  const field = "border w-full px-3 py-2.5 outline-none focus:border-black bg-white";
  const label = "block text-sm mb-1 font-medium";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Mã giảm giá</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Tạo và bật/tắt các mã khuyến mãi của cửa hàng. Mã lưu trên trình duyệt này (bản demo).
          </p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY);
            setError("");
            setShowForm(true);
          }}
          className="bg-black font-heading text-white px-4 py-2.5 text-sm tracking-wider hover:bg-neutral-800"
        >
          + THÊM MÃ GIẢM GIÁ
        </button>
      </div>

      {toast && <p className="bg-green-50 text-green-800 text-sm px-4 py-3 mt-6">{toast}</p>}

      {showForm && (
        <form onSubmit={submit} className="bg-white shadow-sm p-5 md:p-6 mt-6">
          <h2 className="font-medium mb-4">Thêm mã giảm giá mới</h2>
          {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 mb-4">{error}</p>}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Mã *</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className={field}
                placeholder="Ví dụ: SALE20"
              />
            </div>
            <div>
              <label className={label}>Mức giảm (%) *</label>
              <input
                required
                inputMode="numeric"
                value={form.percent}
                onChange={(e) => setForm({ ...form, percent: e.target.value })}
                className={field}
                placeholder="20"
              />
            </div>
            <div>
              <label className={label}>Phạm vi áp dụng</label>
              <select
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value as CouponScope })}
                className={field}
              >
                <option value="all">Tất cả sản phẩm</option>
                <option value="category">Một danh mục</option>
                <option value="product">Một sản phẩm cụ thể</option>
              </select>
            </div>
            {form.scope === "category" && (
              <div>
                <label className={label}>Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
                  className={field}
                >
                  {(Object.keys(CATEGORY_LABELS_VI) as Product["category"][]).map((k) => (
                    <option key={k} value={k}>
                      {CATEGORY_LABELS_VI[k]}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {form.scope === "product" && (
              <div>
                <label className={label}>Sản phẩm</label>
                <select
                  value={form.productSlug}
                  onChange={(e) => setForm({ ...form, productSlug: e.target.value })}
                  className={field}
                >
                  <option value="">— Chọn sản phẩm —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                id="coupon-active"
                className="w-4 h-4"
              />
              <label htmlFor="coupon-active" className="text-sm">
                Đang bật (khách thấy mã này ở trang sản phẩm)
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button className="bg-black font-heading text-white px-6 py-2.5 text-sm tracking-wider hover:bg-neutral-800">
              THÊM MÃ
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border bg-white px-6 py-2.5 text-sm hover:border-black"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="bg-white shadow-sm px-5 py-10 mt-6 text-neutral-500 text-sm">
          Chưa có mã giảm giá nào. Bấm “+ THÊM MÃ GIẢM GIÁ” để tạo mã mới.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white shadow-sm p-5 relative">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="bg-amber-100 text-amber-900 text-sm font-mono px-2.5 py-1">{c.code}</span>
                  <span className="ml-2 font-semibold text-lg">−{c.percent}%</span>
                </div>
                <button
                  title="Xoá mã"
                  aria-label={`Xoá mã ${c.code}`}
                  onClick={() => remove(c)}
                  className="text-red-600 text-base leading-none"
                >
                  🗑
                </button>
              </div>
              <p className="text-sm text-neutral-600 mt-3">Áp dụng: {scopeLabel(c, products)}</p>
              <p className="text-sm text-neutral-500 mt-1">Trạng thái: {c.active ? "Đang bật" : "Đang tắt"}</p>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => toggleCoupon(c.id)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    c.active ? "bg-green-600" : "bg-neutral-300"
                  }`}
                  aria-label={c.active ? `Tắt mã ${c.code}` : `Bật mã ${c.code}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                      c.active ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
                <button
                  onClick={() => remove(c)}
                  className="bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700"
                >
                  Xóa mã
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
