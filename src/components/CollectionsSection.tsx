import Link from "next/link";

const items = [
  {
    label: "LIFESTYLE",
    image: "/images/collections/lifestyle.jpg",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur placerat eu lacus in facilisis. Vivamus...",
  },
  {
    label: "MINIMALISM",
    image: "/images/collections/minimalism.jpg",
    excerpt:
      "Cras tincidunt egestas mollis. Nam vel scelerisque urna. Aenean tincidunt nunc ut fermentum sagittis. Maecenas...",
  },
  {
    label: "PHOTOGRAPHY",
    image: "/images/collections/photography.jpg",
    excerpt:
      "A continuing trend that drives designer\u2019s picks for fashion colors is the consumers\u2019 drive for...",
  },
];

function ExternalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
    </svg>
  );
}

export default function CollectionsSection() {
  return (
    <div id="collections" className="mt-16 scroll-mt-24">
      <h2 className="font-heading font-bold text-[20px] tracking-wide text-neutral-800">
        COLLECTIONS
      </h2>
      <div className="grid md:grid-cols-3 gap-7 mt-6">
        {items.map((item) => (
          <article key={item.label} className="bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.label}
              className="w-full aspect-[6/5] object-cover"
            />
            <div className="p-6 pt-5">
              <span className="inline-block font-heading font-semibold text-[13px] tracking-wide text-neutral-800 border-b-2 border-[#c9a86a] pb-1.5">
                {item.label}
              </span>
              <p className="text-[15px] text-neutral-500 leading-[1.9] mt-5 line-clamp-3">
                {item.excerpt}
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 mt-6 text-[13px] tracking-[0.15em] font-medium text-neutral-700 hover:text-black"
              >
                <ExternalIcon /> XEM NGAY
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
