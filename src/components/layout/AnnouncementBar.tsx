"use client";

import { useEffect, useState } from "react";
import { HERO_BANNERS } from "@/lib/constants";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_BANNERS.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="border-b border-border bg-accent px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.24em] text-white">
      {HERO_BANNERS[index]}
    </div>
  );
}
