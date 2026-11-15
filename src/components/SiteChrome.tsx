"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* Bọc toàn site: trong khu vực /admin thì ẩn Header/Footer của shop
   để trang quản trị có giao diện riêng toàn màn hình */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
