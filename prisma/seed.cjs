/* Nạp dữ liệu mẫu vào CSDL SQLite local / D1 (chạy 1 lần sau khi tạo bảng mới).
   Cách chạy: node prisma/seed.cjs
   (chạy từ thư mục gốc của project; script tự đọc DATABASE_URL từ môi
   trường hoặc file .env). Dữ liệu mẫu lấy đúng từ các bảng dưới đây.
   Dữ liệu này cũng có sẵn dạng SQL cho D1 ở file mona-fashion-d1-v2.sql. */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

if (!process.env.DATABASE_URL) {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^DATABASE_URL=(.*)$/);
      if (m) process.env.DATABASE_URL = m[1].replace(/^"|"$/g, "");
    }
  }
}

const CATEGORIES = [
  { id: 1, name: "Accessories", slug: "accessories" },
  { id: 2, name: "Bags", slug: "bags" },
  { id: 3, name: "Footwear", slug: "footwear" },
  { id: 4, name: "Man", slug: "man" },
  { id: 5, name: "Woman", slug: "woman" },
];

const PRODUCTS = [
  { id: 1, categoryId: 1, name: "Guide Pack Cap", slug: "guide-pack-cap", description: "Mũ lưỡi trai tối giản, chất liệu cotton thoáng mát, phù hợp mọi outfit.", price: 50000, oldPrice: null, tag: "best", sizes: ["Free"] },
  { id: 2, categoryId: 5, name: "Blue Raincoat", slug: "blue-raincoat", description: "Áo khoác dài tông xanh pastel, form rộng thanh lịch cho mùa xuân.", price: 430000, oldPrice: null, tag: "best", sizes: ["S", "M", "L"] },
  { id: 3, categoryId: 5, name: "Cotton Jacket", slug: "cotton-jacket", description: "Áo jacket cotton mềm, màu be dễ phối đồ, điểm nhấn cho set đồ tối giản.", price: 100000, oldPrice: null, tag: "best", sizes: ["S", "M", "L", "XL"] },
  { id: 4, categoryId: 5, name: "Crewneck Blouse", slug: "crewneck-blouse", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", price: 215000, oldPrice: null, tag: "best", sizes: ["S", "M", "L"] },
  { id: 5, categoryId: 3, name: "Eather Trainers", slug: "eather-trainers", description: "Giày trainers màu nude, đế êm, phong cách tối giản Hàn Quốc.", price: 310000, oldPrice: null, tag: "new", sizes: ["36", "37", "38", "39", "40"] },
  { id: 6, categoryId: 5, name: "Cotton T-shirt", slug: "cotton-t-shirt", description: "Áo thun cotton màu cam đào, sale 26%, item must-have mùa hè.", price: 250000, oldPrice: 340000, tag: "sale", sizes: ["S", "M", "L", "XL"] },
  { id: 7, categoryId: 2, name: "Azure Tote", slug: "azure-tote", description: "Túi tote đen quai vàng, sale 20%, đựng vừa laptop 14 inch.", price: 200000, oldPrice: 250000, tag: "sale", sizes: ["Free"] },
  { id: 8, categoryId: 4, name: "Classic Topper", slug: "classic-topper", description: "Áo khoác dáng dài màu đen cổ điển, sang trọng và dễ phối.", price: 490000, oldPrice: null, tag: "new", sizes: ["M", "L", "XL"] },
];

const POSTS = [
  { id: 1, title: "FRIDAY FINEST THE BEST OF THE WEEK", slug: "friday-finest-the-best-of-the-week", category: "Shopping", excerpt: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...", content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...", imageUrl: "/images/posts/post-1.jpg" },
  { id: 2, title: "5 FASHION LABELS ON THE RISE THIS SUMMER", slug: "5-fashion-labels-on-the-rise-this-summer", category: "Inspiration", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", imageUrl: "/images/posts/post-2.jpg" },
  { id: 3, title: "A GUIDE TO THE BEST ACCESSORIES FOR FALL", slug: "a-guide-to-the-best-accessories-for-fall", category: "Inspiration", excerpt: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...", content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...", imageUrl: "/images/posts/post-3.jpg" },
  { id: 4, title: "THE BEST STREET STYLE FROM BROOKLYN'S 2016", slug: "the-best-street-style-from-brooklyns-2016", category: "Inspiration", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", imageUrl: "/images/posts/post-4.jpg" },
  { id: 5, title: "A MINIMALIST COAT IS A MUST FOR FALL", slug: "a-minimalist-coat-is-a-must-for-fall", category: "Fashion", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", imageUrl: "/images/posts/post-5.jpg" },
  { id: 6, title: "BEST DRESSED: THE WEEK IN OUTFITS", slug: "best-dressed-the-week-in-outfits", category: "Shopping", excerpt: "Sed in odio faucibus, sagittis lacus eu, tempor erat. Praesent tincidunt convallis vulputate. Donec enim...", content: "Sed in odio faucibus, sagittis lacus eu, tempor erat. Praesent tincidunt convallis vulputate. Donec enim...", imageUrl: "/images/posts/post-6.jpg" },
  { id: 7, title: "SLOW MORNINGS: A LIFESTYLE IN SOFT NEUTRALS", slug: "slow-mornings-a-lifestyle-in-soft-neutrals", category: "Lifestyle", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...", imageUrl: "/images/posts/post-7.jpg" },
  { id: 8, title: "LESS IS MORE: BUILDING A MINIMAL WARDROBE", slug: "less-is-more-building-a-minimal-wardrobe", category: "Minimalism", excerpt: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...", content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...", imageUrl: "/images/posts/post-8.jpg" },
];

async function main() {
  const prisma = new PrismaClient();
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice,
        tag: p.tag,
        images: {
          create: [
            { url: `/images/products/${p.slug}.jpg`, alt: p.name, sortOrder: 0 },
            { url: `/images/products/${p.slug}-2.jpg`, alt: p.name, sortOrder: 1 },
          ],
        },
        sizes: { create: p.sizes.map((size) => ({ size })) },
      },
    });
  }
  for (const post of POSTS) {
    await prisma.post.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }
  await prisma.user.upsert({
    where: { email: "demo@mona.local" },
    update: {},
    create: {
      name: "Khach Demo",
      email: "demo@mona.local",
      passwordHash:
        "scrypt$16384$8$1$dc6c84bf69cabfdf689da6e55ab1745f$607f40ca5c499ad1b9dddcacb2ff2439dd3d1a5ff4a6a7bf40ddc0e4554dd977",
      role: "customer",
    },
  });
  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    sizes: await prisma.productSize.count(),
    posts: await prisma.post.count(),
    users: await prisma.user.count(),
  };
  console.log("Seed xong:", counts);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
