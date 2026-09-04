import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Detecta subdomínio de testemunhos
  // Em dev: testimonies.localhost:3000
  // Em prod: testimonies.igrejadacidadeluanda.org
  const isTestimoniesSubdomain =
    host.startsWith("testimonies.") ||
    host.includes("testimonies.localhost");

  // Se for subdomínio de testemunhos, reescreve rotas
  if (isTestimoniesSubdomain) {
    // Evita loop se já estiver em /testimonies
    if (pathname === "/" || pathname === "") {
      url.pathname = "/testimonies";
      return NextResponse.rewrite(url);
    }
    // /obrigado no subdomínio -> /testimonies/obrigado
    if (pathname === "/obrigado") {
      url.pathname = "/testimonies/obrigado";
      return NextResponse.rewrite(url);
    }
    // Permite assets e api
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    // Qualquer outra rota no subdomínio: mantém mas tenta servir de /testimonies
    // Se não for /testimonies/*, deixa passar (404 será tratado)
    return NextResponse.next();
  }

  // Domínio principal: se acessar /testimonies diretamente, permite (fallback)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
