import { CreditCard, PackageCheck, ShieldCheck } from "lucide-react";

const items = [
  {
    title: "Pagamento seguro",
    description: "Pix, cartao e boleto com fluxo pensado para o Brasil.",
    icon: ShieldCheck,
  },
  {
    title: "Troca descomplicada",
    description: "Politicas claras e prazo de ate 30 dias para troca.",
    icon: PackageCheck,
  },
  {
    title: "Parcelamento flexivel",
    description: "Checkout pronto para evoluir do sandbox ao ambiente real.",
    icon: CreditCard,
  },
];

export function ValueProps() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-card"
        >
          <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="mb-2 font-medium text-foreground">{item.title}</h3>
          <p className="text-sm leading-6 text-foreground/68">{item.description}</p>
        </div>
      ))}
    </section>
  );
}
