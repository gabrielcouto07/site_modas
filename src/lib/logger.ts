import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "email",
      "cpf",
      "phone",
      "payload.payer",
    ],
    censor: "[redacted]",
  },
});
