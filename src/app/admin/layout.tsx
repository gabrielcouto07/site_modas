import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/checkout/identificacao");
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[240px_1fr] lg:px-6">
        <aside className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Painel</p>
            <p className="font-serif text-2xl tracking-tight text-foreground">Administração</p>
            <p className="text-sm leading-6 text-foreground/60">
              Tudo organizado para operar produtos, pedidos e clientes sem termos técnicos.
            </p>
          </div>

          <nav className="space-y-5 text-sm">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Visão geral</p>
              <Link className="block rounded-xl px-3 py-2 hover:bg-muted" href="/admin">
                Dashboard
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Operação</p>
              <Link className="block rounded-xl px-3 py-2 hover:bg-muted" href="/admin/pedidos">
                Pedidos
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-muted" href="/admin/clientes">
                Clientes
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Catálogo</p>
              <Link className="block rounded-xl px-3 py-2 hover:bg-muted" href="/admin/produtos">
                Produtos
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-muted" href="/admin/categorias">
                Categorias
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Sistema</p>
              <Link
                className="block rounded-xl px-3 py-2 hover:bg-muted"
                href="/admin/configuracoes"
              >
                Configurações
              </Link>
            </div>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
