import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProductFilters({
  categories,
  currentCategory,
}: {
  categories: Array<{ slug: string; name: string }>;
  currentCategory?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/loja">
        <Button variant={currentCategory ? "outline" : "default"}>Todos</Button>
      </Link>
      {categories.map((category) => (
        <Link key={category.slug} href={`/loja?categoria=${category.slug}`}>
          <Button variant={currentCategory === category.slug ? "default" : "outline"}>
            {category.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
