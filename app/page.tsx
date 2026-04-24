"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  Brain, ArrowRight, ShieldCheck, Zap, Sparkles, 
  Calendar, Users, BarChart3, TrendingUp, CheckCircle2, UserPlus
} from "lucide-react";

// --- COMPONENTE DE CONTADOR ANIMADO ---
function Counter({ value, duration = 2000 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let totalMiliseconds = duration;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 selection:bg-indigo-100 relative overflow-hidden font-sans">
      
      {/* Fondo y Gradientes */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-[128px] z-0"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-100/30 rounded-full blur-[128px] z-0"></div>

      {/* Navegación Reforzada */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl tracking-tight">
            <Brain size={32} className="animate-pulse" />
            <span>PsicoControl</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
              Iniciar Sesión
            </Link>
            <Link 
              href="/register" 
              className="group relative px-6 py-2.5 rounded-full text-sm font-bold text-white bg-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
            >
              <span className="relative flex items-center gap-2">
                Crear Cuenta
                <UserPlus size={16} />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-10 border border-indigo-100 shadow-inner">
            <Sparkles size={14} /> La nueva era de la gestión psicológica
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold text-slate-950 mb-10 tracking-tighter leading-[1.05]">
            Tu consultorio bajo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              control total.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl lg:text-2xl text-slate-600 mb-16 leading-relaxed font-medium">
            Organiza pacientes, sesiones y historias clínicas en una plataforma 
            diseñada para la eficiencia y la seguridad.
          </p>
          
          {/* BOTÓN PRINCIPAL AHORA HACIA REGISTRO */}
          <div className="flex justify-center">
            <Link
              href="/register"
              className="bg-slate-950 text-white px-12 py-5 rounded-3xl font-extrabold text-xl hover:bg-slate-800 hover:-translate-y-1.5 transition-all shadow-2xl shadow-slate-300/70 flex items-center gap-2.5 group"
            >
              Comenzar ahora
              <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* SECCIÓN 1: CONTADORES (Igual) */}
      <section className="py-24 bg-slate-950 relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="group space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-indigo-500 tracking-tighter">
                +<Counter value={500} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pacientes Felices</p>
            </div>
            <div className="group space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-emerald-500 tracking-tighter">
                <Counter value={99} />%
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Disponibilidad</p>
            </div>
            <div className="group space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-violet-500 tracking-tighter">
                +<Counter value={10} />k
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Citas Exitosas</p>
            </div>
            <div className="group space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-amber-500 tracking-tighter">24/7</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Soporte Activo</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: FUNCIONES PREMIUM (Igual) */}
      <section className="py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-20">
            Herramientas <span className="text-indigo-600 italic">Premium</span>
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Gestión Citas */}
            <div className="relative group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all overflow-hidden text-left">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg"><Calendar size={28} /></div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Gestión de Citas</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">Calendario inteligente con recordatorios automáticos.</p>
              <div className="absolute -right-2 -bottom-2 w-32 h-32 opacity-10 flex items-end gap-1 px-4"><div className="w-4 bg-indigo-600 h-[40%] rounded-t-md"></div><div className="w-4 bg-indigo-600 h-[95%] rounded-t-md animate-pulse"></div></div>
            </div>

            {/* Expedientes */}
            <div className="relative group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all overflow-hidden text-left">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg"><Users size={28} /></div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Expedientes Digitales</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">Historias clínicas organizadas y accesibles.</p>
              <div className="absolute right-6 top-10 text-emerald-100 opacity-20"><TrendingUp size={120} strokeWidth={1} /></div>
            </div>

            {/* Seguridad */}
            <div className="relative group p-10 rounded-[3rem] bg-indigo-600 text-white shadow-xl hover:-translate-y-2 transition-all overflow-hidden text-left">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30"><BarChart3 size={28} /></div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">Seguridad Blindada</h3>
              <p className="text-indigo-100 font-medium leading-relaxed mb-8 text-white">Encriptación de nivel bancario para proteger la privacidad.</p>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white w-[85%] animate-pulse"></div></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-slate-100 bg-[#fafbff] text-center relative z-10">
        <p className="text-slate-500 font-semibold text-lg italic">PsicoControl © 2026</p>
        <p className="text-slate-400 mt-2 tracking-tight">Desarrollado por Anderson — Gestión Profesional.</p>
      </footer>
    </div>
  );
}