import React from 'react';
import Link from 'next/link';
import "../globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar - Barra Lateral */}
          <aside className="w-64 bg-slate-800 text-white flex flex-col">
            <div className="p-6 text-xl font-bold border-b border-slate-700">
              PsicoControl 🧠
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              <Link href="/" className="block p-3 rounded hover:bg-slate-700 transition">
                🏠 Inicio
              </Link>
              <Link href="/pacientes" className="block p-3 rounded hover:bg-slate-700 transition">
                👥 Pacientes
              </Link>
              <Link href="/citas" className="block p-3 rounded hover:bg-slate-700 transition">
                📅 Citas Médicas
              </Link>
            </nav>

            <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
              Usuario: Psic. Castillo
            </div>
          </aside>

          {/* Main Content - Contenido Principal */}
          <main className="flex-1 overflow-y-auto p-8">
            <header className="mb-8 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-slate-800">Panel de Control</h2>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm border">
                {new Date().toLocaleDateString()}
              </div>
            </header>

            <section className="bg-white rounded-xl shadow-sm p-6 min-h-[500px] border border-slate-200">
              {children}
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}