"use client";
/* Tin nhắn liên hệ: danh sách + khung chi tiết, không còn dấu đánh dấu
   chưa đọc (không chấm đỏ, không nút tích, không lọc Chưa đọc/Đã đọc).
   Mỗi tin xóa được ngay từ danh sách và cả trong khung chi tiết. Bấm từ
   chuông thông báo sẽ sang đây và mở đúng tin đó (?id=...). */
import { useEffect, useState } from "react";
import { useMessages, fetchReplies, postReply, type MessageReply } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";

export default function AdminMessages() {
  const { messages, deleteMessage } = useMessages();
  const { user } = useAuth();
  const [openId, setOpenId] = useState<string | null>(null);
  /* Đoạn chat trong tin đang mở: các lượt trả lời + ô nhắn lại cho khách. */
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Mở đúng tin nhắn khi đi từ chuông thông báo (?id=...)
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) setOpenId(id);
  }, []);

  const open = messages.find((m) => m.id === openId) ?? null;

  // Tải đoạn chat mỗi khi mở một tin khác.
  useEffect(() => {
    if (!open) {
      setReplies([]);
      setReplyBody("");
      setReplyError("");
      return;
    }
    let alive = true;
    fetchReplies(open.id)
      .then((rows) => {
        if (alive) setReplies(rows);
      })
      .catch(() => {
        if (alive) setReplies([]);
      });
    return () => {
      alive = false;
    };
  }, [open]);

  const sendReply = async () => {
    if (!open || sending) return;
    const text = replyBody.trim();
    if (!text) return;
    setSending(true);
    setReplyError("");
    try {
      const created = await postReply(open.id, "admin", text);
      setReplies((prev) => [...prev, created]);
      setReplyBody("");
      logActivity(user?.email, "Trả lời tin nhắn", `Trả lời tin nhắn "${open.subject || open.name}".`);
    } catch {
      setReplyError("Gửi trả lời chưa được, bạn thử lại nhé.");
    } finally {
      setSending(false);
    }
  };

  const remove = (id: string, label: string) => {
    if (confirm(`Xoá tin nhắn "${label}"?`)) {
      deleteMessage(id);
      logActivity(user?.email, "Xoá tin nhắn", `Xoá tin nhắn "${label}".`);
      if (openId === id) setOpenId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-light tracking-wide">Tin nhắn liên hệ</h1>
      <p className="text-sm text-neutral-500 mt-1">
        Khách gửi từ form ở trang Liên hệ sẽ hiện về đây. Bấm vào một tin để xem chi tiết và trả lời.
      </p>

      {open && (
        <div className="bg-white shadow-sm p-5 md:p-6 mt-6 border-t-4 border-black">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-lg">{open.subject || "(Không có chủ đề)"}</p>
              <p className="text-sm text-neutral-500 mt-0.5">
                {open.name} · {open.email} · {new Date(open.date).toLocaleString("vi-VN")}
              </p>
            </div>
            <button onClick={() => setOpenId(null)} className="text-sm underline">
              Đóng
            </button>
          </div>
          <p className="text-sm leading-relaxed mt-4 whitespace-pre-line">{open.message}</p>

          {/* Đoạn chat: tin gốc + các lượt trả lời theo thứ tự thời gian. */}
          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
            {replies.map((r) => (
              <div
                key={r.id}
                className={`max-w-[85%] rounded px-4 py-3 ${
                  r.sender === "admin"
                    ? "ml-auto bg-black text-white"
                    : "bg-neutral-100 text-neutral-900"
                }`}
              >
                <p className="text-xs font-medium opacity-70">
                  {r.sender === "admin" ? "Quản trị viên" : open.name} ·{" "}
                  {new Date(r.date).toLocaleString("vi-VN")}
                </p>
                <p className="text-sm leading-relaxed mt-1 whitespace-pre-line">{r.body}</p>
              </div>
            ))}
          </div>

          {/* Nhắn lại cho khách ngay trong trang quản trị. */}
          <div className="mt-5">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Nhắn lại cho khách..."
              rows={3}
              className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black resize-y"
            />
            {replyError && <p className="text-sm text-red-600 mt-2">{replyError}</p>}
            <button
              onClick={sendReply}
              disabled={sending || !replyBody.trim()}
              className="bg-black text-white px-5 py-2.5 text-sm mt-3 hover:bg-neutral-800 disabled:opacity-50"
            >
              {sending ? "Đang gửi..." : "Gửi trả lời"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <a
              href={`mailto:${open.email}?subject=${encodeURIComponent(
                `Re: ${open.subject || "Liên hệ MONA Fashion"}`,
              )}`}
              className="bg-black text-white px-5 py-2.5 text-sm hover:bg-neutral-800"
            >
              Trả lời qua email
            </a>
            <button
              onClick={() => remove(open.id, open.subject || open.name)}
              className="border border-red-200 text-red-600 px-5 py-2.5 text-sm hover:border-red-600"
            >
              🗑 Xoá tin nhắn này
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm mt-6 overflow-x-auto">
        {messages.length === 0 ? (
          <p className="px-5 py-10 text-neutral-500 text-sm">Chưa có tin nhắn nào.</p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="px-5 py-3 font-medium">Khách hàng</th>
                <th className="px-5 py-3 font-medium">Chủ đề</th>
                <th className="px-5 py-3 font-medium">Ngày gửi</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr
                  key={m.id}
                  className={`border-b last:border-0 hover:bg-neutral-50 ${openId === m.id ? "bg-neutral-50" : ""}`}
                >
                  <td className="px-5 py-3 align-top">
                    <button
                      onClick={() => setOpenId(m.id)}
                      className="font-medium underline underline-offset-2 text-left"
                    >
                      {m.name}
                    </button>
                    <span className="block text-xs text-neutral-400">{m.email}</span>
                  </td>
                  <td className="px-5 py-3 align-top">
                    <button onClick={() => setOpenId(m.id)} className="underline underline-offset-2 text-left">
                      {m.subject || "(Không có chủ đề)"}
                    </button>
                  </td>
                  <td className="px-5 py-3 align-top whitespace-nowrap">{new Date(m.date).toLocaleString("vi-VN")}</td>
                  <td className="px-5 py-3 align-top text-right whitespace-nowrap">
                    <button onClick={() => setOpenId(m.id)} className="underline mr-4">
                      Xem
                    </button>
                    <button
                      title="Xoá tin nhắn"
                      aria-label={`Xoá tin nhắn của ${m.name}`}
                      onClick={() => remove(m.id, m.subject || m.name)}
                      className="text-red-600 text-base leading-none"
                    >
                      🗑
                    </button>
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
