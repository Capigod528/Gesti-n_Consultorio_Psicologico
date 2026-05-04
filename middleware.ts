import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role as string;

    // Redirigir /dashboard según rol
    if (pathname === "/dashboard") {
      if (role === "SECRETARY") return NextResponse.redirect(new URL("/dashboard/secretary", req.url));
      if (role === "SPECIALIST") return NextResponse.redirect(new URL("/dashboard/specialist", req.url));
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Proteger panel de secretaria — solo SECRETARY
    if (pathname.startsWith("/dashboard/secretary") && role !== "SECRETARY") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Proteger panel de especialista — solo SPECIALIST
    if (pathname.startsWith("/dashboard/specialist") && role !== "SPECIALIST") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Proteger gestión de especialistas y pacientes — solo SECRETARY
    if (
      (pathname.startsWith("/dashboard/especialistas") ||
        pathname.startsWith("/dashboard/pacientes")) &&
      role !== "SECRETARY"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Solo dejar pasar usuarios con token válido
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};