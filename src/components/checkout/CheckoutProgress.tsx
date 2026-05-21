import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
  { href: "/checkout/identificacao", label: "Entrar" },
  { href: "/checkout/entrega", label: "Entrega" },
  { href: "/checkout/pagamento", label: "Pagamento" },
];

export function CheckoutProgress({ activeStep }: { activeStep: number }) {
  return (
    <div className="rounded-[2rem] border border-border/70 bg-white/85 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < activeStep;
          const isActive = stepNumber === activeStep;

          return (
            <Link
              key={step.href}
              href={step.href}
              className={cn(
                "flex items-center gap-3 rounded-[1.25rem] border px-4 py-3 transition",
                isActive ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  isComplete
                    ? "bg-success/10 text-success"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground/60"
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">
                  Etapa {stepNumber}
                </p>
                <p className="font-medium text-foreground">{step.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
