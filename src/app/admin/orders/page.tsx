"use client";
/* Đơn hàng: tìm kiếm theo mã đơn / tên khách / số điện thoại, lọc theo 6
   trạng thái (Chờ xác nhận, Đang chuẩn bị hàng, Đang giao, Đã giao, Đã
   hủy, Hoàn trả). Nhãn trạng thái mới giữ nguyên mã CSDL cũ (xem
   src/lib/db-map.ts) nên đơn đã có vẫn hiển thị đúng; doanh thu không
   tính đơn Đã hủy và Hoàn trả (xem Tổng quan + Báo cáo).
   Chi tiết đơn có nút in hoá đơn / phiếu giao hàng (khung in chỉ in đúng
   tờ giấy đó). Khi chưa có đơn nào, có nút tạo đơn thủ công (khách đặt
   qua điện thoại/Facebook) — đơn khách tự đặt trên shop vẫn tự hiện về. */
import { Fragment, useMemo, useState } from "react";
import { useOrders, useProducts, pushOrder, newId, type Order, type OrderItem } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/lib/activity";
import {
  canChangeOrderStatus,
  canCreateManualOrder,
  canDeleteOrder,
} from "@/lib/roles";
import { formatPrice } from "@/lib/format";

const STATUSES: Order["status"][] = [
  "Chờ xác nhận",
  "Đang chuẩn bị hàng",
  "Đang giao",
  "Đã giao",
  "Đã hủy",
  "Hoàn trả",
];

const SHOP_NAME = "MONA Fashion";
const SHOP_ADDRESS = "1073/23 Cách Mạng Tháng 8, P.7, Q.Tân Bình, TP.HCM";
const SHOP_PHONE = "0313728397";
const SHOP_EMAIL = "info@themona.global";

type PrintDoc = { type: "invoice" | "label"; order: Order };

function digits(s: string) {
  return s.replace(/\D/g, "");
}

function subtotalOf(o: Order) {
  return o.items.reduce((s, it) => s + it.price * it.qty, 0);
}

/* Tờ in: hoá đơn hoặc phiếu giao hàng. Khi in (Ctrl+P hoặc nút In), CSS
   @media print bên dưới chỉ in đúng tờ này, toàn bộ trang quản trị bị ẩn. */
function PrintDocView({ doc, onClose }: { doc: PrintDoc; onClose: () => void }) {
  const o = doc.order;
  const sub = subtotalOf(o);
  const ship = Math.max(0, o.total - sub);
  const isCod = /COD/i.test(o.payment);
  return (
    <div className="print-doc fixed inset-0 z-[100] bg-white overflow-y-auto">
      <style>{`@media print { body * { visibility: hidden; } .print-doc, .print-doc * { visibility: visible; } .print-doc { position: absolute !important; inset: 0 !important; overflow: visible !important; } }`}</style>
      <div className="max-w-2xl mx-auto p-6 md:p-10 text-neutral-900">
        <div className="flex justify-between items-start gap-4 print:hidden">
          <p className="text-sm text-neutral-500">
            {doc.type === "invoice" ? "Xem trước hoá đơn — bấm In để in ra giấy." : "Xem trước phiếu giao hàng — bấm In để in ra giấy."}
          </p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => window.print()} className="bg-black text-white px-5 py-2 text-sm hover:bg-neutral-800">In ngay</button>
            <button onClick={onClose} className="border px-5 py-2 text-sm hover:border-black">Đóng</button>
          </div>
        </div>

        {doc.type === "invoice" ? (
          <div className="mt-6 print:mt-0">
            <h2 className="text-center text-2xl font-semibold tracking-wide">{SHOP_NAME}</h2>
            <p className="text-center text-sm text-neutral-600 mt-1">{SHOP_ADDRESS}</p>
            <p className="text-center text-sm text-neutral-600">Điện thoại: {SHOP_PHONE} · Email: {SHOP_EMAIL}</p>
            <h3 className="text-center text-xl font-medium mt-8">HÓA ĐƠN BÁN HÀNG</h3>
            <div className="flex justify-between text-sm mt-6">
              <p><b>Mã đơn:</b> {o.id}</p>
              <p><b>Ngày đặt:</b> {new Date(o.date).toLocaleString("vi-VN")}</p>
            </div>
            <div className="text-sm mt-2 space-y-0.5">
              <p><b>Khách hàng:</b> {o.customer.name}</p>
              <p><b>Điện thoại:</b> {o.customer.phone}</p>
              <p><b>Địa chỉ:</b> {o.customer.address || "—"}</p>
              {o.customer.email && <p><b>Email:</b> {o.customer.email}</p>}
              <p><b>Thanh toán:</b> {o.payment} · <b>Trạng thái:</b> {o.status}</p>
            </div>
            <table className="w-full text-sm mt-6 border-t border-b">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2 font-medium">Sản phẩm</th>
                  <th className="py-2 pr-2 font-medium">Size</th>
                  <th className="py-2 pr-2 font-medium">SL</th>
                  <th className="py-2 pr-2 font-medium text-right">Đơn giá</th>
                  <th className="py-2 font-medium text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {o.items.map((it, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-2">{it.name}</td>
                    <td className="py-2 pr-2">{it.size || "—"}</td>
                    <td className="py-2 pr-2">{it.qty}</td>
                    <td className="py-2 pr-2 text-right">{formatPrice(it.price)}</td>
                    <td className="py-2 text-right">{formatPrice(it.price * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-sm mt-4 space-y-1 text-right">
              <p>Tạm tính: {formatPrice(sub)}</p>
              <p>Phí giao hàng: {formatPrice(ship)}</p>
              <p className="text-base font-semibold">Tổng cộng: {formatPrice(o.total)}</p>
            </div>
            <p className="text-center text-sm text-neutral-500 mt-10">Cảm ơn quý khách đã mua hàng tại {SHOP_NAME}!</p>
          </div>
        ) : (
          <div className="mt-6 print:mt-0 border-2 border-black p-6">
            <h3 className="text-center text-2xl font-semibold tracking-wide">PHIẾU GIAO HÀNG</h3>
            <div className="grid md:grid-cols-2 gap-6 mt-6 text-sm">
              <div>
                <p className="font-medium">Người gửi</p>
                <p className="mt-1">{SHOP_NAME}</p>
                <p>{SHOP_ADDRESS}</p>
                <p>Điện thoại: {SHOP_PHONE}</p>
              </div>
              <div>
                <p className="font-medium">Người nhận</p>
                <p className="mt-1 text-lg font-semibold">{o.customer.name}</p>
                <p>{o.customer.address || "—"}</p>
                <p>Điện thoại: {o.customer.phone}</p>
              </div>
            </div>
            <div className="text-sm mt-6 space-y-1">
              <p><b>Mã đơn:</b> {o.id} · <b>Ngày đặt:</b> {new Date(o.date).toLocaleString("vi-VN")}</p>
              <p><b>Hàng hoá:</b> {o.items.map((it) => `${it.name} (size ${it.size || "—"}) × ${it.qty}`).join("; ")}</p>
              <p><b>Thu hộ (COD):</b> {isCod ? formatPrice(o.total) : "0₫ (đã thanh toán)"}</p>
              <p><b>Tổng đơn:</b> {formatPrice(o.total)}</p>
            </div>
            <div className="mt-8 flex justify-between text-sm">
              <p>Người gửi ký: ___________</p>
              <p>Người nhận ký: ___________</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type ManualItem = { productId: string; size: string; qty: number };

export default function AdminOrders() {
  const { orders, setStatus, deleteOrder, refreshOrders } = useOrders();
  const { products } = useProducts();
  const { user } = useAuth();
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order["status"]>("all");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [printDoc, setPrintDoc] = useState<PrintDoc | null>(null);

  const canStatus = canChangeOrderStatus(user?.role);
  const canDelete = canDeleteOrder(user?.role);
  const canManual = canCreateManualOrder(user?.role);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qd = digits(query);
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      if (o.id.toLowerCase().includes(q)) return true;
      if (o.customer.name.toLowerCase().includes(q)) return true;
      if (qd && digits(o.customer.phone).includes(qd)) return true;
      return false;
    });
  }, [orders, query, statusFilter]);

  const changeStatus = async (o: Order, next: Order["status"]) => {
    if (next === o.status) return;
    try {
      await setStatus(o.id, next);
      logActivity(user?.email, "Đổi trạng thái đơn", `${o.id}: ${o.status} → ${next}.`);
    } catch (err: any) {
      setError(err?.message || "Không đổi được trạng thái đơn.");
    }
  };

  const remove = async (o: Order) => {
    if (!confirm(`Xoá đơn ${o.id}?`)) return;
    try {
      await deleteOrder(o.id);
      logActivity(user?.email, "Xoá đơn hàng", `Xoá đơn ${o.id} (${o.customer.name}, ${formatPrice(o.total)}).`);
      if (openId === o.id) setOpenId(null);
    } catch (err: any) {
      setError(err?.message || "Không xoá được đơn.");
    }
  };

  // --- Form tạo đơn thủ công ---
  const [showManual, setShowManual] = useState(false);
  const [mName, setMName] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mAddress, setMAddress] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mPayment, setMPayment] = useState("COD");
  const [mNote, setMNote] = useState("");
  const [mItems, setMItems] = useState<ManualItem[]>([]);
  const [mPick, setMPick] = useState("");
  const [mSize, setMSize] = useState("");
  const [mQty, setMQty] = useState(1);
  const [mError, setMError] = useState("");

  const pickedProduct = products.find((p) => String(p.id) === mPick);
  const manualTotal = mItems.reduce((s, it) => {
    const p = products.find((x) => String(x.id) === it.productId);
    return s + (p ? p.price * it.qty : 0);
  }, 0);

  const addManualItem = () => {
    if (!pickedProduct) return;
    const size = mSize || pickedProduct.sizes[0] || "";
    setMItems([...mItems, { productId: String(pickedProduct.id), size, qty: Math.max(1, mQty || 1) }]);
  };

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mPhone.trim()) {
      setMError("Hãy nhập tên và số điện thoại khách hàng.");
      return;
    }
    if (mItems.length === 0) {
      setMError("Hãy chọn ít nhất một sản phẩm.");
      return;
    }
    const items: OrderItem[] = mItems.map((it) => {
      const p = products.find((x) => String(x.id) === it.productId)!;
      return { name: p.name, size: it.size, qty: it.qty, price: p.price };
    });
    try {
      await pushOrder({
        id: newId("MONA"),
        date: new Date().toISOString(),
        customer: { name: mName.trim(), phone: mPhone.trim(), email: mEmail.trim() || undefined, address: mAddress.trim() },
        items,
        total: manualTotal,
        payment: mPayment,
        status: "Chờ xác nhận",
        note: mNote.trim() || undefined,
      });
      await refreshOrders();
      logActivity(user?.email, "Tạo đơn thủ công", `Tạo đơn cho ${mName.trim()} (${formatPrice(manualTotal)}).`);
      setNotice("Đã tạo đơn hàng thủ công.");
      setShowManual(false);
      setMName("");
      setMPhone("");
      setMAddress("");
      setMEmail("");
      setMNote("");
      setMItems([]);
      setMError("");
    } catch (err: any) {
      setMError(err?.message || "Không tạo được đơn hàng.");
    }
  };

  const field = "border w-full px-3 py-2.5 outline-none focus:border-black bg-white";
  const label = "block text-sm mb-1 font-medium";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Đơn hàng</h1>
          <p className="text-sm text-neutral-500 mt-1">Đơn của khách đặt ở trang Thanh toán sẽ tự hiện về đây. Bấm vào mã đơn để xem chi tiết.</p>
        </div>
        {canManual && (
          <button onClick={() => { setShowManual(!showManual); setMError(""); }} className="bg-black text-white px-4 py-2.5 text-sm tracking-wider hover:bg-neutral-800">
            + TẠO ĐƠN THỦ CÔNG
          </button>
        )}
      </div>

      {error && <p className="bg-red-50 text-red-700 text-sm px-4 py-3 mt-6">{error}</p>}
      {notice && <p className="bg-green-50 text-green-800 text-sm px-4 py-3 mt-6">{notice}</p>}

      {showManual && (
        <form onSubmit={submitManual} className="bg-white shadow-sm p-5 md:p-6 mt-6">
          <h2 className="font-medium mb-1">Tạo đơn hàng thủ công</h2>
          <p className="text-sm text-neutral-500 mb-4">Dành cho khách đặt qua điện thoại hoặc Facebook. Đơn tạo ở đây vào chung danh sách đơn hàng.</p>
          {mError && <p className="bg-red-50 text-red-700 text-sm px-3 py-2 mb-4">{mError}</p>}
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={label}>Tên khách hàng *</label><input required value={mName} onChange={(e) => setMName(e.target.value)} className={field} placeholder="Ví dụ: Nguyễn Văn A" /></div>
            <div><label className={label}>Số điện thoại *</label><input required value={mPhone} onChange={(e) => setMPhone(e.target.value)} className={field} placeholder="09xx xxx xxx" /></div>
            <div><label className={label}>Địa chỉ giao hàng</label><input value={mAddress} onChange={(e) => setMAddress(e.target.value)} className={field} placeholder="Số nhà, đường, phường, quận…" /></div>
            <div><label className={label}>Email (không bắt buộc)</label><input type="email" value={mEmail} onChange={(e) => setMEmail(e.target.value)} className={field} placeholder="khach@email.com" /></div>
            <div>
              <label className={label}>Thanh toán</label>
              <select value={mPayment} onChange={(e) => setMPayment(e.target.value)} className={field}>
                <option value="COD">COD - Thanh toán khi nhận hàng</option>
                <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
              </select>
            </div>
            <div><label className={label}>Ghi chú</label><input value={mNote} onChange={(e) => setMNote(e.target.value)} className={field} placeholder="Ghi chú thêm cho đơn này…" /></div>
          </div>

          <p className="font-medium text-sm mt-6 mb-2">Sản phẩm trong đơn</p>
          <div className="flex flex-wrap gap-2 items-end">
            <select value={mPick} onChange={(e) => { setMPick(e.target.value); setMSize(""); }} className="border px-3 py-2.5 bg-white outline-none focus:border-black min-w-[220px]">
              <option value="">— Chọn sản phẩm —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</option>
              ))}
            </select>
            <select value={mSize} onChange={(e) => setMSize(e.target.value)} className="border px-3 py-2.5 bg-white outline-none focus:border-black">
              <option value="">Size mặc định</option>
              {(pickedProduct?.sizes ?? []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input type="number" min={1} value={mQty} onChange={(e) => setMQty(Math.max(1, parseInt(e.target.value || "1", 10) || 1))} className="border px-3 py-2.5 w-20 outline-none focus:border-black" aria-label="Số lượng" />
            <button type="button" onClick={addManualItem} disabled={!pickedProduct} className="border bg-white px-4 py-2.5 text-sm hover:border-black disabled:opacity-50">+ Thêm món</button>
          </div>
          {mItems.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {mItems.map((it, i) => {
                const p = products.find((x) => String(x.id) === it.productId)!;
                return (
                  <li key={i} className="flex justify-between gap-2">
                    <span>• {p.name} — size {it.size || "—"} × {it.qty} — {formatPrice(p.price * it.qty)}</span>
                    <button type="button" onClick={() => setMItems(mItems.filter((_, j) => j !== i))} className="underline text-red-600">Bỏ</button>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="font-medium mt-4">Tổng tiền: {formatPrice(manualTotal)}</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-black text-white px-6 py-2.5 text-sm tracking-wider hover:bg-neutral-800">TẠO ĐƠN HÀNG</button>
            <button type="button" onClick={() => setShowManual(false)} className="border bg-white px-6 py-2.5 text-sm hover:border-black">Huỷ</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại…"
          className="border bg-white px-3 py-2.5 text-sm outline-none focus:border-black flex-1 min-w-[220px]"
          aria-label="Tìm kiếm đơn hàng"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | Order["status"])} className="border bg-white px-3 py-2.5 text-sm outline-none focus:border-black" aria-label="Lọc theo trạng thái">
          <option value="all">Tất cả trạng thái</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-sm mt-4 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="px-5 py-10">
            <p className="text-neutral-500 text-sm">Chưa có đơn hàng nào.</p>
            <p className="text-neutral-500 text-sm mt-1">Đơn hàng cũng tự hiện ở đây khi khách đặt trên shop.</p>
            {canManual && (
              <button onClick={() => setShowManual(true)} className="bg-black text-white px-5 py-2.5 text-sm mt-4 hover:bg-neutral-800">
                Tạo đơn hàng thủ công
              </button>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-10 text-neutral-500 text-sm">Không có đơn nào khớp với tìm kiếm hoặc bộ lọc.</p>
        ) : (
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="px-5 py-3 font-medium">Mã đơn</th>
                <th className="px-5 py-3 font-medium">Ngày đặt</th>
                <th className="px-5 py-3 font-medium">Khách hàng</th>
                <th className="px-5 py-3 font-medium">Tổng tiền</th>
                <th className="px-5 py-3 font-medium">Thanh toán</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <Fragment key={o.id}>
                  <tr className="border-b hover:bg-neutral-50">
                    <td className="px-5 py-3 align-top">
                      <button onClick={() => setOpenId(openId === o.id ? null : o.id)} className="font-medium underline underline-offset-2">{o.id}</button>
                    </td>
                    <td className="px-5 py-3 align-top whitespace-nowrap">{new Date(o.date).toLocaleString("vi-VN")}</td>
                    <td className="px-5 py-3 align-top">
                      {o.customer.name}
                      <span className="block text-xs text-neutral-400">{o.customer.phone}</span>
                    </td>
                    <td className="px-5 py-3 align-top font-medium">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3 align-top">{o.payment}</td>
                    <td className="px-5 py-3 align-top">
                      {canStatus ? (
                        <select value={o.status} onChange={(e) => changeStatus(o, e.target.value as Order["status"])} className="border px-2 py-1.5 bg-white outline-none focus:border-black">
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span>{o.status}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 align-top text-right">
                      {canDelete && <button onClick={() => remove(o)} className="underline text-red-600">Xoá</button>}
                    </td>
                  </tr>
                  {openId === o.id && (
                    <tr className="border-b bg-neutral-50">
                      <td colSpan={7} className="px-5 py-4">
                        <p className="text-sm"><b>Địa chỉ:</b> {o.customer.address}{o.customer.email ? <> · <b>Email:</b> {o.customer.email}</> : null}</p>
                        {o.note && <p className="text-sm mt-1"><b>Ghi chú:</b> {o.note}</p>}
                        <ul className="mt-2 space-y-1 text-sm">
                          {o.items.map((it, i) => (
                            <li key={i}>• {it.name} — size {it.size} × {it.qty} — {formatPrice(it.price * it.qty)}</li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <button onClick={() => setPrintDoc({ type: "invoice", order: o })} className="border bg-white px-4 py-2 text-sm hover:border-black">In hóa đơn</button>
                          <button onClick={() => setPrintDoc({ type: "label", order: o })} className="border bg-white px-4 py-2 text-sm hover:border-black">In phiếu giao hàng</button>
                          {canDelete && <button onClick={() => remove(o)} className="underline text-red-600 text-sm px-2 py-2">🗑 Xoá đơn này</button>}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {printDoc && <PrintDocView doc={printDoc} onClose={() => setPrintDoc(null)} />}
    </div>
  );
}
