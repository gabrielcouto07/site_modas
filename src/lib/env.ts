import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(12),
  AUTH_TRUST_HOST: z.string().default("true"),
  MP_ACCESS_TOKEN: z.string().min(1),
  MP_PUBLIC_KEY: z.string().min(1),
  MP_WEBHOOK_SECRET: z.string().min(1),
  MP_SANDBOX_MODE: z.enum(["true", "false"]).default("true"),
  MELHOR_ENVIO_TOKEN: z.string().optional(),
  MELHOR_ENVIO_SANDBOX: z.enum(["true", "false"]).default("true"),
  SHIPPING_ORIGIN_ZIP: z.string().min(8),
  SHIPPING_FREE_THRESHOLD: z.string().default("299"),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(6),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variaveis de ambiente invalidas", parsed.error.flatten().fieldErrors);
  throw new Error("Falha ao validar as variaveis de ambiente.");
}

export const env = {
  ...parsed.data,
  authTrustHost: parsed.data.AUTH_TRUST_HOST === "true",
  melhorEnvioSandbox: parsed.data.MELHOR_ENVIO_SANDBOX === "true",
  mercadoPagoSandbox: parsed.data.MP_SANDBOX_MODE === "true",
  shippingFreeThreshold: Number(parsed.data.SHIPPING_FREE_THRESHOLD),
};
