import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
const poppins = Poppins({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--font-heading", display: "swap" });
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import SiteChrome from "@/components/SiteChrome";
import CartDrawer from "@/components/CartDrawer";
export const metadata: Metadata = { title: "MONA Fashion — Bộ sưu tập Mùa xuân", description: "MONA Fashion - Cửa hàng thời trang trực tuyến", icons: { icon: "/icon.png" } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="vi"><body className={`${poppins.variable} ${montserrat.variable}`}><AuthProvider><CartProvider>
    <SiteChrome>{children}</SiteChrome><CartDrawer />
  </CartProvider></AuthProvider></body></html>);
}
