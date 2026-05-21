import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(194,133,107,0.08),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.7),_rgba(255,255,255,0))]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:px-6 lg:py-10 lg:pb-10">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
