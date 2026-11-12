"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
const nav = [{label:"TRANG CHỦ",href:"/"},{label:"SHOP",href:"/shop"},{label:"VỀ CHÚNG TÔI",href:"/about"},{label:"MONA",href:"/",logo:true},{label:"COMING SOON",href:"/coming-soon"},{label:"TIN TỨC",href:"/blog"},{label:"LIÊN HỆ",href:"/contact"}];
/* Icon vẽ nét (outline) giống hệt bản gốc: kính lúp tìm kiếm, người dùng, túi mua hàng */
const SearchIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[22px] h-[22px]"><circle cx="11" cy="11" r="7" /><path d="M16.3 16.3 L21 21" /></svg>);
const UserIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="w-[23px] h-[23px]"><circle cx="12" cy="8" r="3.8" /><path d="M4.9 20.1c1-3.7 3.7-5.6 7.1-5.6s6.1 1.9 7.1 5.6" /></svg>);
const BagIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[23px] h-[23px]"><path d="M4.6 9h14.8l-1 11a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4.6 9Z" /><path d="M9 9V7.2a3 3 0 0 1 6 0V9" /></svg>);
const CloseIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-7 h-7"><path d="M5 5l14 14M19 5L5 19" /></svg>);
const QUICK = ["Áo khoác", "Túi", "Giày", "Áo thun", "Mũ"];

export default function Header(){
  const pathname = usePathname();
  const router = useRouter();
  const {count,setOpen}=useCart();
  const {user}=useAuth();
  /* Trạng thái ô tìm kiếm (Modal Search) */
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  /* Header trong suốt đè lên Hero ở đầu trang chủ; cuộn xuống thì chuyển nền trắng đặc
     và dính trên cùng (fixed). Chữ menu trắng nổi trên ảnh nhờ lớp phủ tối ở đầu Hero
     và text-shadow, nên chữ không bị chìm vào ảnh */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const onHome = pathname === "/";
  const overlay = onHome && !scrolled; // đang trong suốt, đè lên ảnh hero

  // Mở ô tìm kiếm: tự đặt con trỏ vào ô nhập; đóng bằng phím Esc
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false); };
      window.addEventListener("keydown", onKey);
      return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
    }
  }, [searchOpen]);

  const submitSearch = (value: string) => {
    const v = value.trim();
    setSearchOpen(false);
    router.push(v ? `/shop?q=${encodeURIComponent(v)}` : "/shop");
  };

  return (<>
    <header className={
      onHome
        ? scrolled
          ? "fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur shadow-md transition-all duration-300"
          : "absolute inset-x-0 top-0 z-50 bg-transparent transition-all duration-300"
        : `relative z-40 ${pathname === "/contact" ? "bg-[#e4e9ec]" : "bg-beige"}`
    }>
      <div className={`container-x flex items-center justify-between py-5 ${overlay ? "text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]" : "text-[#2e2a24]"}`}>
        <button aria-label="Tìm kiếm" className="cursor-pointer" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.18em] font-medium font-heading">
          {nav.map((n,i)=> n.logo ? <Link key={i} href="/" className="text-center leading-none mx-2"><span className="text-2xl tracking-[0.35em] font-light">MONA</span><span className="block text-[8px] tracking-[0.5em] mt-1">FASHION</span></Link> : <Link key={i} href={n.href} className="hover:underline underline-offset-4">{n.label}</Link>)}
        </nav>
        <Link href="/" className="md:hidden text-xl tracking-[0.3em]">MONA</Link>
        <div className="flex items-center gap-4">
          <Link href="/account" aria-label="Tài khoản của tôi" className="cursor-pointer flex items-center" title={user ? user.name : "Đăng nhập / Đăng ký"}><UserIcon />{user && <span className="hidden md:inline text-xs ml-1 max-w-[90px] truncate align-middle">{user.name}</span>}</Link>
          <button onClick={()=>setOpen(true)} aria-label="Giỏ hàng" className="relative cursor-pointer"><BagIcon /><span className="absolute -top-2 -right-2.5 bg-[#4d4d4d] text-white text-[10px] min-w-[18px] h-[18px] px-0.5 rounded-full grid place-items-center leading-none">{count}</span></button>
        </div>
      </div>
      <nav className={`md:hidden flex justify-center gap-4 text-[10px] tracking-widest pb-3 font-heading ${overlay ? "text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]" : "text-[#2e2a24]"}`}>{nav.filter(n=>!n.logo).map((n,i)=><Link key={i} href={n.href}>{n.label}</Link>)}</nav>
    </header>

    {/* ===== MODAL SEARCH: trượt từ trên xuống khi bấm kính lúp ===== */}
    {/* Lớp phủ tối phía sau — bấm vào đây để đóng */}
    <div
      onClick={() => setSearchOpen(false)}
      className={`fixed inset-0 z-[55] bg-black/40 transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!searchOpen}
    />
    {/* Thanh tìm kiếm trượt xuống */}
    <div
      className={`fixed inset-x-0 top-0 z-[60] bg-white shadow-xl transition-transform duration-500 ease-out ${searchOpen ? "translate-y-0" : "-translate-y-full"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm"
    >
      <div className="container-x py-8 md:py-10 relative">
        <button
          onClick={() => setSearchOpen(false)}
          aria-label="Đóng tìm kiếm"
          className="absolute right-4 top-4 md:right-6 md:top-5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
        >
          <CloseIcon />
        </button>
        <form
          onSubmit={(e) => { e.preventDefault(); submitSearch(term); }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 border-b-2 border-neutral-800 pb-3">
            <span className="text-neutral-500"><SearchIcon /></span>
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 bg-transparent outline-none text-xl md:text-2xl font-light placeholder:text-neutral-400"
            />
            <button type="submit" className="bg-black font-heading text-white text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-neutral-800 transition-colors cursor-pointer">
              Tìm kiếm
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 text-sm text-neutral-500">
            <span>Gợi ý:</span>
            {QUICK.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => submitSearch(k)}
                className="border border-neutral-300 rounded-full px-3 py-1 text-[13px] text-neutral-600 hover:border-black hover:text-black transition-colors cursor-pointer"
              >
                {k}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  </>);
}
