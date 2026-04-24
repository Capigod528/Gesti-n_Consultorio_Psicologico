import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar fijo arriba */}
        <Navbar />

        {/* Área de contenido con scroll para tus páginas de pacientes, citas, etc. */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}