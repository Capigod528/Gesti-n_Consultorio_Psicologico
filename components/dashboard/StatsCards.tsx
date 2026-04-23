"use client";
import { Users, Calendar, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"; // Usando tu componente real

interface Stats {
  totalPacientes: number;
  citasHoy: number;
  pacienteEstrella: string;
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    { title: "Pacientes", value: stats.totalPacientes, icon: Users, color: "text-blue-600", bg: "bg-blue-50", link: "/pacientes" },
    { title: "Citas Hoy", value: stats.citasHoy, icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50", link: "/citas" },
    { title: "Paciente Estrella", value: stats.pacienteEstrella, icon: Star, color: "text-purple-600", bg: "bg-purple-50", link: "/pacientes" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((item, i) => (
        <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-0"> {/* Quitamos el padding interno del CardContent */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-800">{item.value}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">{item.title}</h3>
                <Link 
                  href={item.link} 
                  className="mt-2 text-sm text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors"
                >
                  Ver más detalles <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            {/* Decoración inferior para el color */}
            <div className={`h-1 w-full ${item.color.replace('text', 'bg')}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}