import Image from "next/image";

type CheckoutVisualPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  images: [string, string, string];
};

export function CheckoutVisualPanel({
  eyebrow,
  title,
  description,
  note,
  images,
}: CheckoutVisualPanelProps) {
  return (
    <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
        <div className="relative min-h-72 overflow-hidden rounded-[1.75rem] bg-white/60">
          <Image src={images[0]} alt={title} fill className="object-cover" />
        </div>
        <div className="grid gap-3 sm:grid-rows-2">
          <div className="relative min-h-32 overflow-hidden rounded-[1.5rem] bg-white/70">
            <Image src={images[1]} alt={title} fill className="object-cover" />
          </div>
          <div className="relative min-h-32 overflow-hidden rounded-[1.5rem] bg-white/70">
            <Image src={images[2]} alt={title} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">{eyebrow}</p>
        <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">{title}</h2>
        <p className="text-sm leading-7 text-foreground/68">{description}</p>
        <div className="inline-flex rounded-full border border-border/70 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {note}
        </div>
      </div>
    </div>
  );
}
