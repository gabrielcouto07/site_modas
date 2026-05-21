import type { Metadata } from "next";
import { Inter, Outfit, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/constants";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: BRAND.name,
    description: BRAND.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} ${outfit.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: BRAND.name,
            description: BRAND.description,
            email: BRAND.supportEmail,
          })}
        </script>
      </body>
    </html>
  );
}
