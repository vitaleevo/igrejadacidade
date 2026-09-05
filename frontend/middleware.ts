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
    const prefixed = pathname.match(LOCALE_PREFIX);
    const locale = prefixed ? prefixed[1] : "pt";
    const bare = prefixed ? pathname.slice(`/${locale}`.length) || "/" : pathname;
    if (bare === "/" || bare === "") {
      url.pathname = `/${locale}/testimonies`;
      return NextResponse.rewrite(url);
    }
    if (bare === "/obrigado" || bare === "/obrigado/") {
      url.pathname = `/${locale}/testimonies/obrigado`;
      return NextResponse.rewrite(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|admin).*)"],
};
