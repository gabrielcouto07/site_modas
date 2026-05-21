export { auth as middleware } from "@/lib/auth";

export const config = {
  // Protect admin routes and require authentication for /conta pages
  matcher: ["/admin/:path*", "/conta/:path*"],
};
