"use client";
/* Nút chat nổi (hình tròn xanh, góc phải dưới, trên nút về đầu trang):
   khách bấm vào để nhắn tin cho shop. Dùng chung hệ thống tin nhắn với
   trang Liên hệ và trang quản trị Tin nhắn: khách nhập email để xem các
   tin đã gửi + trả lời của shop, hoặc gửi tin mới; admin trả lời trong
   /admin/messages thì khách đọc được ở đây và nhắn tiếp. */
import { useEffect, useRef, useState } from "react";
import {
  fetchMessagesByEmail,
  fetchReplies,
  postReply,
  pushMessage,
  newId,
  type ContactMessage,
  type MessageReply,
} from "@/lib/store";

const CHAT_EMAIL_KEY = "mona-chat-email";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [threads, setThreads] = useState<ContactMessage[]>([]);
  const [lookedUp, setLookedUp] = useState(false);
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [openMsg, setOpenMsg] = useState<ContactMessage | null>(null);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newError, setNewError] = useState("");
  const [newSending, setNewSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Nhớ email khách đã nhập để lần sau khỏi nhập lại. */
  useEffect(() => {
    try {
      setEmail(localStorage.getItem(CHAT_EMAIL_KEY) || "");
    } catch {
      /* bỏ qua nếu trình duyệt chặn localStorage */
    }
  }, []);

  const lookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const mail = email.trim();
    if (!mail || looking) return;
    setLooking(true);
    setLookupError("");
    setOpenMsg(null);
    setShowNew(false);
    try {
      const found = await fetchMessagesByEmail(mail);
      setThreads(found);
      setLookedUp(true);
      try {
        localStorage.setItem(CHAT_EMAIL_KEY, mail);
      } catch {
        /* bỏ qua */
      }
    } catch {
      setLookupError("Chưa tra cứu được, bạn thử lại nhé.");
    } finally {
      setLooking(false);
    }
  };

  const openThread = async (msg: ContactMessage) => {
    setOpenMsg(msg);
    setReplyBody("");
    setReplyError("");
    try {
      setReplies(await fetchReplies(msg.id));
    } catch {
      setReplies([]);
    }
  };

  /* Tự làm mới đoạn chat để thấy trả lời mới của shop. */
  useEffect(() => {
    if (!open || !openMsg) return;
    const id = setInterval(async () => {
      try {
        setReplies(await fetchReplies(openMsg.id));
      } catch {
        /* bỏ qua */
      }
    }, 15000);
    return () => clearInterval(id);
  }, [open, openMsg]);

  /* Cuộn xuống cuối đoạn chat khi có tin mới. */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [replies, openMsg]);

  const sendReply = async () => {
    if (!openMsg || sending) return;
    const text = replyBody.trim();
    if (!text) return;
    setSending(true);
    setReplyError("");
    try {
      const created = await postReply(openMsg.id, "customer", text);
      setReplies((prev) => [...prev, created]);
      setReplyBody("");
    } catch {
      setReplyError("Gửi tin nhắn chưa được, bạn thử lại nhé.");
    } finally {
      setSending(false);
    }
  };

  const sendNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const mail = email.trim();
    if (!mail || !newName.trim() || !newBody.trim() || newSending) return;
    setNewSending(true);
    setNewError("");
    try {
      const created = await pushMessage({
        id: newId("MSG"),
        date: new Date().toISOString(),
        name: newName.trim(),
        email: mail,
        subject: newSubject.trim() || "Trò chuyện với shop",
        message: newBody.trim(),
        read: false,
      });
      try {
        localStorage.setItem(CHAT_EMAIL_KEY, mail);
      } catch {
        /* bỏ qua */
      }
      setThreads((prev) => [created, ...prev]);
      setLookedUp(true);
      setShowNew(false);
      setNewName("");
      setNewSubject("");
      setNewBody("");
      setOpenMsg(created);
      setReplies([]);
    } catch {
      setNewError("Gửi tin nhắn chưa được, bạn thử lại nhé.");
    } finally {
      setNewSending(false);
    }
  };

  return (
    <>
      {/* Nút tròn xanh nổi, trên nút về đầu trang */}
      <button
        aria-label="Trò chuyện với shop"
        title="Trò chuyện với shop"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-green-500 text-white grid place-items-center shadow-lg hover:bg-green-600 transition"
      >
        {open ? (
          <span className="text-xl leading-none">✕</span>
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
            <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.78 1.4 5.26 3.6 6.9-.1 1.1-.5 2.6-1.3 3.8 0 0 2.5.1 4.6-1.2.7.1 1.4.2 2.1.2 5.52 0 10-3.94 10-8.8S17.52 2 12 2zm-2.5 7h-2v2h2v-2zm3.5 0h-2v2h2v-2zm3.5 0h-2v2h2v-2z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-[152px] right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border flex flex-col overflow-hidden"
          style={{ height: "480px", maxHeight: "calc(100vh - 180px)" }}
        >
          {/* Header */}
          <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <p className="font-medium text-sm">Trò chuyện với MONA</p>
              <p className="text-[11px] text-white/80">Shop sẽ trả lời bạn sớm nhất</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Đóng" className="text-white/80 hover:text-white text-lg leading-none px-1">
              ✕
            </button>
          </div>

          {/* Chưa mở đoạn chat: tra cứu theo email / gửi tin mới */}
          {!openMsg && !showNew && (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-neutral-600">
                Nhập email bạn đã dùng để gửi tin, để xem trả lời của shop và nhắn tiếp.
              </p>
              <form onSubmit={lookup} className="mt-3 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  className="flex-1 min-w-0 border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                />
                <button disabled={looking} className="bg-black text-white px-4 py-2.5 text-sm shrink-0 hover:bg-neutral-800 disabled:opacity-50">
                  {looking ? "..." : "Xem"}
                </button>
              </form>
              {lookupError && <p className="text-sm text-red-600 mt-2">{lookupError}</p>}
              {lookedUp && threads.length === 0 && (
                <p className="text-sm text-neutral-500 mt-4">Chưa có tin nhắn nào với email này.</p>
              )}
              {threads.length > 0 && (
                <ul className="mt-3 divide-y divide-neutral-100 border border-neutral-200 rounded">
                  {threads.map((m) => (
                    <li key={m.id}>
                      <button onClick={() => openThread(m)} className="w-full text-left px-3 py-2.5 hover:bg-neutral-50">
                        <p className="font-medium text-sm truncate">{m.subject || "(Không có chủ đề)"}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{new Date(m.date).toLocaleString("vi-VN")}</p>
                        <p className="text-sm text-neutral-600 mt-0.5 truncate">{m.message}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => {
                  setShowNew(true);
                  setNewError("");
                }}
                className="w-full mt-4 border border-black py-2.5 text-sm hover:bg-black hover:text-white transition-colors"
              >
                ＋ Gửi tin nhắn mới
              </button>
            </div>
          )}

          {/* Gửi tin nhắn mới */}
          {showNew && !openMsg && (
            <form onSubmit={sendNew} className="flex-1 overflow-y-auto p-4 space-y-3">
              <button type="button" onClick={() => setShowNew(false)} className="text-sm text-neutral-500 hover:text-black">
                ← Quay lại
              </button>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Tên của bạn *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                  placeholder="Họ và tên"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                  placeholder="Email của bạn"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Chủ đề</label>
                <input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                  placeholder="Ví dụ: Hỏi về sản phẩm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Nội dung *</label>
                <textarea
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black resize-y"
                  placeholder="Nhắn tin cho shop..."
                />
              </div>
              {newError && <p className="text-sm text-red-600">{newError}</p>}
              <button disabled={newSending} className="w-full bg-black text-white py-2.5 text-sm hover:bg-neutral-800 disabled:opacity-50">
                {newSending ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          )}

          {/* Đoạn chat đang mở */}
          {openMsg && (
            <>
              <div className="px-4 py-2 border-b flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setOpenMsg(null);
                    setReplyBody("");
                  }}
                  className="text-sm text-neutral-500 hover:text-black"
                >
                  ← Quay lại
                </button>
                <p className="font-medium text-sm truncate flex-1">{openMsg.subject || "(Không có chủ đề)"}</p>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                <div className="bg-neutral-100 text-neutral-900 rounded px-3 py-2.5 max-w-[85%]">
                  <p className="text-xs font-medium opacity-70">
                    {openMsg.name} · {new Date(openMsg.date).toLocaleString("vi-VN")}
                  </p>
                  <p className="text-sm mt-1 whitespace-pre-line">{openMsg.message}</p>
                </div>
                {replies.map((r) => (
                  <div
                    key={r.id}
                    className={`rounded px-3 py-2.5 max-w-[85%] ${
                      r.sender === "admin" ? "ml-auto bg-black text-white" : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    <p className="text-xs font-medium opacity-70">
                      {r.sender === "admin" ? "Quản trị viên" : openMsg.name} ·{" "}
                      {new Date(r.date).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-sm mt-1 whitespace-pre-line">{r.body}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t shrink-0">
                <div className="flex gap-2">
                  <input
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendReply();
                    }}
                    placeholder="Nhắn tin cho shop..."
                    className="flex-1 min-w-0 border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <button
                    onClick={sendReply}
                    disabled={sending || !replyBody.trim()}
                    className="bg-black text-white px-4 py-2.5 text-sm shrink-0 hover:bg-neutral-800 disabled:opacity-50"
                  >
                    Gửi
                  </button>
                </div>
                {replyError && <p className="text-sm text-red-600 mt-2">{replyError}</p>}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
