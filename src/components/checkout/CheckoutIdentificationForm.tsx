"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveCheckoutProfile } from "@/lib/checkout-profile";
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
  const { toast } = useToast();
  const [loginLoading, setLoginLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
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

  async function persistProfile(values: FormValues) {
    await saveCheckoutProfile({
      identification: values,
    });
  }

  async function handleLogin() {
    const values = form.getValues();

    setLoginLoading(true);
    try {
      await persistProfile(values);
      await signIn("resend", {
        email: values.email.trim(),
        callbackUrl: "/checkout/entrega",
        redirect: true,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao iniciar login.");
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setSavingLoading(true);
        try {
          await persistProfile(values);
          setCheckoutDraft({ identification: values });
          router.push("/checkout/entrega");
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Nao foi possivel salvar o cliente."
          );
        } finally {
          setSavingLoading(false);
        }
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
      <div className="grid gap-3 sm:grid-cols-2">
        <Button className="w-full" type="submit" disabled={savingLoading}>
          {savingLoading ? "Salvando..." : "Continuar para entrega"}
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="outline"
          onClick={handleLogin}
          disabled={loginLoading}
        >
          {loginLoading ? "Enviando link..." : "Entrar com e-mail"}
        </Button>
      </div>
    </form>
  );
}
