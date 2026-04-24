"use client"; 
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // 1. Importamos el hook
import { StatsCards } from "@/components/dashboard/StatsCards";

export default function HomePage() {
  // 2. Extraemos la sesión y el estado de carga
  const { data: session, status } = useSession();

  const [stats, setStats] = useState({
    totalPacientes: 0,
    citasHoy: 0,
    pacienteEstrella: "Cargando..."
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {/* 3. Saludo dinámico con el nombre real del usuario */}
          Bienvenido, {session?.user?.name || "Especialista"} 👋
        </h1>
        <p className="text-slate-500 font-medium">
          Este es el resumen en tiempo real de tu consultorio.
        </p>
      </div>
      
      {/* Componente Modular con las tarjetas */}
      <StatsCards stats={stats} />

      {/* Frase motivacional con mejor estilo */}
      <div className="mt-12 p-8 bg-gradient-to-br from-indigo-50 to-white rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
           <p className="text-indigo-900 font-medium italic text-lg mb-2">
            "La psicología es el estudio de la mente y el comportamiento..." 
          </p>
          <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">
            Frase del día
          </span>
        </div>
        {/* Un círculo decorativo de fondo */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-100/50 rounded-full blur-3xl group-hover:bg-indigo-200/50 transition-colors"></div>
      </div>
    </div>
  );
}