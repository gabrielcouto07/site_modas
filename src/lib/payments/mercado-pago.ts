import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { env } from "../env";
import { logger } from "../logger";

const client = new MercadoPagoConfig({
  accessToken: env.MP_ACCESS_TOKEN,
  options: {
    timeout: 5000,
  },
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

export type PixPayload = {
  qrCodeBase64: string;
  qrCode: string;
  paymentId: string;
  status: string;
};

export async function createCheckoutPreference(params: {
  externalReference: string;
  title: string;
  unitPrice: number;
  quantity: number;
  payerEmail: string;
}) {
  if (!env.MP_ACCESS_TOKEN.startsWith("TEST-")) {
    const response = await preferenceClient.create({
      body: {
        external_reference: params.externalReference,
        items: [
          {
            id: params.externalReference,
            title: params.title,
            quantity: params.quantity,
            unit_price: params.unitPrice,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: params.payerEmail,
        },
      },
    });

    return {
      id: response.id,
      initPoint: response.init_point ?? "",
      sandboxInitPoint: response.sandbox_init_point ?? "",
    };
  }

  return {
    id: `pref_${params.externalReference}`,
    initPoint: "",
    sandboxInitPoint: "",
  };
}

export async function createPixPayment(params: {
  amount: number;
  email: string;
  description: string;
  externalReference: string;
}) {
  if (!env.MP_ACCESS_TOKEN.startsWith("TEST-")) {
    const response = await paymentClient.create({
      body: {
        transaction_amount: params.amount,
        description: params.description,
        payment_method_id: "pix",
        external_reference: params.externalReference,
        payer: {
          email: params.email,
        },
      },
    });

    return {
      qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64 ?? "",
      qrCode: response.point_of_interaction?.transaction_data?.qr_code ?? "",
      paymentId: String(response.id),
      status: response.status ?? "pending",
    } satisfies PixPayload;
  }

  return {
    qrCodeBase64:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iMjIwIiB2aWV3Qm94PSIwIDAgMjIwIDIyMCI+PHJlY3Qgd2lkdGg9IjIyMCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjE2MCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjIwIiB5PSIxNjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjgwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTEwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTQwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iODAiIHk9IjExMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTQwIiB5PSIxMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjExMCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=",
    qrCode:
      "00020101021226860014br.gov.bcb.pix2564pix-sandbox.camilamodas.com.br/checkout/CM123456520400005303986540510.005802BR5920Camila Modas LTDA6009SAO PAULO62070503***6304ABCD",
    paymentId: `pix_${params.externalReference}`,
    status: "pending",
  };
}

export async function createBoletoPayment(params: {
  amount: number;
  email: string;
  description: string;
  externalReference: string;
}) {
  if (!env.MP_ACCESS_TOKEN.startsWith("TEST-")) {
    const response = await paymentClient.create({
      body: {
        transaction_amount: params.amount,
        description: params.description,
        payment_method_id: "bolbradesco",
        external_reference: params.externalReference,
        payer: {
          email: params.email,
        },
      },
    });
    const boletoResponse = response as typeof response & {
      barcode?: { content?: string | null };
    };

    return {
      paymentId: String(boletoResponse.id),
      boletoUrl: boletoResponse.transaction_details?.external_resource_url ?? "",
      line: boletoResponse.barcode?.content ?? "",
    };
  }

  return {
    paymentId: `boleto_${params.externalReference}`,
    boletoUrl: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=demo",
    line: "34191.79001 01043.510047 91020.150008 8 99990000010000",
  };
}

export async function getPaymentById(paymentId: string) {
  try {
    if (paymentId.startsWith("pix_") || paymentId.startsWith("boleto_")) {
      return {
        id: paymentId,
        status: "approved",
        status_detail: "accredited",
      };
    }

    return await paymentClient.get({ id: paymentId });
  } catch (error) {
    logger.error({ error, paymentId }, "Erro ao consultar pagamento no Mercado Pago");
    throw error;
  }
}
