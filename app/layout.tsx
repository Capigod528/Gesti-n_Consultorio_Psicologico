import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner"; // 1. Importamos el Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PsicoControl",
  description: "Sistema de Gestión Psicológica Profesional",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
          {/* 2. El Toaster se coloca aquí para que se vea en toda la app */}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}