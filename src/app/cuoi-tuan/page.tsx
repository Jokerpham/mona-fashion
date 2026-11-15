import Link from "next/link";

type EventItem = {
  day: string;
  title: string;
  time: string;
  place: string;
  desc: string;
  source: string;
  sourceLabel: string;
};

const events: EventItem[] = [
  {
    day: "Thứ Bảy 31/10",
    title: "Saigon Beauty Show 2026 & K-Beauty Expo Vietnam",
    time: "10:00–17:00",
    place: "SECC, 799 Nguyễn Văn Linh, Tân Mỹ, TP.HCM",
    desc: "Triển lãm mỹ phẩm, sản phẩm và dịch vụ làm đẹp — hợp đi kèm một vòng mua sắm thời trang cuối tuần.",
    source: "https://cityhousebooking.com/en/october-2026-events-ho-chi-minh-city",
    sourceLabel: "CityHouse — Lịch sự kiện tháng 10",
  },
  {
    day: "Thứ Bảy 31/10",
    title: "Coffee Expo Vietnam 2026 (ngày cuối)",
    time: "10:00–16:00",
    place: "SECC, 799 Nguyễn Văn Linh, Tân Mỹ, TP.HCM",
    desc: "Cà phê, trà, bánh và thiết bị F&B, kỷ niệm 10 năm tổ chức; vào cửa miễn phí.",
    source: "https://cityhousebooking.com/en/october-2026-events-ho-chi-minh-city",
    sourceLabel: "CityHouse — Lịch sự kiện tháng 10",
  },
  {
    day: "Cả cuối tuần",
    title: "Chợ Tân Bình",
    time: "07:00–17:30",
    place: "172 Lý Thường Kiệt, Tân Bình, TP.HCM",
    desc: "Ngay gần shop MONA, hơn 3.000 sạp quần áo và váy cưới giá sỉ. Nhớ trả giá và kiểm tra đường may trước khi mua.",
    source: "https://vietpowertravel.com/blog/ho-chi-minh-clothes-market.html",
    sourceLabel: "Vietpower Travel — Chợ quần áo TP.HCM",
  },
  {
    day: "Thứ Bảy 31/10",
    title: "Dead Man's Party Vol IV — Đêm Halloween",
    time: "Từ 19:00",
    place: "142 Trần Não, An Khánh, Thủ Đức, TP.HCM",
    desc: "Tiệc Halloween buổi tối thứ Bảy với 5 ban nhạc — lựa chọn đi chơi đêm sau một ngày mua sắm.",
    source: "https://allevents.in/ho-chi-minh-city/november",
    sourceLabel: "AllEvents — Sự kiện tháng 11 tại TP.HCM",
  },
  {
    day: "Chủ Nhật 01/11",
    title: "PIANO RECITAL: The Warsaw Concerto",
    time: "19:00",
    place: "Tầng 6, Crescent Mall, 101 Tôn Dật Tiên, Tân Mỹ, TP.HCM",
    desc: "Hòa nhạc cổ điển cho buổi tối Chủ Nhật, khép lại cuối tuần nhẹ nhàng.",
    source: "https://allevents.in/ho-chi-minh-city/november",
    sourceLabel: "AllEvents — Sự kiện tháng 11 tại TP.HCM",
  },
];

export default function CuoiTuanPage() {
  return (
    <div className="bg-white">
      <section className="container-x pt-14 pb-10">
        <p className="text-[13px] font-medium tracking-[0.25em] text-neutral-500">
          MONA GỢI Ý CUỐI TUẦN
        </p>
        <h1 className="font-heading font-light text-4xl md:text-5xl tracking-wide mt-4">
          Cuối tuần này gần bạn
        </h1>
        <p className="text-neutral-500 mt-4 text-[15px] leading-relaxed max-w-2xl">
          Thứ Bảy 31/10 – Chủ Nhật 01/11/2026 • Tân Bình, TP.HCM. Vài điểm đi
          chơi, mua sắm và xem triển lãm quanh thành phố, gom lại một chỗ để
          bạn khỏi phải tìm.
        </p>
      </section>

      <section className="container-x pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <article key={ev.title} className="bg-white border shadow-sm p-6 flex flex-col">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-neutral-500">
                {ev.day.toUpperCase()}
              </p>
              <h2 className="font-heading font-semibold text-[19px] leading-snug mt-3">
                {ev.title}
              </h2>
              <p className="text-[15px] mt-4">
                <span className="font-medium">Giờ: </span>
                {ev.time}
              </p>
              <p className="text-[15px] mt-1">
                <span className="font-medium">Địa điểm: </span>
                {ev.place}
              </p>
              <p className="text-neutral-600 text-[15px] leading-relaxed mt-3 flex-1">
                {ev.desc}
              </p>
              <a
                href={ev.source}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline mt-5 hover:text-black"
              >
                Xem nguồn: {ev.sourceLabel} →
              </a>
            </article>
          ))}

          <article className="bg-[#171a21] text-white p-6 flex flex-col shadow-sm">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-neutral-300">
              GỢI Ý TỪ MONA
            </p>
            <h2 className="font-heading font-semibold text-[19px] leading-snug mt-3">
              Mua sắm cuối tuần ở MONA
            </h2>
            <p className="text-neutral-300 text-[15px] leading-relaxed mt-4 flex-1">
              Trước khi đi chơi, ghé Shop xem đồ mới: chương trình “Mua 1 tặng
              1” đang chạy trên trang chủ. Chọn đồ xong rồi hãy đi, cuối tuần
              mặc đồ mới đi chơi luôn.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-block bg-white text-black px-6 py-3 text-sm font-semibold text-center hover:bg-neutral-200 transition"
            >
              VÀO SHOP
            </Link>
          </article>
        </div>

        <p className="text-xs text-neutral-500 mt-8 leading-relaxed max-w-3xl">
          Lưu ý: thông tin sự kiện lấy từ các trang tổng hợp sự kiện (link nguồn
          ở từng thẻ), giờ giấc có thể thay đổi — nên kiểm tra lại trước khi đi,
          nhất là giờ đóng cửa ngày cuối của các triển lãm ở SECC.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <Link
            href="/"
            className="bg-[#171a21] text-white px-8 py-3.5 text-sm tracking-[0.2em] hover:bg-black transition"
          >
            VỀ TRANG CHỦ
          </Link>
          <Link
            href="/shop"
            className="border border-black px-8 py-3.5 text-sm tracking-[0.2em] hover:bg-black hover:text-white transition"
          >
            VÀO SHOP
          </Link>
        </div>
      </section>
    </div>
  );
}
