import { redirect } from "next/navigation";

// Trang đổi mật khẩu cũ nay chuyển về trang Cài đặt & Bảo mật (giữ đường link cũ không bị gãy).
export default function AdminPasswordRedirect() {
  redirect("/admin/settings");
}
