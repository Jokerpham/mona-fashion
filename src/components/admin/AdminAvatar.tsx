"use client";
/* Ảnh đại diện của quản trị viên ở thanh bên: bấm vào để tự đổi tùy thích —
   chọn ảnh có sẵn, tải ảnh từ máy, hoặc dùng chữ cái + màu nền; có nút về
   lại gấu trúc mặc định. Lựa chọn lưu trên trình duyệt này. */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AVATAR_PRESETS,
  LETTER_COLORS,
  PANDA_AVATAR,
  loadAvatar,
  saveAvatar,
  type AdminAvatar,
} from "@/lib/avatar";

function AvatarImage({ avatar, size }: { avatar: AdminAvatar; size: number }) {
  if (avatar.type === "letter") {
    return (
      <span
        className="grid place-items-center rounded-full text-white font-semibold shrink-0"
        style={{ width: size, height: size, background: avatar.color, fontSize: size * 0.45 }}
      >
        {avatar.letter}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={avatar.src}
      alt="Ảnh đại diện quản trị viên"
      className="rounded-full object-cover bg-white shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export default function AdminAvatar({ name }: { name: string }) {
  const [avatar, setAvatar] = useState<AdminAvatar>({ type: "image", src: PANDA_AVATAR });
  const [open, setOpen] = useState(false);
  const [letter, setLetter] = useState("");
  const [color, setColor] = useState(LETTER_COLORS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    setAvatar(loadAvatar());
    setLetter((name || "A").trim().charAt(0).toUpperCase() || "A");
  }, [name]);

  const pick = (a: AdminAvatar) => {
    setAvatar(a);
    saveAvatar(a);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 800 * 1024) {
      setError("Ảnh quá lớn, hãy chọn ảnh dưới 800KB.");
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      if (typeof r.result === "string") {
        pick({ type: "image", src: r.result });
        setError("");
      }
    };
    r.readAsDataURL(f);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Đổi ảnh đại diện"
        aria-label="Đổi ảnh đại diện"
        className="rounded-full ring-2 ring-white/20 hover:ring-white transition-shadow shrink-0"
      >
        <AvatarImage avatar={avatar} size={44} />
      </button>
      {/* Bảng đổi ảnh render thẳng ra body (portal) với z rất cao, để không
          khối nào trên trang đè lên được — sửa lỗi ô mật khẩu nổi lên trên
          bảng ở trang Cài đặt (2026-11-02). */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4"
            onClick={() => setOpen(false)}
          >
          <div
            className="bg-white text-neutral-900 w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-lg">Đổi ảnh đại diện</h2>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none px-2" aria-label="Đóng">
                ×
              </button>
            </div>
            <p className="text-sm text-neutral-500 mt-1">Bấm vào ảnh để chọn. Ảnh chỉ lưu trên trình duyệt này.</p>

            <p className="text-sm font-medium mt-5 mb-2">Ảnh có sẵn</p>
            <div className="flex flex-wrap gap-3">
              {AVATAR_PRESETS.map((p) => (
                <button
                  key={p.src}
                  onClick={() => pick({ type: "image", src: p.src })}
                  title={p.label}
                  aria-label={p.label}
                  className={`rounded-full ring-2 ${
                    avatar.type === "image" && avatar.src === p.src
                      ? "ring-black"
                      : "ring-transparent hover:ring-neutral-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.label} className="w-12 h-12 rounded-full object-cover bg-white" />
                </button>
              ))}
            </div>

            <p className="text-sm font-medium mt-5 mb-2">Tải ảnh từ máy</p>
            <input type="file" accept="image/*" onChange={onUpload} className="text-sm w-full" />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

            <p className="text-sm font-medium mt-5 mb-2">Chữ cái + màu nền</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={letter}
                onChange={(e) => setLetter(e.target.value.slice(0, 1).toUpperCase())}
                maxLength={1}
                className="border w-12 px-3 py-2 text-center outline-none focus:border-black"
                aria-label="Chữ cái"
              />
              <div className="flex gap-2">
                {LETTER_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Màu ${c}`}
                    className={`w-8 h-8 rounded-full ring-2 ${color === c ? "ring-black" : "ring-transparent"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  if (letter) pick({ type: "letter", letter, color });
                }}
                className="border px-4 py-2 text-sm hover:border-black"
              >
                Dùng chữ này
              </button>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => pick({ type: "image", src: PANDA_AVATAR })}
                className="underline text-sm"
              >
                Về lại gấu trúc mặc định
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-black font-heading text-white px-5 py-2.5 text-sm hover:bg-neutral-800"
              >
                Xong
              </button>
            </div>
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
