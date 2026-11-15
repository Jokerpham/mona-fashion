"use client";
import { useSubscribers } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";

export default function AdminSubscribers() {
  const { subscribers, deleteSubscriber } = useSubscribers();
  const { user } = useAuth();

  const copyAll = () => {
    const text = subscribers.map((s) => s.email).join(", ");
    if (text) navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Email đăng ký tư vấn</h1>
          <p className="text-sm text-neutral-500 mt-1">Khách nhập email ở banner "Nhận tư vấn miễn phí" cuối trang sẽ lưu về đây.</p>
        </div>
        {subscribers.length > 0 && (
          <button onClick={copyAll} className="border bg-white px-4 py-2.5 text-sm hover:border-black">Sao chép tất cả email</button>
        )}
      </div>

      <div className="bg-white shadow-sm mt-6 overflow-x-auto">
        {subscribers.length === 0 ? (
          <p className="px-5 py-10 text-neutral-500 text-sm">Chưa có email nào đăng ký.</p>
        ) : (
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Ngày đăng ký</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.email} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3 align-top font-medium">{s.email}</td>
                  <td className="px-5 py-3 align-top">{new Date(s.date).toLocaleString("vi-VN")}</td>
                  <td className="px-5 py-3 align-top text-right">
                    <button onClick={() => { if (confirm(`Xoá email ${s.email}?`)) { deleteSubscriber(s.email); logActivity(user?.email, "Xoá email đăng ký", `Xoá ${s.email}.`); } }} className="underline text-red-600">Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
