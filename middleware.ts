import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role;

    // Si intenta entrar al dashboard siendo ESPECIALISTA → lo mandamos a /especialista
    if (pathname.startsWith("/dashboard") && role === "ESPECIALISTA") {
      return NextResponse.redirect(new URL("/especialista", req.url));
    }

    // Si intenta entrar a /especialista siendo SECRETARIO → lo mandamos al dashboard
    if (pathname.startsWith("/especialista") && role === "SECRETARIO") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Solo pasa si hay sesión activa
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/especialista/:path*", // ← protegemos también la ruta nueva
  ],
};