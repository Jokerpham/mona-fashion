"use client";
/* Hệ thống đăng nhập RIÊNG cho khu vực quản trị (/admin), tách hẳn với
   tài khoản khách hàng của shop.
   - Phiên admin lưu riêng ở localStorage key "admin_session", KHÔNG dùng
     chung "mona-session" của khách. Đăng nhập /admin không ảnh hưởng phiên
     mua sắm ngoài shop, và ngược lại.
   - Tài khoản quản trị cứng trong code: admin@mona.local / admin123 —
     đăng nhập được ngay vào /admin, kể cả khi mật khẩu admin trong kho
     mona-users đã bị đổi trước đây (lỗi "sai tài khoản" gặp ngày 17/11).
   - Tài khoản nhân sự (kho/cskh/bientap) trong kho mona-users vẫn đăng
     nhập được vào /admin; tài khoản khách hàng (customer) bị chặn.
   - user có cùng hình dạng { name, email, role, phone? } như AuthContext
     để các trang /admin dùng chung cách đọc user?.role / user?.email. */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ADMIN_ROLES, type StaffRole } from "@/lib/roles";
import { useAuth } from "@/context/AuthContext";

export type AdminUser = { name: string; email: string; role: StaffRole; phone?: string };

const ADMIN_SESSION_KEY = "admin_session";
const USERS_KEY = "mona-users";

/* Tài khoản quản trị cứng — luôn đăng nhập được vào /admin. */
const HARDCODED_ADMIN = {
  name: "Admin MONA",
  email: "admin@mona.local",
  password: "admin123",
  role: "admin" as StaffRole,
  phone: "0313728397",
};

type StoredUser = { name: string; email: string; role: StaffRole | "customer"; phone?: string; password: string };

/* Đọc kho tài khoản (dùng chung key mona-users với shop, nhưng chỉ để
   tra cứu nhân sự). Đảm bảo tài khoản quản trị cứng luôn có trong kho để
   đổi mật khẩu / quản lý nhân sự tìm thấy; không ghi đè nếu đã có. */
function loadUsers(): StoredUser[] {
  let users: StoredUser[] = [];
  try {
    users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    users = [];
  }
  if (!users.some((u) => u.email.toLowerCase() === HARDCODED_ADMIN.email)) {
    users.push({ ...HARDCODED_ADMIN });
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
  }
  return users;
}

type AdminAuthCtx = {
  user: AdminUser | null;
  adminLogin: (email: string, password: string) => { ok: boolean; error?: string };
  adminLogout: () => void;
  changeAdminPassword: (currentPassword: string, newPassword: string) => { ok: boolean; error?: string };
  listStaff: () => { name: string; email: string; role: StaffRole; phone?: string }[];
  createStaff: (name: string, email: string, password: string, role: StaffRole, phone?: string) => { ok: boolean; error?: string };
  updateStaff: (email: string, patch: { name?: string; role?: StaffRole; password?: string; phone?: string }) => { ok: boolean; error?: string };
  deleteStaff: (email: string) => { ok: boolean; error?: string };
};

const Ctx = createContext<AdminAuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(ADMIN_SESSION_KEY);
      if (s) {
        const parsed = JSON.parse(s) as AdminUser;
        // Chỉ nhận phiên có quyền nhân sự; phiên lạ thì bỏ.
        if (parsed && ADMIN_ROLES.includes(parsed.role)) setAdmin(parsed);
        else localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch {}
  }, []);

  const startSession = (u: AdminUser) => {
    try {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(u));
    } catch {}
    setAdmin(u);
  };

  const adminLogin: AdminAuthCtx["adminLogin"] = (email, password) => {
    const e = email.trim().toLowerCase();
    // 1. Tài khoản quản trị cứng — luôn đúng, kể cả khi mật khẩu admin
    // trong kho mona-users đã bị đổi trước đây.
    if (e === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
      startSession({
        name: HARDCODED_ADMIN.name,
        email: HARDCODED_ADMIN.email,
        role: "admin",
        phone: HARDCODED_ADMIN.phone,
      });
      return { ok: true };
    }
    // 2. Tài khoản nhân sự trong kho mona-users (kho/cskh/bientap).
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === e && u.password === password);
    if (found) {
      if (found.role === "customer" || !ADMIN_ROLES.includes(found.role as StaffRole)) {
        return { ok: false, error: "Tài khoản này không có quyền quản trị. Hãy dùng tài khoản admin hoặc nhân sự." };
      }
      startSession({ name: found.name, email: found.email, role: found.role as StaffRole, phone: found.phone });
      return { ok: true };
    }
    return { ok: false, error: "Sai tên tài khoản/email hoặc mật khẩu." };
  };

  const adminLogout = () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
    setAdmin(null);
  };

  /* Đổi mật khẩu của tài khoản admin đang đăng nhập. Mật khẩu hiện tại
     chấp nhận cả mật khẩu trong kho mona-users lẫn mật khẩu cứng admin123
     (để đổi được ngay cả khi mật khẩu trong kho đã bị đổi trước đây). */
  const changeAdminPassword: AdminAuthCtx["changeAdminPassword"] = (currentPassword, newPassword) => {
    if (!admin) return { ok: false, error: "Bạn cần đăng nhập trước khi đổi mật khẩu." };
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === admin.email.toLowerCase());
    if (!found) return { ok: false, error: "Không tìm thấy tài khoản này." };
    const currentOk =
      found.password === currentPassword ||
      (admin.email.toLowerCase() === HARDCODED_ADMIN.email && currentPassword === HARDCODED_ADMIN.password);
    if (!currentOk) {
      return { ok: false, error: "Mật khẩu hiện tại không đúng." };
    }
    found.password = newPassword;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      return { ok: false, error: "Không lưu được mật khẩu mới. Hãy thử lại." };
    }
    return { ok: true };
  };

  return (
    <Ctx.Provider
      value={{
        user: admin,
        adminLogin,
        adminLogout,
        changeAdminPassword,
        listStaff: auth.listStaff,
        createStaff: auth.createStaff,
        /* Chuyển quyền/email của admin đang đăng nhập cho các hàm quản lý
           nhân sự để chốt chặn SĐT (chỉ admin) và tự sửa/xoá chính mình. */
        updateStaff: (email, patch) =>
          auth.updateStaff(email, patch, { isAdmin: admin?.role === "admin", email: admin?.email ?? "" }),
        deleteStaff: (email) => auth.deleteStaff(email, admin?.email ?? ""),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAdminAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return c;
};
