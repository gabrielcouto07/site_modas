"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ProductFormInput, productSchema } from "@/lib/schemas/product";
import { formatBRL } from "@/lib/utils";

function SectionCard({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">{eyebrow}</p>
          <h2 className="font-serif text-2xl tracking-tight text-foreground">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-foreground/65">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function FieldMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-rose-600">{message}</p>;
}

function SummaryMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function ProductEditor({
  categories,
  initialData,
  productId,
}: {
  categories: Array<{ id: string; name: string }>;
  initialData?: ProductFormInput;
  productId?: string;
}) {
  const router = useRouter();
  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? {
      name: "",
      slug: "",
      description: "",
      categoryId: categories[0]?.id ?? "",
      basePrice: 0,
      compareAtPrice: null,
      sku: "",
      isActive: true,
      weightGrams: 450,
      widthCm: 25,
      heightCm: 8,
      lengthCm: 35,
      images: [
        { url: "/products/placeholder/01.webp", alt: "Foto principal do produto", sortOrder: 1 },
      ],
      variants: [
        {
          size: "M",
          color: "Terracota",
          colorHex: "#c2856b",
          stock: 10,
          sku: "CM-EDIT-M",
        },
      ],
    },
  });

  const imagesFieldArray = useFieldArray({
    control: form.control,
    name: "images",
    keyName: "_key",
  });
  const variantsFieldArray = useFieldArray({
    control: form.control,
    name: "variants",
    keyName: "_key",
  });

  const errors = form.formState.errors;
  const watchedImages = form.watch("images") ?? [];
  const watchedVariants = form.watch("variants") ?? [];
  const watchedName = form.watch("name");
  const watchedCategoryId = form.watch("categoryId");
  const watchedBasePrice = form.watch("basePrice");
  const watchedCompareAtPrice = form.watch("compareAtPrice");
  const watchedIsActive = form.watch("isActive");

  const previewImage = watchedImages[0]?.url || "/products/placeholder/01.webp";
  const totalStock = watchedVariants.reduce(
    (total, variant) => total + Math.max(variant?.stock ?? 0, 0),
    0
  );
  const lowStockCount = watchedVariants.filter((variant) => (variant?.stock ?? 0) < 5).length;
  const activeCategory =
    categories.find((category) => category.id === watchedCategoryId)?.name ?? "Sem categoria";
  const compareAtFilled = watchedCompareAtPrice !== null && watchedCompareAtPrice !== undefined;

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
      onSubmit={form.handleSubmit(async (values) => {
        const method = productId ? "PUT" : "POST";
        const endpoint = productId ? `/api/produtos/${productId}` : "/api/produtos";

        try {
          const response = await fetch(endpoint, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          if (!response.ok) {
            const result = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(result?.error ?? "Nao foi possivel salvar o produto.");
          }

          toast.success(productId ? "Produto atualizado" : "Produto cadastrado");
          router.push("/admin/produtos");
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Nao foi possivel salvar.");
        }
      })}
    >
      <div className="space-y-6">
        <SectionCard
          eyebrow="Produto"
          title="Dados principais do produto"
          description="Preencha o nome, o link, a categoria e a descricao da peca. Essas informacoes aparecem na loja e ajudam na busca."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da peca</Label>
              <Input id="name" placeholder="Vestido midi em linho" {...form.register("name")} />
              <FieldMessage message={errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Link do produto</Label>
              <Input id="slug" placeholder="vestido-midi-linho" {...form.register("slug")} />
              <p className="text-xs text-foreground/55">
                Use um texto curto, sem espacos, para formar o link.
              </p>
              <FieldMessage message={errors.slug?.message} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <select
                id="categoryId"
                className="h-11 w-full rounded-2xl border border-border bg-white px-4"
                {...form.register("categoryId")}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FieldMessage message={errors.categoryId?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU principal</Label>
              <Input id="sku" placeholder="CM-123" {...form.register("sku")} />
              <p className="text-xs text-foreground/55">
                Codigo interno para localizar a peca com rapidez.
              </p>
              <FieldMessage message={errors.sku?.message} />
            </div>
            <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                Categoria atual
              </p>
              <p className="mt-2 font-medium text-foreground">{activeCategory}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Descreva tecido, caimento, modelagem e o que a cliente precisa saber antes de comprar."
              {...form.register("description")}
            />
            <p className="text-xs text-foreground/55">
              Escreva de um jeito simples, como voce explicaria a peca em uma venda pelo WhatsApp.
            </p>
            <FieldMessage message={errors.description?.message} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="weightGrams">Peso em gramas</Label>
              <Input
                id="weightGrams"
                type="number"
                placeholder="450"
                {...form.register("weightGrams", { valueAsNumber: true })}
              />
              <FieldMessage message={errors.weightGrams?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lengthCm">Comprimento da embalagem</Label>
              <Input
                id="lengthCm"
                type="number"
                placeholder="35"
                {...form.register("lengthCm", { valueAsNumber: true })}
              />
              <FieldMessage message={errors.lengthCm?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="widthCm">Largura da embalagem</Label>
              <Input
                id="widthCm"
                type="number"
                placeholder="25"
                {...form.register("widthCm", { valueAsNumber: true })}
              />
              <FieldMessage message={errors.widthCm?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heightCm">Altura da embalagem</Label>
              <Input
                id="heightCm"
                type="number"
                placeholder="8"
                {...form.register("heightCm", { valueAsNumber: true })}
              />
              <FieldMessage message={errors.heightCm?.message} />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Imagens"
          title="Imagens do produto"
          description="Cole o link de cada foto. A primeira imagem vira a capa do produto e as demais ficam na galeria."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                imagesFieldArray.append({
                  url: "/products/placeholder/01.webp",
                  alt: "Nova foto do produto",
                  sortOrder: watchedImages.length + 1,
                })
              }
            >
              Adicionar imagem
            </Button>
          }
        >
          <div className="space-y-4">
            {imagesFieldArray.fields.map((field, index) => {
              const image = watchedImages[index];

              return (
                <div
                  key={field._key}
                  className="grid gap-4 rounded-[1.75rem] border border-border/70 bg-background p-4 md:grid-cols-[112px_minmax(0,1fr)]"
                >
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-white">
                    {/* biome-ignore lint/performance/noImgElement: admin preview precisa aceitar links livres informados pela operacao. */}
                    <img
                      src={image?.url || "/products/placeholder/01.webp"}
                      alt={image?.alt || "Preview da imagem"}
                      className="h-28 w-full object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_110px]">
                      <div className="space-y-2">
                        <Label htmlFor={`images.${index}.url`}>Link da imagem</Label>
                        <Input
                          id={`images.${index}.url`}
                          placeholder="/products/vestido-01.webp"
                          {...form.register(`images.${index}.url`)}
                        />
                        <p className="text-xs text-foreground/55">
                          Pode ser um caminho interno da loja ou uma URL completa.
                        </p>
                        <FieldMessage message={errors.images?.[index]?.url?.message} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`images.${index}.alt`}>Descricao da foto</Label>
                        <Input
                          id={`images.${index}.alt`}
                          placeholder="Vestido midi visto de frente"
                          {...form.register(`images.${index}.alt`)}
                        />
                        <FieldMessage message={errors.images?.[index]?.alt?.message} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`images.${index}.sortOrder`}>Ordem</Label>
                        <Input
                          id={`images.${index}.sortOrder`}
                          type="number"
                          min={0}
                          {...form.register(`images.${index}.sortOrder`, { valueAsNumber: true })}
                        />
                        <FieldMessage message={errors.images?.[index]?.sortOrder?.message} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => imagesFieldArray.remove(index)}
                        disabled={imagesFieldArray.fields.length === 1}
                      >
                        Remover imagem
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <FieldMessage message={errors.images?.message} />
        </SectionCard>

        <SectionCard
          eyebrow="Variacoes"
          title="Variacoes"
          description="Cadastre cada combinacao de tamanho e cor separadamente para evitar erro no estoque."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                variantsFieldArray.append({
                  size: "M",
                  color: "Nova cor",
                  colorHex: "#1f1f1f",
                  stock: 1,
                  sku: `VAR-${watchedVariants.length + 1}`,
                })
              }
            >
              Adicionar variacao
            </Button>
          }
        >
          <div className="space-y-4">
            {variantsFieldArray.fields.map((field, index) => {
              const variant = watchedVariants[index];
              const stock = variant?.stock ?? 0;

              return (
                <div
                  key={field._key}
                  className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">Variacao {index + 1}</p>
                      <p className="text-sm text-foreground/60">
                        Deixe tamanho, cor e estoque sempre preenchidos.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          stock < 5
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {stock < 5 ? "Estoque baixo" : `${stock} unidade(s)`}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => variantsFieldArray.remove(index)}
                        disabled={variantsFieldArray.fields.length === 1}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <div className="space-y-2">
                      <Label htmlFor={`variants.${index}.size`}>Tamanho</Label>
                      <Input
                        id={`variants.${index}.size`}
                        placeholder="M"
                        {...form.register(`variants.${index}.size`)}
                      />
                      <FieldMessage message={errors.variants?.[index]?.size?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`variants.${index}.color`}>Cor</Label>
                      <Input
                        id={`variants.${index}.color`}
                        placeholder="Terracota"
                        {...form.register(`variants.${index}.color`)}
                      />
                      <FieldMessage message={errors.variants?.[index]?.color?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`variants.${index}.colorHex`}>Cor em hex</Label>
                      <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3">
                        <span
                          className="h-5 w-5 rounded-full border border-black/10"
                          style={{ backgroundColor: variant?.colorHex || "#ffffff" }}
                        />
                        <Input
                          id={`variants.${index}.colorHex`}
                          placeholder="#c2856b"
                          className="border-0 px-0 shadow-none focus-visible:ring-0"
                          {...form.register(`variants.${index}.colorHex`)}
                        />
                      </div>
                      <FieldMessage message={errors.variants?.[index]?.colorHex?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`variants.${index}.stock`}>Estoque</Label>
                      <Input
                        id={`variants.${index}.stock`}
                        type="number"
                        min={0}
                        {...form.register(`variants.${index}.stock`, { valueAsNumber: true })}
                      />
                      <FieldMessage message={errors.variants?.[index]?.stock?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`variants.${index}.sku`}>SKU da variacao</Label>
                      <Input
                        id={`variants.${index}.sku`}
                        placeholder="CM-M-TRC"
                        {...form.register(`variants.${index}.sku`)}
                      />
                      <FieldMessage message={errors.variants?.[index]?.sku?.message} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <FieldMessage message={errors.variants?.message} />
        </SectionCard>

        <SectionCard
          eyebrow="Estoque"
          title="Estoque"
          description="Use este resumo para bater o total e enxergar rapido quais variacoes precisam de reposicao."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryMetric label="Variacoes" value={watchedVariants.length} />
            <SummaryMetric label="Total em estoque" value={totalStock} />
            <SummaryMetric label="Com estoque baixo" value={lowStockCount} />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/70">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-background/80 text-left text-foreground/55">
                <tr>
                  <th className="px-4 py-3">Tamanho</th>
                  <th className="px-4 py-3">Cor</th>
                  <th className="px-4 py-3">Hex</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Estoque</th>
                </tr>
              </thead>
              <tbody>
                {variantsFieldArray.fields.map((field, index) => {
                  const variant = watchedVariants[index];

                  return (
                    <tr key={field._key} className="border-t bg-white">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {variant?.size || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: variant?.colorHex || "#ffffff" }}
                          />
                          {variant?.color || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground/65">{variant?.colorHex || "-"}</td>
                      <td className="px-4 py-3 text-foreground/65">{variant?.sku || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{variant?.stock ?? 0}</span>
                        {(variant?.stock ?? 0) < 5 ? (
                          <span className="ml-2 inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
                            Repor
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Preco"
          title="Preco"
          description="O preco atual e o valor cobrado no carrinho. Se houver promocao, informe o preco de antes no segundo campo."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Preco atual</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                placeholder="189.90"
                {...form.register("basePrice", { valueAsNumber: true })}
              />
              <p className="text-xs text-foreground/55">
                Esse valor aparece como principal na loja e vai para o checkout.
              </p>
              <FieldMessage message={errors.basePrice?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Preco de antes (opcional)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                placeholder="229.90"
                {...form.register("compareAtPrice", {
                  setValueAs: (value) => {
                    if (value === "" || value === null || value === undefined) {
                      return null;
                    }

                    const parsed = Number(value);
                    return Number.isNaN(parsed) ? null : parsed;
                  },
                })}
              />
              <p className="text-xs text-foreground/55">
                Preencha somente se quiser mostrar a promocao com valor antigo riscado.
              </p>
              <FieldMessage message={errors.compareAtPrice?.message} />
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background px-4 py-4 text-sm text-foreground/68">
            {compareAtFilled ? (
              <p>A promocao fica valida quando o preco atual e menor que o preco de antes.</p>
            ) : (
              <p>Se nao houver promocao, deixe o preco de antes em branco.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Publicacao"
          title="Publicacao e ativacao"
          description="Use esta chave para decidir se o produto aparece na loja agora ou fica oculto ate estar pronto."
        >
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                {watchedIsActive ? "Produto visivel na loja" : "Produto oculto por enquanto"}
              </p>
              <p className="text-sm text-foreground/60">
                Pode salvar mesmo oculto e publicar depois, quando fotos e estoque estiverem
                conferidos.
              </p>
            </div>
            <label
              htmlFor="isActive"
              className="flex cursor-pointer items-center gap-3 rounded-full border border-border bg-white px-4 py-3"
            >
              <input
                id="isActive"
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                {...form.register("isActive")}
              />
              <span className="text-sm font-medium text-foreground">Ativar produto</span>
            </label>
          </div>
        </SectionCard>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-white/90 shadow-sm">
          <div className="aspect-[4/5] bg-muted">
            {/* biome-ignore lint/performance/noImgElement: admin preview precisa aceitar links livres informados pela operacao. */}
            <img
              src={previewImage}
              alt={watchedName || "Preview do produto"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Resumo</p>
              <h3 className="mt-2 font-serif text-2xl text-foreground">
                {watchedName || "Nome do produto"}
              </h3>
              <p className="mt-1 text-sm text-foreground/60">{activeCategory}</p>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/70 bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Preco atual</span>
                <strong>{formatBRL(Number(watchedBasePrice || 0))}</strong>
              </div>
              {compareAtFilled ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">Preco de antes</span>
                  <span className="text-sm text-foreground/50 line-through">
                    {formatBRL(Number(watchedCompareAtPrice || 0))}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Status</span>
                <span className="text-sm font-medium text-foreground">
                  {watchedIsActive ? "Publicado" : "Oculto"}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <SummaryMetric label="Imagens" value={watchedImages.length} />
              <SummaryMetric label="Variacoes" value={watchedVariants.length} />
              <SummaryMetric label="Estoque total" value={totalStock} />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] p-6 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Salvar</p>
            <p className="text-sm text-foreground/65">
              Revise o resumo ao lado. Quando salvar, o produto ja fica pronto para catalogo e
              checkout.
            </p>
          </div>
          <Button type="submit" size="lg" className="w-full">
            Salvar produto
          </Button>
        </section>
      </aside>
    </form>
  );
}
