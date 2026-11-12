"use client";
/* Chuông thông báo ở thanh trên cùng của trang quản trị: bấm vào mở panel
   liệt kê các tin nhắn đã gửi đến, bấm từng tin thì sang trang Tin nhắn và
   mở đúng tin đó để xem chi tiết / trả lời. */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMessages, getDismissedMessageIds, dismissMessages } from "@/lib/store";

export default function AdminBell() {
  const { messages } = useMessages();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  /* "Xóa hết" chỉ ẩn thông báo khỏi chuông, tin nhắn gốc vẫn còn ở trang
     Tin nhắn liên hệ. Đọc sau khi mount để tránh lệch khi render ở server. */
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  useEffect(() => {
    setDismissedIds(getDismissedMessageIds());
  }, []);
  const visible = messages.filter((m) => !dismissedIds.includes(m.id));
  const clearAll = () => {
    dismissMessages(visible.map((m) => m.id));
    setDismissedIds(getDismissedMessageIds());
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open ]);

  const openMessage = (id: string) => {
    setOpen(false);
    router.push(`/admin/messages?id=${encodeURIComponent(id)}`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Thông báo"
        title="Thông báo"
        className="relative w-10 h-10 grid place-items-center bg-white border shadow-sm hover:border-black text-lg"
      >
        🔔
        {visible.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] leading-none px-1.5 py-1 rounded-full">
            {visible.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white shadow-xl border z-50 text-neutral-900 text-left">
          <div className="px-4 py-3 border-b flex items-center justify-between gap-2">
            <p className="font-medium">Tin nhắn gửi đến ({visible.length})</p>
            {visible.length > 0 && (
              <button onClick={clearAll} className="text-xs text-red-600 hover:text-red-800 underline shrink-0">
                Xóa hết
              </button>
            )}
          </div>
          {visible.length === 0 ? (
            <p className="px-4 py-6 text-sm text-neutral-500">Chưa có tin nhắn nào.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {visible.map((m) => (
                <li key={m.id} className="border-b last:border-0">
                  <button onClick={() => openMessage(m.id)} className="w-full text-left px-4 py-3 hover:bg-neutral-50">
                    <p className="font-medium text-sm truncate">{m.subject || "(Không có chủ đề)"}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      {m.name} · {new Date(m.date).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{m.message}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/messages" onClick={() => setOpen(false)} className="block text-center text-sm underline py-3 border-t">
            Xem tất cả tin nhắn
          </Link>
        </div>
      )}
    </div>
  );
}
