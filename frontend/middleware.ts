import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_PREFIX = /^\/(pt|en|fr)(\/|$)/;

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Nunca localizar: admin, API, ficheiros estáticos.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Subdomínio de testemunhos: / → /testimonies (preserva prefixo en/fr).
  // Em dev: testimonies.localhost:3000 · Em prod: testimonies.igrejadacidadeluanda.org
  const isTestimoniesSubdomain =
    host.startsWith("testimonies.") || host.includes("testimonies.localhost");

  if (isTestimoniesSubdomain) {
    if (pathname === "/" || pathname === "") {
      url.pathname = "/testimonies";
      return NextResponse.rewrite(url);
    }
    const prefixed = pathname.match(LOCALE_PREFIX);
    if (prefixed && (url.pathname === `/${prefixed[1]}` || url.pathname === `/${prefixed[1]}/`)) {
      url.pathname = `/${prefixed[1]}/testimonies`;
      return NextResponse.rewrite(url);
    }
    if (pathname === "/obrigado") {
      url.pathname = "/testimonies/obrigado";
      return NextResponse.rewrite(url);
    }
    const prefixedThanks = pathname.match(/^\/(pt|en|fr)\/obrigado\/?$/);
    if (prefixedThanks) {
      url.pathname = `/${prefixedThanks[1]}/testimonies/obrigado`;
      return NextResponse.rewrite(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|admin).*)"],
};
