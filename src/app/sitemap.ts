import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/loja", "/carrinho", "/checkout", "/institucional", "/politicas"].map((path) => ({
    url: `http://localhost:3000${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
