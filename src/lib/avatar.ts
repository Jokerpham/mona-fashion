/* Ảnh đại diện của quản trị viên (lưu trên trình duyệt này qua localStorage).
   Mặc định là ảnh gấu trúc của shop. */
export type AdminAvatar =
  | { type: "image"; src: string }
  | { type: "letter"; letter: string; color: string };

export const PANDA_AVATAR = "/images/site/logo-panda.png";
const KEY = "mona-admin-avatar";

export const AVATAR_PRESETS: { label: string; src: string }[] = [
  { label: "Gấu trúc", src: PANDA_AVATAR },
  { label: "Mèo", src: "/images/avatars/cat.svg" },
  { label: "Chó", src: "/images/avatars/dog.svg" },
  { label: "Gấu", src: "/images/avatars/bear.svg" },
  { label: "Thỏ", src: "/images/avatars/rabbit.svg" },
  { label: "Cáo", src: "/images/avatars/fox.svg" },
];

export const LETTER_COLORS = ["#171a21", "#b45309", "#0f766e", "#be123c", "#6d28d9", "#0369a1"];

export function loadAvatar(): AdminAvatar {
  if (typeof window === "undefined") return { type: "image", src: PANDA_AVATAR };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.type === "image" && typeof parsed.src === "string") return parsed;
      if (
        parsed?.type === "letter" &&
        typeof parsed.letter === "string" &&
        typeof parsed.color === "string"
      )
        return parsed;
    }
  } catch {}
  return { type: "image", src: PANDA_AVATAR };
}

export function saveAvatar(a: AdminAvatar) {
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch {}
}
