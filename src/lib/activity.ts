"use client";
/* Nhật ký hoạt động hệ thống — MỨC DEMO, LƯU TRÊN TRÌNH DUYỆT.
   Mỗi trình duyệt giữ một nhật ký riêng (key mona-activity-log), không
   đồng bộ sang máy khác và không ghi được thao tác làm trực tiếp trong
   CSDL. Người thực hiện là email tài khoản đang đăng nhập (AuthContext).
   Chỉ ghi thao tác trong trang quản trị: tạo/sửa/xoá sản phẩm, đổi trạng
   thái/xoá đơn, tạo/xoá mã giảm giá, xoá khách hàng, tạo/đổi quyền nhân
   sự, đổi mật khẩu. */

export type ActivityEntry = {
  id: string;
  time: string; // ISO
  email: string;
  action: string;
  detail: string;
};

export const ACTIVITY_KEY = "mona-activity-log";
const MAX_ENTRIES = 200;

export function readActivityLog(): ActivityEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function logActivity(email: string | undefined, action: string, detail: string) {
  try {
    const entry: ActivityEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      time: new Date().toISOString(),
      email: email || "Không rõ",
      action,
      detail,
    };
    const next = [entry, ...readActivityLog()].slice(0, MAX_ENTRIES);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
  } catch {}
}

export function clearActivityLog() {
  try {
    localStorage.removeItem(ACTIVITY_KEY);
  } catch {}
}
