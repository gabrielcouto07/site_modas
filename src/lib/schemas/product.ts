import { z } from "zod";

const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "Informe o link da imagem.")
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "Use uma URL completa ou um caminho interno iniciado com /."
  );

export const productVariantSchema = z.object({
  id: z.string().optional(),
  size: z.string().trim().min(1, "Informe o tamanho."),
  color: z.string().trim().min(1, "Informe a cor."),
  colorHex: z
    .string()
    .trim()
    .regex(/^#([a-fA-F0-9]{6})$/, "Use a cor no formato #A1B2C3."),
  stock: z.number().int().nonnegative("O estoque nao pode ser negativo."),
  sku: z.string().trim().min(3, "Informe o SKU da variacao."),
});

export const productSchema = z
  .object({
    name: z.string().trim().min(3, "Informe o nome do produto."),
    slug: z.string().trim().min(3, "Informe o link do produto."),
    description: z.string().trim().min(30, "Escreva uma descricao com pelo menos 30 caracteres."),
    categoryId: z.string().trim().min(1, "Escolha uma categoria."),
    basePrice: z.number().positive("Informe um preco atual maior que zero."),
    compareAtPrice: z
      .number()
      .positive("O preco de antes precisa ser maior que zero.")
      .optional()
      .nullable(),
    sku: z.string().trim().min(3, "Informe o SKU principal."),
    isActive: z.boolean().default(true),
    weightGrams: z.number().int().positive("Informe o peso em gramas."),
    widthCm: z.number().int().positive("Informe a largura."),
    heightCm: z.number().int().positive("Informe a altura."),
    lengthCm: z.number().int().positive("Informe o comprimento."),
    images: z
      .array(
        z.object({
          url: imageUrlSchema,
          alt: z.string().trim().min(3, "Descreva a imagem para facilitar a identificacao."),
          sortOrder: z.number().int().nonnegative("A ordem da imagem nao pode ser negativa."),
        })
      )
      .min(1, "Adicione pelo menos uma imagem."),
    variants: z.array(productVariantSchema).min(1, "Adicione pelo menos uma variacao."),
  })
  .superRefine((data, ctx) => {
    if (
      data.compareAtPrice !== undefined &&
      data.compareAtPrice !== null &&
      data.compareAtPrice <= data.basePrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compareAtPrice"],
        message:
          "O preco de antes precisa ser maior que o preco atual para a promocao ficar valida.",
      });
    }

    const variantKeys = new Set<string>();
    for (const [index, variant] of data.variants.entries()) {
      const key = `${variant.size.toLowerCase()}::${variant.color.toLowerCase()}`;
      if (variantKeys.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "color"],
          message: "Ja existe uma variacao com esse tamanho e essa cor.",
        });
        continue;
      }

      variantKeys.add(key);
    }

    const imageUrls = new Set<string>();
    for (const [index, image] of data.images.entries()) {
      const normalizedUrl = image.url.toLowerCase();
      if (imageUrls.has(normalizedUrl)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["images", index, "url"],
          message: "Essa imagem ja foi adicionada.",
        });
        continue;
      }

      imageUrls.add(normalizedUrl);
    }
  });

export type ProductInput = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
