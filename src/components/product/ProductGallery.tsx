"use client";

import type { ProductImage } from "@prisma/client";
import Image from "next/image";
import { useMemo, useState } from "react";

export function ProductGallery({
  images,
  fallbackAlt,
}: {
  images: ProductImage[];
  fallbackAlt: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const selectedImage = useMemo(
    () =>
      images[selectedIndex] ??
      images[0] ?? { url: "/products/placeholder/01.webp", alt: fallbackAlt },
    [fallbackAlt, images, selectedIndex]
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setZoomPosition({ x, y });
        }}
        onMouseLeave={() => setZoomPosition({ x: 50, y: 50 })}
        aria-label="Visualização ampliada do produto"
      >
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt ?? fallbackAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
          style={{ objectPosition: `${zoomPosition.x}% ${zoomPosition.y}%` }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          Passe o mouse para ampliar
        </div>
      </button>

      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`relative aspect-square overflow-hidden rounded-[1.25rem] border bg-muted transition ${
              selectedIndex === index ? "border-primary ring-2 ring-primary/20" : "border-border"
            }`}
            onClick={() => setSelectedIndex(index)}
            aria-pressed={selectedIndex === index}
          >
            <Image src={image.url} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>

      <p className="text-sm text-foreground/60">
        Zoom automático no desktop e miniaturas para alternar ângulos.
      </p>
    </div>
  );
}
