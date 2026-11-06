import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "auth";
export const DASHBOARD_ROLES = ["ADMIN", "STAFF", "MANAGER"];
const ADMIN_ONLY_ROUTES = [
  "/dashboard/tasks",
  "/dashboard/floors",
  "/dashboard/schedules",
];
const CUSTOMER_ROLES = ["CUSTOMER"];

interface AuthInfo {
  token?: string;
  userType?: string;
  role?: string;
}

export function getAuthInfo(request: NextRequest): AuthInfo | null {
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = getAuthInfo(request);

  // Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/register",
    "/forget-password",
    "/oauth2",
    "/verify-otp",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute) {
    // If user is already authenticated, redirect to appropriate dashboard
    if (auth) {
      if (DASHBOARD_ROLES.includes(auth.role!)) {
        if (auth.role === "STAFF") {
          return NextResponse.redirect(
            new URL("/dashboard/booking/", request.url),
          );
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else if (CUSTOMER_ROLES.includes(auth.role!)) {
        return NextResponse.redirect(new URL("/rooms", request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (!auth) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Dashboard routes - only for ADMIN and STAFF
  if (pathname.startsWith("/dashboard")) {
    if (!DASHBOARD_ROLES.includes(auth.role!)) {
      // Redirect non-admin users to customer routes
      return NextResponse.redirect(new URL("/rooms", request.url));
    }
    if (auth.role === "STAFF" && (pathname === "/dashboard" || pathname === "/dashboard/")) {
      return NextResponse.redirect(
        new URL("/dashboard/booking/", request.url),
      );
    }
  }

  // Admin-only dashboard routes
  const isAdminOnlyRoute = ADMIN_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  if (isAdminOnlyRoute && auth.role !== "ADMIN" && auth.role !== "MANAGER") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Customer routes - only for CUSTOMER users
  if (pathname.startsWith("/rooms") || pathname.startsWith("/profile")) {
    if (DASHBOARD_ROLES.includes(auth.role!)) {
      // Redirect admin/staff to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf|otf)$).*)",
  ],
};
