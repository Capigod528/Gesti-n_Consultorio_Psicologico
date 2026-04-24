import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Asegúrate de haber creado lib/prisma.ts
import bcrypt from "bcryptjs";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validar que el usuario envió datos
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son obligatorios");
        }

        // 2. Buscar al usuario en tu tabla MySQL 'users'
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 3. Si no existe o no tiene contraseña, rechazar
        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        // 4. Comparar la contraseña ingresada con el hash de la base de datos
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Contraseña incorrecta");
        }

        // 5. Si todo está OK, devolver los datos del usuario
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Esto servirá para los paneles de especialista
        };
      }
    })
  ],
  // Usamos JWT para manejar la sesión de forma ligera
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", // Redirigir aquí cuando se necesite login
  },
  callbacks: {
    // Esto es para que el 'role' del usuario esté disponible en el cliente (frontend)
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    }
  }
});

export { handler as GET, handler as POST };