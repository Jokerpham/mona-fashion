"use client";
/* Quản lý nhân sự — MỨC DEMO, LƯU TRÊN TRÌNH DUYỆT.
   Tài khoản nhân sự lưu cùng kho mona-users như tài khoản admin (xem
   src/lib/roles.ts về giới hạn này). Chỉ tài khoản admin vào được trang
   này. Tài khoản admin gốc (admin@mona.local) không đổi quyền, không xoá;
   không tự hạ quyền hay tự xoá tài khoản đang đăng nhập. */
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, type StaffRole } from "@/lib/roles";
import { logActivity } from "@/lib/activity";

type Row = { name: string; email: string; role: StaffRole };
type Form = { name: string; email: string; password: string; showPassword: boolean; role: StaffRole };
const EMPTY: Form = { name: "", email: "", password: "", showPassword: false, role: "kho" };
const ROLES: StaffRole[] = ["admin", "kho", "cskh", "bientap"];

export default function AdminStaff() {
  const { user, listStaff, createStaff, updateStaff, deleteStaff } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = () => setRows(listStaff());
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setShowForm(true);
  };
  const openEdit = (r: Row) => {
    setEditing(r);
    setForm({ name: r.name, email: r.email, password: "", showPassword: false, role: r.role });
    setError("");
    setShowForm(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const patch: { name?: string; role?: StaffRole; password?: string } = {};
      if (form.name.trim() && form.name.trim() !== editing.name) patch.name = form.name.trim();
      if (form.role !== editing.role) patch.role = form.role;
      if (form.password) patch.password = form.password;
      if (Object.keys(patch).length === 0) {
        setError("Chưa thay đổi gì.");
        return;
      }
      const r = updateStaff(editing.email, patch);
      if (!r.ok) {
        setError(r.error || "Không lưu được thay đổi.");
        return;
      }
      if (patch.role) logActivity(user?.email, "Đổi quyền nhân sự", `${editing.email}: ${ROLE_LABELS[editing.role]} → ${ROLE_LABELS[patch.role]}.`);
      if (patch.password) logActivity(user?.email, "Đặt lại mật khẩu nhân sự", `Đặt lại mật khẩu cho ${editing.email}.`);
      if (patch.name) logActivity(user?.email, "Sửa nhân sự", `Đổi tên ${editing.email} thành "${patch.name}".`);
      setNotice(`Đã lưu thay đổi cho ${editing.email}.`);
      setShowForm(false);
      refresh();
      return;
    }
    const r = createStaff(form.name, form.email, form.password, form.role);
    if (!r.ok) {
      setError(r.error || "Không tạo được tài khoản.");
      return;
    }
    logActivity(user?.email, "Tạo nhân sự", `Tạo ${form.email} (${ROLE_LABELS[form.role]}).`);
    setNotice(`Đã tạo tài khoản ${form.email.trim().toLowerCase()}.`);
    setShowForm(false);
    refresh();
  };

  const remove = (r: Row) => {
    if (!confirm(`Xoá tài khoản nhân sự "${r.email}"?`)) return;
    const res = deleteStaff(r.email);
    if (!res.ok) {
      setError(res.error || "Không xoá được tài khoản.");
      return;
    }
    logActivity(user?.email, "Xoá nhân sự", `Xoá ${r.email} (${ROLE_LABELS[r.role]}).`);
    setNotice(`Đã xoá tài khoản ${r.email}.`);
    refresh();
  };

  const field = "border w-full px-3 py-2.5 outline-none focus:border-black bg-white";
  const label = "block text-sm mb-1 font-medium";
  const isProtected = (r: Row) => r.email.toLowerCase() === "admin@mona.local";
  const isSelf = (r: Row) => r.email.toLowerCase() === user?.email?.toLowerCase();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Nhân sự</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Tài khoản quản trị và nhân viên (kho, CSKH, biên tập) — mỗi người chỉ thấy đúng mục
            được phân quyền. Tài khoản chỉ lưu trên trình duyệt này (bản demo).
          </p>
        </div>
        <button onClick={openAdd} className="bg-black font-heading text-white px-4 py-2.5 text-sm tracking-wider hover:bg-neutral-800">
          + THÊM NHÂN SỰ
        </button>
      </div>

      {notice && <p className="bg-green-50 text-green-800 text-sm px-4 py-3 mt-6">{notice}</p>}
      {error && <p className="bg-red-50 text-red-700 text-sm px-4 py-3 mt-6">{error}</p>}

      {showForm && (
        <form onSubmit={submit} className="bg-white shadow-sm p-5 md:p-6 mt-6">
          <h2 className="font-medium mb-4">{editing ? `Sửa nhân sự: ${editing.email}` : "Thêm nhân sự mới"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Tên *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="Ví dụ: Nguyễn Văn Kho" />
            </div>
            <div>
              <label className={label}>Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
                placeholder="kho@mona.local"
                disabled={!!editing}
              />
            </div>
            <div>
              <label className={label}>{editing ? "Mật khẩu mới (để trống nếu giữ nguyên)" : "Mật khẩu *"}</label>
              <div className="flex gap-2">
                <input
                  required={!editing}
                  type={form.showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={field}
                  placeholder="Từ 6 ký tự"
                />
                <button type="button" onClick={() => setForm({ ...form, showPassword: !form.showPassword })} className="border bg-white px-3 text-sm hover:border-black shrink-0">
                  {form.showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>
            <div>
              <label className={label}>Chức danh *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}
                className={field}
                disabled={!!editing && (isProtected(editing) || isSelf(editing))}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              {editing && (isProtected(editing) || isSelf(editing)) && (
                <p className="text-xs text-neutral-500 mt-1">Không đổi được quyền của tài khoản này.</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button className="bg-black font-heading text-white px-6 py-2.5 text-sm tracking-wider hover:bg-neutral-800">
              {editing ? "LƯU THAY ĐỔI" : "THÊM NHÂN SỰ"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border bg-white px-6 py-2.5 text-sm hover:border-black">
              Huỷ
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-sm mt-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-neutral-500 border-b">
              <th className="px-5 py-3 font-medium">Tên</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Chức danh</th>
              <th className="px-5 py-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.email} className="border-b last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3 align-top font-medium">{r.name}</td>
                <td className="px-5 py-3 align-top">{r.email}</td>
                <td className="px-5 py-3 align-top">{ROLE_LABELS[r.role]}</td>
                <td className="px-5 py-3 align-top text-right whitespace-nowrap">
                  <button onClick={() => openEdit(r)} className="underline mr-4">Sửa</button>
                  {!isProtected(r) && !isSelf(r) && (
                    <button onClick={() => remove(r)} className="underline text-red-600">Xoá</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-sm mt-6 p-5 text-sm text-neutral-600 leading-relaxed">
        <p className="font-medium text-neutral-900">Quyền theo chức danh</p>
        <ul className="mt-2 space-y-1">
          <li>• <b>Quản trị viên:</b> toàn bộ các mục.</li>
          <li>• <b>Nhân viên kho:</b> Tổng quan, Sản phẩm (chỉ sửa tồn kho), Đơn hàng (xem, đổi trạng thái, in).</li>
          <li>• <b>Nhân viên CSKH:</b> Tổng quan, Đơn hàng (xem, đổi trạng thái, in, tạo đơn thủ công), Khách hàng (xem), Tin nhắn liên hệ, Email đăng ký.</li>
          <li>• <b>Biên tập viên:</b> Tổng quan, Sản phẩm (tạo/sửa/xoá nội dung, xem tồn kho), Danh mục, Mã giảm giá.</li>
        </ul>
        <p className="mt-2">Tài khoản không có quyền vào một mục sẽ bị đưa về trang Tổng quan, và sidebar cũng ẩn mục đó.</p>
      </div>
    </div>
  );
}
