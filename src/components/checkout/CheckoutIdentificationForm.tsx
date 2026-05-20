"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCPF, formatPhone } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  phone: z.string().min(10),
  cpf: z.string().min(11),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutIdentificationForm() {
  const router = useRouter();
  const draft = useUiStore((state) => state.checkoutDraft.identification);
  const setCheckoutDraft = useUiStore((state) => state.setCheckoutDraft);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: draft ?? {
      email: "",
      name: "",
      phone: "",
      cpf: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        setCheckoutDraft({ identification: values });
        router.push("/checkout/entrega");
      })}
    >
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" {...form.register("email")} />
      </div>
      <div>
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" {...form.register("name")} />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          {...form.register("phone")}
          onChange={(event) => form.setValue("phone", formatPhone(event.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          {...form.register("cpf")}
          onChange={(event) => form.setValue("cpf", formatCPF(event.target.value))}
        />
      </div>
      <Button className="w-full" type="submit">
        Continuar para entrega
      </Button>
    </form>
  );
}
