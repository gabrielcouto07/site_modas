import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCta() {
  return (
    <section className="rounded-[2.75rem] border border-border/70 bg-[linear-gradient(135deg,#1f1a17_0%,#2a221d_48%,#3d342d_100%)] px-8 py-10 text-white shadow-soft lg:px-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Newsletter</p>
          <h2 className="font-serif text-4xl tracking-tight">
            Receba novidades, lancamentos e campanhas da marca.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            className="border-white/15 bg-white/10 text-white placeholder:text-white/60"
            placeholder="Seu melhor e-mail"
          />
          <Button variant="secondary">Quero receber</Button>
        </div>
      </div>
    </section>
  );
}
