"use client";
/* Nhật ký hoạt động hệ thống — MỨC DEMO, LƯU TRÊN TRÌNH DUYỆT.
   Mỗi trình duyệt giữ một nhật ký riêng (key mona-activity-log), không
   đồng bộ sang máy khác và không ghi được thao tác làm trực tiếp trong
   CSDL. Chỉ tài khoản admin xem được trang này. */
import { useEffect, useState } from "react";
import { clearActivityLog, readActivityLog, type ActivityEntry } from "@/lib/activity";

export default function AdminActivity() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    setEntries(readActivityLog());
  }, []);

  const clear = () => {
    if (!confirm("Xoá toàn bộ nhật ký hoạt động? Hành động này không khôi phục được.")) return;
    clearActivityLog();
    setEntries([]);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Nhật ký hoạt động</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Lịch sử ai đã làm gì trong trang quản trị (đổi giá, duyệt đơn, xoá mã giảm giá…).
            Nhật ký chỉ lưu trên trình duyệt này, mỗi máy giữ một bản riêng.
          </p>
        </div>
        {entries.length > 0 && (
          <button onClick={clear} className="border bg-white px-4 py-2.5 text-sm text-red-600 hover:border-red-600">
            Xóa nhật ký
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm mt-6 overflow-x-auto">
        {entries.length === 0 ? (
          <p className="px-5 py-10 text-neutral-500 text-sm">
            Chưa có hoạt động nào được ghi lại. Từ giờ, các thay đổi trong quản trị (sản phẩm, đơn
            hàng, mã giảm giá, khách hàng, nhân sự, mật khẩu) sẽ hiện ở đây.
          </p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="px-5 py-3 font-medium">Thời gian</th>
                <th className="px-5 py-3 font-medium">Tài khoản</th>
                <th className="px-5 py-3 font-medium">Hành động</th>
                <th className="px-5 py-3 font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3 align-top whitespace-nowrap">
                    {new Date(e.time).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-5 py-3 align-top break-all">{e.email}</td>
                  <td className="px-5 py-3 align-top font-medium whitespace-nowrap">{e.action}</td>
                  <td className="px-5 py-3 align-top">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
