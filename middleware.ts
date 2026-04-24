import { withAuth } from "next-auth/middleware";

// Exportamos la función por defecto usando withAuth
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Aquí defines qué rutas quieres proteger
  matcher: [
    "/dashboard/:path*", 
  ],
};