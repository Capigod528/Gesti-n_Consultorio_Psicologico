import { SidebarEspecialista } from "@/components/layout/SidebarEspecialista";
import { Navbar } from "@/components/layout/Navbar";

export default function EspecialistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <SidebarEspecialista />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}