"use client";
import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";
import AdminAvatar from "@/components/admin/AdminAvatar";

// Icon con mắt: mở khi đang hiện mật khẩu, gạch chéo khi đang ẩn (giống trang /account)
function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      )}
    </svg>
  );
}

const label = "block text-sm mb-1";
const field = "border w-full px-3 py-2.5 pr-10 outline-none focus:border-black";

export default function AdminSettingsPage() {
  const { user, changePassword } = useAuth();
  const avatarBoxRef = useRef<HTMLDivElement>(null);
  // Nút "Đổi ảnh đại diện" mở đúng modal của AdminAvatar (dùng chung trạng
  // thái localStorage mona-admin-avatar, không ép về gấu trúc): bấm hộ vào
  // nút avatar sẵn có trong khối này.
  const openAvatarModal = () => {
    avatarBoxRef.current
      ?.querySelector<HTMLButtonElement>('button[aria-label="Đổi ảnh đại diện"]')
      ?.click();
  };
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (next.length < 6) {
      setError("Mật khẩu mới cần tối thiểu 6 ký tự.");
      return;
    }
    if (next !== confirm) {
      setError("Mật khẩu nhập lại chưa khớp với mật khẩu mới.");
      return;
    }
    const r = changePassword(current, next);
    if (!r.ok) {
      setError(r.error || "Đổi mật khẩu thất bại.");
      return;
    }
    logActivity(user?.email, "Đổi mật khẩu", `Tài khoản ${user?.email} đổi mật khẩu.`);
    setNotice("Đổi mật khẩu thành công. Lần đăng nhập sau hãy dùng mật khẩu mới.");
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const passField = (
    id: string,
    labelText: string,
    value: string,
    setValue: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void
  ) => (
    <div>
      <label htmlFor={id} className={label}>
        {labelText} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={field}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          title={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-medium">Cài đặt & Bảo mật</h1>

      <h2 className="font-medium mt-8">Tài khoản quản trị</h2>
      <div className="bg-white border max-w-md p-6 mt-4">
        <div ref={avatarBoxRef} className="flex items-center gap-4">
          <AdminAvatar name={user?.name ?? "Quản trị viên MONA"} />
          <div className="min-w-0">
            <p className="font-medium">Quản trị viên MONA</p>
            <p className="text-neutral-500 text-sm break-all">{user?.email}</p>
            <p className="text-sm mt-1">Vai trò: Quản trị viên</p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAvatarModal}
          aria-label="Mở đổi ảnh đại diện"
          className="border px-4 py-2 text-sm mt-4 hover:border-black"
        >
          Đổi ảnh đại diện
        </button>
        <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
          Bấm vào ảnh đại diện hoặc nút trên để đổi ảnh. Ảnh chỉ lưu trên trình duyệt này.
        </p>
      </div>

      <h2 className="font-medium mt-8">Đổi mật khẩu</h2>
      <form onSubmit={submit} className="bg-white border max-w-md p-6 mt-4 space-y-5">
        {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</p>}
        {notice && <p className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3">{notice}</p>}
        {passField("st-pw-current", "Mật khẩu hiện tại", current, setCurrent, showCurrent, setShowCurrent)}
        {passField("st-pw-new", "Mật khẩu mới", next, setNext, showNext, setShowNext)}
        {passField("st-pw-confirm", "Nhập lại mật khẩu mới", confirm, setConfirm, showConfirm, setShowConfirm)}
        <button className="bg-black text-white px-8 py-3 text-sm tracking-[0.2em] hover:bg-neutral-800 transition-colors">
          ĐỔI MẬT KHẨU
        </button>
      </form>
      <p className="text-xs text-neutral-500 mt-4 leading-relaxed max-w-md">
        Lưu ý: mật khẩu này hiện chỉ lưu trên trình duyệt của máy bạn (tài khoản demo), nên đổi ở máy nào thì chỉ có hiệu lực ở máy đó.
        Hãy nhớ mật khẩu mới — trang quản trị chưa có chức năng gửi email khôi phục.
      </p>
    </div>
  );
}
