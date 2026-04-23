"use client";
import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default function HomePage() {
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
        <h1 className="text-2xl font-bold text-slate-800">
          Bienvenido al Sistema, Psic. Castillo
        </h1>
        <p className="text-slate-600">
          Este es el resumen en tiempo real de tu consultorio.
        </p>
      </div>
      
      {/* Componente Modular */}
      <StatsCards stats={stats} />

      {/* Aquí podrías agregar una sección de "Citas Próximas" en el futuro */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
        <p className="text-slate-500 italic">
          "La psicología es el estudio de la mente y el comportamiento..." 
          - Pronto: Frases motivacionales diarias.
        </p>
      </div>
    </div>
  );
}