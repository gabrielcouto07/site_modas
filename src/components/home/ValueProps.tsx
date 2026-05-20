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
          className="rounded-[2rem] border border-border bg-white p-6 shadow-card"
        >
          <item.icon className="mb-4 h-8 w-8 text-primary" />
          <h3 className="mb-2 font-medium">{item.title}</h3>
          <p className="text-sm text-foreground/70">{item.description}</p>
        </div>
      ))}
    </section>
  );
}
