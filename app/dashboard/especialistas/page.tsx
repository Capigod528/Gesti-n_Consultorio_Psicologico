"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Users, CheckCircle, Sparkles, ArrowUpRight } from "lucide-react";

export default function EspecialistaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="font-bold text-slate-400 animate-pulse">Cargando tu panel...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const userName = session.user?.name || "Especialista";

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Bienvenido, {userName} 👋
        </h1>
        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Aquí tienes el resumen de tu agenda de hoy.
        </p>
      </header>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-7 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Citas Hoy</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">—</h3>
          </div>
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100">
            <Calendar size={28} />
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Mis Pacientes</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">—</h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 shadow-sm shadow-emerald-100">
            <Users size={28} />
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Confirmadas</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">—</h3>
          </div>
          <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 shadow-sm shadow-orange-100">
            <CheckCircle size={28} />
          </div>
        </div>
      </div>

      {/* Banner de acción */}
      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-indigo-200 relative overflow-hidden group">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-4xl font-black italic tracking-tight mb-3">¿Listo para empezar?</h2>
          <p className="text-indigo-100 font-medium text-lg max-w-md">
            Revisa tus citas del día y actualiza el estado de cada sesión.
          </p>
        </div>

        <button
          onClick={() => router.push('/especialista/citas')}
          className="mt-8 md:mt-0 bg-white text-indigo-600 px-10 py-5 rounded-[1.5rem] font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95 relative z-10"
        >
          Ver Mis Citas <ArrowUpRight size={22} strokeWidth={3} />
        </button>

        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-colors"></div>
      </div>
    </div>
  );
}