"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation"; // Para saber en qué página estás
import { LayoutDashboard, Users, Calendar, Brain, Stethoscope, LogOut } from 'lucide-react'; 
import { signOut, useSession } from "next-auth/react";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname(); // Hook para detectar la ruta activa

  // Estilo base para los enlaces
  const linkStyle = "flex items-center gap-3 p-4 rounded-2xl font-bold transition-all mb-1";
  const activeStyle = "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40";
  const inactiveStyle = "text-slate-400 hover:bg-slate-700/50 hover:text-white";

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800">
      {/* LOGO: PsicoControl */}
      <div className="p-8 text-2xl font-black italic border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
          <Brain size={24} className="text-white" />
        </div>
        <span className="tracking-tight">PsicoControl</span>
      </div>
      
      <nav className="flex-1 p-4 mt-4">
        {/* DASHBOARD: Antes decía "Inicio" */}
        <Link 
          href="/dashboard" 
          className={`${linkStyle} ${pathname === "/dashboard" ? activeStyle : inactiveStyle}`}
        >
          <LayoutDashboard size={22} /> Dashboard
        </Link>

        {((session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "SECRETARY") && (
          <>
            <Link 
              href="/dashboard/pacientes" 
              className={`${linkStyle} ${pathname.includes("/pacientes") ? activeStyle : inactiveStyle}`}
            >
              <Users size={22} /> Pacientes
            </Link>

            <Link 
              href="/dashboard/citas" 
              className={`${linkStyle} ${pathname.includes("/citas") ? activeStyle : inactiveStyle}`}
            >
              <Calendar size={22} /> Citas Médicas
            </Link>
          </>
        )}

        {(session?.user as any)?.role === "ADMIN" && (
          <Link 
            href="/dashboard/especialistas" 
            className={`${linkStyle} ${pathname.includes("/especialistas") ? activeStyle : inactiveStyle}`}
          >
            <Stethoscope size={22} /> Especialistas
          </Link>
        )}

        {(session?.user as any)?.role === "SPECIALIST" && (
          <Link 
            href="/dashboard/specialist" 
            className={`${linkStyle} ${pathname.includes("/specialist") ? activeStyle : inactiveStyle}`}
          >
            <Calendar size={22} /> Mis Citas
          </Link>
        )}
      </nav>

      {/* SECCIÓN INFERIOR: Perfil y Salida */}
      <div className="p-4 bg-slate-950/50">
        <div className="flex items-center gap-3 p-3 mb-4 bg-slate-800/40 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 border-2 border-slate-700 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-200 truncate">{session?.user?.name || "Ander"}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{((session?.user as any)?.role || "Profesional").replace("SPECIALIST", "Especialista").replace("SECRETARY", "Secretaria").replace("ADMIN", "Administrador")}</p>
          </div>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center gap-3 p-4 w-full bg-red-500/10 text-red-400 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all active:scale-95"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}