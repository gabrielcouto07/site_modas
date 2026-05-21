"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCustomerUpdateFormInput } from "@/lib/schemas/admin";
import { adminCustomerUpdateSchema } from "@/lib/schemas/admin";

export function CustomerEditor({
  customerId,
  initialData,
}: {
  customerId: string;
  initialData: AdminCustomerUpdateFormInput;
}) {
  const router = useRouter();
  const form = useForm<AdminCustomerUpdateFormInput>({
    resolver: zodResolver(adminCustomerUpdateSchema),
    defaultValues: initialData,
  });
  const addresses = useFieldArray({
    control: form.control,
    name: "addresses",
    keyName: "_key",
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          const response = await fetch(`/api/admin/clientes/${customerId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          if (!response.ok) {
            const result = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(result?.error ?? "Não foi possível atualizar o cliente.");
          }

          toast.success("Cliente atualizado");
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Não foi possível atualizar.");
        }
      })}
    >
      <section className="space-y-4 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Dados principais</p>
          <h2 className="font-serif text-2xl tracking-tight text-foreground">Perfil do cliente</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Nome completo" {...form.register("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@email.com"
              {...form.register("email")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              {...form.register("phone", {
                setValueAs: (value) => (value === "" ? undefined : value),
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              {...form.register("cpf", {
                setValueAs: (value) => (value === "" ? undefined : value),
              })}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Endereços</p>
            <h2 className="font-serif text-2xl tracking-tight text-foreground">
              Lista de endereços
            </h2>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addresses.append({
                label: "Principal",
                recipient: form.getValues("name") || "Cliente",
                zip: "",
                street: "",
                number: "",
                complement: undefined,
                district: "",
                city: "",
                state: "SP",
                isDefault: addresses.fields.length === 0,
              })
            }
          >
            Adicionar endereço
          </Button>
        </div>

        <div className="space-y-4">
          {addresses.fields.length ? (
            addresses.fields.map((field, index) => (
              <div
                key={field._key}
                className="space-y-4 rounded-2xl border border-border/70 bg-background p-4"
              >
                <input type="hidden" {...form.register(`addresses.${index}.id`)} />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor={`addresses.${index}.label`}>Nome do endereço</Label>
                    <Input
                      id={`addresses.${index}.label`}
                      placeholder="Casa / Trabalho"
                      {...form.register(`addresses.${index}.label`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`addresses.${index}.recipient`}>Recebedor</Label>
                    <Input
                      id={`addresses.${index}.recipient`}
                      placeholder="Nome de quem recebe"
                      {...form.register(`addresses.${index}.recipient`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`addresses.${index}.zip`}>CEP</Label>
                    <Input
                      id={`addresses.${index}.zip`}
                      placeholder="00000000"
                      {...form.register(`addresses.${index}.zip`)}
                    />
                  </div>
                  <div className="flex items-end gap-3 rounded-2xl border border-border/70 bg-white px-4 py-3">
                    <input
                      id={`addresses.${index}.isDefault`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-border"
                      {...form.register(`addresses.${index}.isDefault`)}
                    />
                    <Label htmlFor={`addresses.${index}.isDefault`} className="cursor-pointer">
                      Padrão
                    </Label>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2 xl:col-span-2">
                    <Label htmlFor={`addresses.${index}.street`}>Rua</Label>
                    <Input
                      id={`addresses.${index}.street`}
                      placeholder="Rua das Flores"
                      {...form.register(`addresses.${index}.street`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`addresses.${index}.number`}>Número</Label>
                    <Input
                      id={`addresses.${index}.number`}
                      placeholder="123"
                      {...form.register(`addresses.${index}.number`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`addresses.${index}.district`}>Bairro</Label>
                    <Input
                      id={`addresses.${index}.district`}
                      placeholder="Centro"
                      {...form.register(`addresses.${index}.district`)}
                    />
                  </div>
                  <div className="space-y-2 xl:col-span-2">
                    <Label htmlFor={`addresses.${index}.city`}>Cidade</Label>
                    <Input
                      id={`addresses.${index}.city`}
                      placeholder="São Paulo"
                      {...form.register(`addresses.${index}.city`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`addresses.${index}.state`}>Estado</Label>
                    <Input
                      id={`addresses.${index}.state`}
                      placeholder="SP"
                      maxLength={2}
                      {...form.register(`addresses.${index}.state`)}
                    />
                  </div>
                  <div className="space-y-2 xl:col-span-2">
                    <Label htmlFor={`addresses.${index}.complement`}>Complemento</Label>
                    <Input
                      id={`addresses.${index}.complement`}
                      placeholder="Apto 12"
                      {...form.register(`addresses.${index}.complement`, {
                        setValueAs: (value) => (value === "" ? undefined : value),
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => addresses.remove(index)}
                    disabled={addresses.fields.length === 1}
                  >
                    Remover endereço
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-background p-6 text-sm text-foreground/60">
              Nenhum endereço salvo. Adicione o primeiro endereço para manter o cadastro completo.
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-end rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] p-6 shadow-sm">
        <Button type="submit" size="lg">
          Salvar cliente
        </Button>
      </div>
    </form>
  );
}
