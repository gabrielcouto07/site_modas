import { CouponKind, PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const categories = [
  { name: "Vestidos", slug: "vestidos", sortOrder: 1 },
  { name: "Blusas", slug: "blusas", sortOrder: 2 },
  { name: "Calças", slug: "calcas", sortOrder: 3 },
];

const products = [
  {
    name: "Vestido Midi Lino Nude",
    categorySlug: "vestidos",
    color: "Terracota",
    colorHex: "#c2856b",
    price: 259.9,
  },
  {
    name: "Vestido Chemise Off White",
    categorySlug: "vestidos",
    color: "Off-white",
    colorHex: "#f6f1eb",
    price: 289.9,
  },
  {
    name: "Vestido Alca Marinho Essencial",
    categorySlug: "vestidos",
    color: "Marinho",
    colorHex: "#24364d",
    price: 239.9,
  },
  {
    name: "Blusa Cropped Algodao Verde Oliva",
    categorySlug: "blusas",
    color: "Oliva",
    colorHex: "#6d7655",
    price: 129.9,
  },
  {
    name: "Blusa Ombro a Ombro Areia",
    categorySlug: "blusas",
    color: "Areia",
    colorHex: "#c9b8a4",
    price: 149.9,
  },
  {
    name: "Camisa Linho Preto Urbano",
    categorySlug: "blusas",
    color: "Preto",
    colorHex: "#1c1b1a",
    price: 189.9,
  },
  {
    name: "Calca Wide Leg Marinho",
    categorySlug: "calcas",
    color: "Marinho",
    colorHex: "#24364d",
    price: 219.9,
  },
  {
    name: "Calca Alfaiataria Areia",
    categorySlug: "calcas",
    color: "Areia",
    colorHex: "#c9b8a4",
    price: 239.9,
  },
  {
    name: "Calca Reta Preto Essencial",
    categorySlug: "calcas",
    color: "Preto",
    colorHex: "#1c1b1a",
    price: 199.9,
  },
  {
    name: "Saia Midi Terracota Leve",
    categorySlug: "vestidos",
    color: "Terracota",
    colorHex: "#c2856b",
    price: 179.9,
  },
  {
    name: "Regata Canelada Off White",
    categorySlug: "blusas",
    color: "Off-white",
    colorHex: "#f6f1eb",
    price: 99.9,
  },
  {
    name: "Calca Jogger Oliva Comfort",
    categorySlug: "calcas",
    color: "Oliva",
    colorHex: "#6d7655",
    price: 189.9,
  },
];

const description = (name: string) =>
  `
${name} foi pensado para acompanhar a rotina com leveza, caimento elegante e acabamento limpo. A modelagem valoriza o corpo sem prender, criando um visual feminino moderno que funciona do trabalho ao jantar.

A composição mistura fibras confortáveis com toque macio e boa respirabilidade. O resultado é uma peça versátil, com estrutura na medida certa e movimento natural ao vestir.

Cuidados: lavar à mão ou no ciclo delicado, secar à sombra e passar em temperatura baixa. Tamanhos PP ao GG. Medidas resumidas: busto 84-110 cm, cintura 66-94 cm, quadril 92-118 cm.
`.trim();

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const categoryMap = await prisma.category.findMany();

  for (const [index, product] of products.entries()) {
    const category = categoryMap.find((entry) => entry.slug === product.categorySlug);
    if (!category) continue;

    const slug = slugify(product.name);
    const baseSku = `CM-${String(index + 1).padStart(4, "0")}`;

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: description(product.name),
        categoryId: category.id,
        basePrice: product.price,
        compareAtPrice: product.price + 40,
        sku: baseSku,
        isActive: true,
        weightGrams: 450,
        widthCm: 25,
        heightCm: 8,
        lengthCm: 35,
      },
      create: {
        name: product.name,
        slug,
        description: description(product.name),
        categoryId: category.id,
        basePrice: product.price,
        compareAtPrice: product.price + 40,
        sku: baseSku,
        isActive: true,
        weightGrams: 450,
        widthCm: 25,
        heightCm: 8,
        lengthCm: 35,
        images: {
          create: [
            {
              url: `/products/placeholder/${String(index + 1).padStart(2, "0")}.webp`,
              alt: product.name,
              sortOrder: 1,
            },
          ],
        },
        variants: {
          create: ["P", "M", "G"].map((size, variantIndex) => ({
            size,
            color: product.color,
            colorHex: product.colorHex,
            stock: 10 + variantIndex * 4,
            sku: `${baseSku}-${size}`,
          })),
        },
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "PIX10" },
    update: {},
    create: {
      code: "PIX10",
      kind: CouponKind.PERCENT,
      value: 10,
      isActive: true,
    },
  });

  const passwordHash = await hash(process.env["ADMIN_PASSWORD"] ?? "admin123", 10);
  await prisma.user.upsert({
    where: { email: process.env["ADMIN_EMAIL"] ?? "admin@camilamodas.com.br" },
    update: {
      name: "Camila Admin",
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email: process.env["ADMIN_EMAIL"] ?? "admin@camilamodas.com.br",
      name: "Camila Admin",
      role: Role.ADMIN,
      passwordHash,
      phone: "11999999999",
      cpf: "12345678909",
    },
  });

  console.log("Seed concluido.");
  console.log("Admin:", process.env["ADMIN_EMAIL"] ?? "admin@camilamodas.com.br");
  console.log("Senha:", process.env["ADMIN_PASSWORD"] ?? "admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
