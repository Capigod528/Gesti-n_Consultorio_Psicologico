"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Bell, Search, User, Menu } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Función para obtener el título dinámico según la ruta
  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard General";
    if (pathname.includes("/pacientes")) return "Gestión de Pacientes";
    if (pathname.includes("/citas")) return "Agenda de Citas";
    if (pathname.includes("/especialistas")) return "Directorio Médico";
    return "Panel de Control";
  };

  return (
    <header className="h-24 px-8 flex items-center justify-between bg-white/40 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
      
      {/* Sección Izquierda: Título Dinámico */}
      <div className="flex items-center gap-4">
        <div className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <Menu size={20} className="text-slate-600" />
        </div>
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-0.5">
            PsicoControl v1.0
          </p>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {getTitle()}
          </h2>
        </div>
      </div>

      {/* Sección Derecha: Buscador y Usuario */}
      <div className="flex items-center gap-6">
        
        {/* Barra de Búsqueda Minimalista */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar paciente..." 
            className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all w-64"
          />
        </div>

        {/* Notificaciones */}
        <button className="relative p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm group">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
        </button>

        {/* Separador Visual */}
        <div className="h-10 w-px bg-slate-100 mx-2 hidden sm:block"></div>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">
              {session?.user?.name || "Ander"}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
              En Línea
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[2px] shadow-lg shadow-indigo-100">
            <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center overflow-hidden">
               {/* Si tienes imagen de usuario la pones aquí, sino un icono */}
               <User className="text-indigo-600" size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}