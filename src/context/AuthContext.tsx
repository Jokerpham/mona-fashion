"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { StaffRole } from "@/lib/roles";

export type User = { name: string; email: string; role?: StaffRole | "customer" };
type StoredUser = User & { password: string };

/* Tài khoản mẫu được tạo sẵn lần đầu chạy web (đổi/xoá trước khi bán thật).
   Hai tài khoản này không bao giờ bị trang Nhân sự đổi quyền hay xoá. */
const SEED_USERS: StoredUser[] = [
  { name: "Admin MONA", email: "admin@mona.local", password: "admin123", role: "admin" },
  { name: "Khách Demo", email: "demo@mona.local", password: "demo123", role: "customer" },
];

type AuthCtx = {
  user: User | null;
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (identifier: string, password: string, remember: boolean) => { ok: boolean; error?: string };
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => { ok: boolean; error?: string };
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
  /* Quản lý nhân sự (trang /admin/staff, chỉ tài khoản admin): tài khoản
     nhân sự lưu cùng kho mona-users, mức demo như tài khoản admin hiện tại
     (xem src/lib/roles.ts về giới hạn này). */
  listStaff: () => { name: string; email: string; role: StaffRole }[];
  createStaff: (name: string, email: string, password: string, role: StaffRole) => { ok: boolean; error?: string };
  updateStaff: (email: string, patch: { name?: string; role?: StaffRole; password?: string }) => { ok: boolean; error?: string };
  deleteStaff: (email: string) => { ok: boolean; error?: string };
};

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "mona-users";
const SESSION_KEY = "mona-session";

function loadUsers(): StoredUser[] {
  let users: StoredUser[] = [];
  try {
    users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    users = [];
  }
  // Bổ sung tài khoản mẫu nếu chưa có (admin + khách demo)
  let changed = false;
  for (const seed of SEED_USERS) {
    if (!users.some((u) => u.email.toLowerCase() === seed.email)) {
      users.push(seed);
      changed = true;
    }
  }
  if (changed) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
  }
  return users;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      if (s) setUser(JSON.parse(s));
    } catch {}
  }, []);

  const startSession = (u: User, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  const register: AuthCtx["register"] = (name, email, password) => {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "Email này đã được đăng ký. Vui lòng đăng nhập." };
    }
    const newUser: StoredUser = { name, email, password, role: "customer" };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    startSession({ name, email, role: "customer" }, true);
    return { ok: true };
  };

  const login: AuthCtx["login"] = (identifier, password, remember) => {
    const users = loadUsers();
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          u.name.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password
    );
    if (!found) {
      return {
        ok: false,
        error: "Sai tên tài khoản/email hoặc mật khẩu. Nếu chưa có tài khoản, hãy chọn tab Đăng ký.",
      };
    }
    startSession({ name: found.name, email: found.email, role: found.role || "customer" }, remember);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const changePassword: AuthCtx["changePassword"] = (currentPassword, newPassword) => {
    if (!user) return { ok: false, error: "Bạn cần đăng nhập trước khi đổi mật khẩu." };
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (!found) return { ok: false, error: "Không tìm thấy tài khoản này." };
    if (found.password !== currentPassword) {
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

  const resetPassword: AuthCtx["resetPassword"] = (email, newPassword) => {
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === "admin");
    if (!found) return { ok: false, error: "Không tìm thấy tài khoản quản trị với email này." };
    found.password = newPassword;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      return { ok: false, error: "Không lưu được mật khẩu mới. Hãy thử lại." };
    }
    return { ok: true };
  };

  const STAFF_ROLES: StaffRole[] = ["admin", "kho", "cskh", "bientap"];
  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const listStaff: AuthCtx["listStaff"] = () => {
    return loadUsers()
      .filter((u) => u.role === "admin" || u.role === "kho" || u.role === "cskh" || u.role === "bientap")
      .map((u) => ({ name: u.name, email: u.email, role: u.role as StaffRole }));
  };

  const createStaff: AuthCtx["createStaff"] = (name, email, password, role) => {
    const n = name.trim();
    const e = email.trim().toLowerCase();
    if (!n || !e || password.length < 6) {
      return { ok: false, error: "Hãy nhập đủ tên, email và mật khẩu từ 6 ký tự." };
    }
    if (!STAFF_ROLES.includes(role)) return { ok: false, error: "Chức danh không hợp lệ." };
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === e)) {
      return { ok: false, error: "Email này đã có tài khoản." };
    }
    users.push({ name: n, email: e, password, role });
    try {
      saveUsers(users);
    } catch {
      return { ok: false, error: "Không lưu được tài khoản." };
    }
    return { ok: true };
  };

  const updateStaff: AuthCtx["updateStaff"] = (email, patch) => {
    const e = email.trim().toLowerCase();
    // Tài khoản admin gốc không đổi quyền; không tự hạ quyền của chính mình.
    if (patch.role !== undefined && (e === "admin@mona.local" || e === user?.email?.toLowerCase())) {
      return { ok: false, error: "Không đổi được quyền của tài khoản này." };
    }
    if (patch.role !== undefined && !STAFF_ROLES.includes(patch.role)) {
      return { ok: false, error: "Chức danh không hợp lệ." };
    }
    if (patch.password !== undefined && patch.password.length < 6) {
      return { ok: false, error: "Mật khẩu mới cần từ 6 ký tự." };
    }
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === e);
    if (!found || found.role === "customer") {
      return { ok: false, error: "Không tìm thấy tài khoản nhân sự này." };
    }
    if (patch.name !== undefined) found.name = patch.name.trim() || found.name;
    if (patch.role !== undefined) found.role = patch.role;
    if (patch.password !== undefined) found.password = patch.password;
    try {
      saveUsers(users);
    } catch {
      return { ok: false, error: "Không lưu được thay đổi." };
    }
    // Đổi tên chính mình thì cập nhật luôn phiên đăng nhập đang mở.
    if (e === user?.email?.toLowerCase() && patch.name) {
      const next = { ...user, name: patch.name.trim() };
      try {
        if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
        if (sessionStorage.getItem(SESSION_KEY)) sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      } catch {}
      setUser(next);
    }
    return { ok: true };
  };

  const deleteStaff: AuthCtx["deleteStaff"] = (email) => {
    const e = email.trim().toLowerCase();
    if (e === "admin@mona.local") {
      return { ok: false, error: "Không xoá được tài khoản quản trị gốc." };
    }
    if (e === user?.email?.toLowerCase()) {
      return { ok: false, error: "Không tự xoá tài khoản đang đăng nhập." };
    }
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === e);
    if (!found || found.role === "customer") {
      return { ok: false, error: "Không tìm thấy tài khoản nhân sự này." };
    }
    try {
      saveUsers(users.filter((u) => u.email.toLowerCase() !== e));
    } catch {
      return { ok: false, error: "Không xoá được tài khoản." };
    }
    return { ok: true };
  };

  return <Ctx.Provider value={{ user, register, login, logout, changePassword, resetPassword, listStaff, createStaff, updateStaff, deleteStaff }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};
