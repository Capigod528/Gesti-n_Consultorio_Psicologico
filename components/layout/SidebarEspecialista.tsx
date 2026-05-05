"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, Brain, LogOut } from 'lucide-react';
import { signOut, useSession } from "next-auth/react";

export function SidebarEspecialista() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const linkStyle = "flex items-center gap-3 p-4 rounded-2xl font-bold transition-all mb-1";
  const activeStyle = "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40";
  const inactiveStyle = "text-slate-400 hover:bg-slate-700/50 hover:text-white";

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800">
      {/* LOGO */}
      <div className="p-8 text-2xl font-black italic border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
          <Brain size={24} className="text-white" />
        </div>
        <span className="tracking-tight">PsicoControl</span>
      </div>

      <nav className="flex-1 p-4 mt-4">
        <Link
          href="/especialista"
          className={`${linkStyle} ${pathname === "/especialista" ? activeStyle : inactiveStyle}`}
        >
          <LayoutDashboard size={22} /> Inicio
        </Link>

        <Link
          href="/especialista/citas"
          className={`${linkStyle} ${pathname.includes("/especialista/citas") ? activeStyle : inactiveStyle}`}
        >
          <Calendar size={22} /> Mis Citas
        </Link>

        <Link
          href="/especialista/pacientes"
          className={`${linkStyle} ${pathname.includes("/especialista/pacientes") ? activeStyle : inactiveStyle}`}
        >
          <Users size={22} /> Mis Pacientes
        </Link>
      </nav>

      {/* PERFIL Y SALIDA */}
      <div className="p-4 bg-slate-950/50">
        <div className="flex items-center gap-3 p-3 mb-4 bg-slate-800/40 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 border-2 border-slate-700 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-200 truncate">{session?.user?.name || "Especialista"}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Especialista</p>
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