"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOrders, useProducts, getSeenOrderIds, ORDERS_SEEN_EVENT } from "@/lib/store";
import {
  ADMIN_ROLES,
  canAccessSection,
  sectionForPath,
  sidebarTitle,
  type AdminSection,
  type StaffRole,
} from "@/lib/roles";
import AdminBell from "@/components/admin/AdminBell";
import AdminAvatar from "@/components/admin/AdminAvatar";

/* Icon nét mảnh đơn sắc cho menu sidebar (khớp bản demo, không dùng emoji). */
function MenuIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="w-5 h-5 shrink-0"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GridIcon() {
  return (
    <MenuIcon>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </MenuIcon>
  );
}

function BagIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 8h13l-1.2 12.2a1.5 1.5 0 01-1.5 1.3H8.2a1.5 1.5 0 01-1.5-1.3L5.5 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 10V6.5a3.5 3.5 0 017 0V10" />
    </MenuIcon>
  );
}

function DocIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h6l4 4v14H7V3z" />
      <path strokeLinecap="round" d="M9 13h6M9 17h6" />
    </MenuIcon>
  );
}

function UsersIcon() {
  return (
    <MenuIcon>
      <circle cx="9" cy="8" r="3.5" />
      <path strokeLinecap="round" d="M3.5 19a5.5 5.5 0 0111 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path strokeLinecap="round" d="M15.8 14.6a4.5 4.5 0 016.2 4.4" />
    </MenuIcon>
  );
}

function TagIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h8l9 9-8 8-9-9V3z" />
      <circle cx="8" cy="8" r="1.5" />
    </MenuIcon>
  );
}

function MailIcon() {
  return (
    <MenuIcon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7l8.5 6 8.5-6" />
    </MenuIcon>
  );
}

function SendIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </MenuIcon>
  );
}

function ChartIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" d="M4 20V11M10 20V4M16 20v-7M2 20h20" />
    </MenuIcon>
  );
}

/* Danh mục: icon lớp xếp chồng (bộ sưu tập). */
function LayersIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 5-9 5-9-5 9-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l9 5 9-5" />
    </MenuIcon>
  );
}

/* Nhân sự: người + dấu cộng. */
function StaffIcon() {
  return (
    <MenuIcon>
      <circle cx="9" cy="8" r="3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 19a5.5 5.5 0 0111 0" />
      <path strokeLinecap="round" d="M16 4v6M13 7h6" />
    </MenuIcon>
  );
}

/* Nhật ký hoạt động: đồng hồ. */
function ClockIcon() {
  return (
    <MenuIcon>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </MenuIcon>
  );
}

function GearIcon() {
  return (
    <MenuIcon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828c-.424-.35-.534-.954-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </MenuIcon>
  );
}

function HamburgerIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </MenuIcon>
  );
}

function CloseIcon() {
  return (
    <MenuIcon>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </MenuIcon>
  );
}

const NAV: { href: string; label: string; icon: ReactNode; section: AdminSection }[] = [
  { href: "/admin", label: "Tổng quan", icon: <GridIcon />, section: "dashboard" },
  { href: "/admin/products", label: "Sản phẩm", icon: <BagIcon />, section: "products" },
  { href: "/admin/categories", label: "Danh mục", icon: <LayersIcon />, section: "categories" },
  { href: "/admin/orders", label: "Đơn hàng", icon: <DocIcon />, section: "orders" },
  { href: "/admin/customers", label: "Khách hàng", icon: <UsersIcon />, section: "customers" },
  { href: "/admin/staff", label: "Nhân sự", icon: <StaffIcon />, section: "staff" },
  { href: "/admin/coupons", label: "Mã giảm giá", icon: <TagIcon />, section: "coupons" },
  { href: "/admin/messages", label: "Tin nhắn liên hệ", icon: <MailIcon />, section: "messages" },
  { href: "/admin/subscribers", label: "Email đăng ký", icon: <SendIcon />, section: "subscribers" },
  { href: "/admin/reports", label: "Báo cáo doanh thu", icon: <ChartIcon />, section: "reports" },
  { href: "/admin/activity", label: "Nhật ký hoạt động", icon: <ClockIcon />, section: "activity" },
  { href: "/admin/settings", label: "Cài đặt & Bảo mật", icon: <GearIcon />, section: "settings" },
];

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 9l3 3m0 0l-3 3m3-3H9"
      />
    </svg>
  );
}

// Icon con mắt: mở khi đang hiện mật khẩu, gạch chéo khi đang ẩn
// (cùng mẫu với trang /account).
function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      )}
    </svg>
  );
}

function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email.trim(), password, true);
    if (!res.ok) {
      setError(res.error || "Đăng nhập thất bại.");
      return;
    }
    // Kiểm tra quyền: tài khoản admin và nhân sự (kho/cskh/biên tập) mới
    // vào được; tài khoản khách hàng vẫn bị chặn ở đây.
    try {
      const s = JSON.parse(localStorage.getItem("mona-session") || "null");
      if (!s || !ADMIN_ROLES.includes(s.role)) {
        setError("Tài khoản này không có quyền quản trị. Hãy dùng tài khoản admin hoặc nhân sự.");
      }
    } catch {
      setError("Không kiểm tra được quyền truy cập.");
    }
  };

  return (
    <div className="min-h-screen bg-[#171a21] flex items-center justify-center px-4">
      <form onSubmit={submit} className="bg-white w-full max-w-sm p-8 shadow-xl">
        <p className="text-center text-2xl tracking-[0.35em] font-light">MONA</p>
        <p className="text-center text-[10px] tracking-[0.5em] mt-1 text-neutral-500">FASHION — QUẢN TRỊ</p>
        <h1 className="text-lg font-medium mt-8 mb-4">Đăng nhập quản trị</h1>
        {error && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 mb-4">{error}</p>}
        <label className="block text-sm mb-1">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mona.local" className="border w-full px-3 py-2.5 mb-4 outline-none focus:border-black" />
        <label className="block text-sm mb-1">Mật khẩu</label>
        <div className="relative mb-6">
          <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="border w-full px-3 py-2.5 pr-10 outline-none focus:border-black" />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-black"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        <button className="bg-black font-heading text-white w-full py-3 tracking-[0.2em] text-sm hover:bg-neutral-800 transition-colors">ĐĂNG NHẬP</button>
        <Link href="/admin/forgot-password" className="block text-center text-sm underline mt-4">Quên mật khẩu?</Link>
        <Link href="/" className="block text-center text-sm underline mt-5">← Về trang chủ shop</Link>
      </form>
    </div>
  );
}

type SidebarProps = {
  pathname: string;
  avatarName: string;
  title: string;
  email: string;
  nav: typeof NAV;
  lowStock: boolean;
  newOrderCount: number;
  onLogout: () => void;
  onNavigate?: () => void;
};

/* Nội dung sidebar dùng chung cho desktop và drawer mobile: logo, khối quản
   trị viên ở trên cùng, nút về shop, rồi menu theo đúng thứ tự bản demo.
   Menu đã lọc theo quyền của tài khoản đang đăng nhập. */
function SidebarContent({ pathname, avatarName, title, email, nav, lowStock, newOrderCount, onLogout, onNavigate }: SidebarProps) {
  const badgeFor = (href: string) => {
    if (href === "/admin/products" && lowStock) {
      return (
        <span className="ml-auto bg-amber-400 text-black text-[11px] font-bold leading-none px-1.5 py-1 rounded-full" title="Có sản phẩm sắp hết hàng">
          !
        </span>
      );
    }
    if (href === "/admin/orders" && newOrderCount > 0) {
      return (
        <span className="ml-auto bg-red-600 text-white text-[11px] leading-none px-1.5 py-1 rounded-full">
          {newOrderCount}
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <div className="px-5 pt-7 pb-2">
        <p className="text-[28px] leading-none tracking-[0.35em] font-semibold">MONA</p>
        <p className="text-[10px] tracking-[0.35em] text-white/60 mt-2">FASHION - QUẢN TRỊ</p>
      </div>

      <div className="px-5 py-4 flex items-center gap-3">
        <AdminAvatar name={avatarName} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug">{title}</p>
          <p className="text-white/60 text-xs break-all">{email}</p>
        </div>
        <button onClick={onLogout} title="Đăng xuất" aria-label="Đăng xuất" className="text-white/70 hover:text-white shrink-0">
          <LogoutIcon />
        </button>
      </div>

      <div className="px-4 mt-1">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 rounded px-4 py-2.5 text-sm text-white"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden />
          <span className="flex-1">Xem giao diện Shop</span>
          <span aria-hidden>↗</span>
        </Link>
      </div>

      <nav className="flex-1 py-4">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 mx-3 px-3 py-2.5 rounded text-sm ${
                active ? "bg-[#f5f1e8] text-neutral-900 font-medium" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span aria-hidden className="shrink-0">{n.icon}</span>
              <span className="flex-1">{n.label}</span>
              {badgeFor(n.href)}
            </Link>
          );
        })}
      </nav>

      {/* Dòng credit cuối sidebar, dưới mục Cài đặt & Bảo mật. */}
      <p className="px-5 pb-5 pt-2 text-center text-[11px] leading-relaxed text-white/45">
        © Thiết kế website và lập trình bởi{" "}
        <span className="text-violet-400">MONA .Media</span>
        {" / "}
        <span className="text-violet-400">Web design</span>
      </p>
    </>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { products } = useProducts();
  const { orders } = useOrders();
  /* Số đơn chờ xác nhận ở menu chỉ đếm đơn CHƯA xem. Mở trang Đơn hàng thì
     các đơn đang hiện được đánh dấu đã xem nên số biến mất; chưa vào thì
     vẫn hiển thị. Đọc sau khi mount để tránh lệch khi render ở server. */
  const [seenOrderIds, setSeenOrderIds] = useState<string[]>([]);
  useEffect(() => {
    setSeenOrderIds(getSeenOrderIds());
    const onSeen = () => setSeenOrderIds(getSeenOrderIds());
    window.addEventListener(ORDERS_SEEN_EVENT, onSeen);
    return () => window.removeEventListener(ORDERS_SEEN_EVENT, onSeen);
  }, []);

  // Badge menu: "!" khi bất kỳ size nào tồn kho <= 5; số đơn chờ xác nhận chưa xem.
  const lowStock = products.some((p) => (p.sizeStocks ?? []).some((s) => s.stock <= 5));
  const newOrderCount = orders.filter((o) => o.status === "Chờ xác nhận" && !seenOrderIds.includes(o.id)).length;

  useEffect(() => {
    const t = setTimeout(() => setChecked(true), 250);
    return () => clearTimeout(t);
  }, []);

  // Chặn theo quyền: tài khoản không có quyền vào mục hiện tại thì về /admin.
  useEffect(() => {
    if (!checked || !user) return;
    const section = sectionForPath(pathname);
    if (section && !canAccessSection(user.role, section)) {
      router.replace("/admin");
    }
  }, [checked, user, pathname, router]);

  // Đóng drawer mobile khi chuyển trang (kể cả khi bị chặn quyền đẩy về /admin).
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === "/admin/forgot-password") return <>{children}</>;
  if (!checked) {
    return <div className="min-h-screen bg-[#171a21] text-white grid place-items-center">Đang tải trang quản trị…</div>;
  }
  if (!user || !ADMIN_ROLES.includes(user.role as StaffRole)) return <AdminLogin />;

  const visibleNav = NAV.filter((n) => canAccessSection(user.role, n.section));
  const canSeeMessages = canAccessSection(user.role, "messages");
  const sidebarProps = {
    pathname,
    avatarName: user.name,
    title: sidebarTitle(user.role),
    email: user.email,
    nav: visibleNav,
    lowStock,
    newOrderCount,
    onLogout: logout,
  };

  return (
    <div className="min-h-screen bg-[#f4f4f2] flex flex-col md:flex-row">
      {/* Thanh bên (desktop) */}
      <aside className="hidden md:flex md:w-80 shrink-0 bg-[#171a21] text-white flex-col min-h-screen sticky top-0">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Thanh trên + drawer (mobile) */}
      <div className="md:hidden bg-[#171a21] text-white px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} aria-label="Mở menu quản trị" className="p-1 text-white">
            <HamburgerIcon />
          </button>
          <p className="tracking-[0.3em] font-light">
            MONA <span className="text-[10px] tracking-[0.3em] text-white/60">QUẢN TRỊ</span>
          </p>
        </div>
        {canSeeMessages && <AdminBell />}
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-[#171a21] text-white flex flex-col overflow-y-auto shadow-xl">
            <div className="flex justify-end px-4 pt-3">
              <button onClick={() => setMobileOpen(false)} aria-label="Đóng menu" className="p-1 text-white/70 hover:text-white">
                <CloseIcon />
              </button>
            </div>
            <SidebarContent {...sidebarProps} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="hidden md:flex items-center justify-between px-10 py-3 bg-white border-b sticky top-0 z-30">
          <p className="text-sm text-neutral-500">Khu vực quản trị — MONA Fashion</p>
          {canSeeMessages && <AdminBell />}
        </div>
        <main className="flex-1 min-w-0 px-4 py-6 md:px-10 md:py-9">{children}</main>
      </div>
    </div>
  );
}
