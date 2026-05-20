import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <h1 className="font-serif text-5xl">404</h1>
        <p className="text-foreground/70">A pagina que voce procurou nao foi encontrada.</p>
        <Link href="/">
          <Button>Voltar para a home</Button>
        </Link>
      </div>
    </div>
  );
}
