"use client";
/* Quản lý danh mục sản phẩm: đọc bảng categories có sẵn trong CSDL.
   Slug là định danh liên kết với sản phẩm nên chỉ đặt lúc tạo, về sau
   chỉ sửa tên hiển thị. Xoá danh mục còn sản phẩm sẽ bị chặn để không
   đứt liên kết (API trả lỗi, trang hiện lỗi đó). */
import { useState } from "react";
import { useCategories, slugify, type Category } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";

type Form = { name: string; slug: string };
const EMPTY: Form = { name: "", slug: "" };

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setShowForm(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug });
    setError("");
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError("Hãy nhập tên danh mục.");
      return;
    }
    try {
      if (editing) {
        await updateCategory(editing.id, name);
        logActivity(user?.email, "Sửa danh mục", `Đổi tên "${editing.name}" thành "${name}".`);
        setNotice(`Đã đổi tên danh mục thành "${name}".`);
      } else {
        const slug = form.slug.trim() || slugify(name);
        await addCategory({ name, slug });
        logActivity(user?.email, "Tạo danh mục", `Tạo "${name}" (/${slug}).`);
        setNotice(`Đã thêm danh mục "${name}".`);
      }
      setShowForm(false);
    } catch (err: any) {
      setError(err?.message || "Không lưu được danh mục.");
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Xoá danh mục "${c.name}"?`)) return;
    try {
      await deleteCategory(c.id);
      logActivity(user?.email, "Xoá danh mục", `Xoá "${c.name}" (/${c.slug}).`);
      setNotice(`Đã xoá danh mục "${c.name}".`);
    } catch (err: any) {
      setError(err?.message || "Không xoá được danh mục.");
    }
  };

  const field = "border w-full px-3 py-2.5 outline-none focus:border-black bg-white";
  const label = "block text-sm mb-1 font-medium";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Danh mục</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Phân loại sản phẩm (ví dụ: Áo, Quần, Phụ kiện). Đường dẫn (slug) đặt lúc tạo sẽ giữ
            nguyên để không đứt liên kết với sản phẩm.
          </p>
        </div>
        <button onClick={openAdd} className="bg-black font-heading text-white px-4 py-2.5 text-sm tracking-wider hover:bg-neutral-800">
          + THÊM DANH MỤC
        </button>
      </div>

      {notice && <p className="bg-green-50 text-green-800 text-sm px-4 py-3 mt-6">{notice}</p>}
      {error && <p className="bg-red-50 text-red-700 text-sm px-4 py-3 mt-6">{error}</p>}

      {showForm && (
        <form onSubmit={submit} className="bg-white shadow-sm p-5 md:p-6 mt-6">
          <h2 className="font-medium mb-4">{editing ? `Sửa danh mục: ${editing.name}` : "Thêm danh mục mới"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Tên danh mục *</label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })
                }
                className={field}
                placeholder="Ví dụ: Áo"
              />
            </div>
            <div>
              <label className={label}>Đường dẫn (slug){editing ? " — không đổi được" : ""}</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={field}
                placeholder="ao"
                disabled={!!editing}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button className="bg-black font-heading text-white px-6 py-2.5 text-sm tracking-wider hover:bg-neutral-800">
              {editing ? "LƯU THAY ĐỔI" : "THÊM DANH MỤC"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border bg-white px-6 py-2.5 text-sm hover:border-black">
              Huỷ
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-sm mt-6 overflow-x-auto">
        {categories.length === 0 ? (
          <p className="px-5 py-10 text-neutral-500 text-sm">Chưa có danh mục nào. Bấm “+ THÊM DANH MỤC” để tạo.</p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="px-5 py-3 font-medium">Tên danh mục</th>
                <th className="px-5 py-3 font-medium">Đường dẫn (slug)</th>
                <th className="px-5 py-3 font-medium">Số sản phẩm</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3 align-top font-medium">{c.name}</td>
                  <td className="px-5 py-3 align-top text-neutral-500">/{c.slug}</td>
                  <td className="px-5 py-3 align-top">{c.productCount}</td>
                  <td className="px-5 py-3 align-top text-right whitespace-nowrap">
                    <button onClick={() => openEdit(c)} className="underline mr-4">Sửa</button>
                    <button onClick={() => remove(c)} className="underline text-red-600">Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
