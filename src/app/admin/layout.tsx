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
        <aside className="space-y-4 rounded-[2rem] border border-border bg-white p-6">
          <p className="font-serif text-2xl">Admin</p>
          <nav className="space-y-2 text-sm">
            <Link href="/admin">Dashboard</Link>
            <br />
            <Link href="/admin/produtos">Produtos</Link>
            <br />
            <Link href="/admin/pedidos">Pedidos</Link>
            <br />
            <Link href="/admin/categorias">Categorias</Link>
            <br />
            <Link href="/admin/configuracoes">Configuracoes</Link>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
