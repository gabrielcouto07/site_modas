"use client";

import type { ProductImage } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  fallbackAlt,
}: {
  images: ProductImage[];
  fallbackAlt: string;
}) {
  const [selected, setSelected] = useState(images[0]?.url ?? "/products/placeholder/01.webp");

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted">
        <Image src={selected} alt={fallbackAlt} fill className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            className="relative aspect-square overflow-hidden rounded-[1.25rem] border border-border bg-muted"
            onClick={() => setSelected(image.url)}
          >
            <Image src={image.url} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
