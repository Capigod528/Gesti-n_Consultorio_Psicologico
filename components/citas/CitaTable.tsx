"use client";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Pencil, Trash2, Stethoscope } from "lucide-react";

interface CitaTableProps {
  citas: any[];
  onEdit: (cita: any) => void;
  onDelete: (id: number) => void;
}

export function CitaTable({ citas, onEdit, onDelete }: CitaTableProps) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4 border-b font-semibold text-sm">Fecha y Hora</th>
            <th className="p-4 border-b font-semibold text-sm">Paciente</th>
            <th className="p-4 border-b font-semibold text-sm">Especialista</th>
            <th className="p-4 border-b font-semibold text-sm">Motivo</th>
            <th className="p-4 border-b font-semibold text-sm text-center">Estado</th>
            <th className="p-4 border-b font-semibold text-sm text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {citas.map((c) => {
            const fechaCita = new Date(c.fecha);
            const ahora = new Date();

            // 1. Lógica para saber si es HOY (mismo día, mes y año)
            const esHoy = 
              fechaCita.getDate() === ahora.getDate() &&
              fechaCita.getMonth() === ahora.getMonth() &&
              fechaCita.getFullYear() === ahora.getFullYear();

            // 2. Lógica para saber si YA PASÓ (fecha anterior a la actual y no es hoy)
            const esPasada = fechaCita < ahora && !esHoy;

            return (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 flex items-center gap-2">
                      <Calendar size={14} className="text-emerald-500" />
                      {fechaCita.toLocaleDateString()}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      {fechaCita.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-2 font-semibold text-blue-600">
                    <User size={16} />
                    {c.paciente?.nombre}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-medium">
                    <Stethoscope size={16} />
                    <div className="flex flex-col">
                      <span>{c.especialista?.nombre || "No asignado"}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {c.especialista?.especialidad}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-slate-600 italic">"{c.motivo}"</td>
                
                {/* ESTADOS DINÁMICOS: FINALIZADA | PARA HOY | CONFIRMADA */}
                <td className="p-4 text-center">
                  {esPasada ? (
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                      Finalizada
                    </span>
                  ) : esHoy ? (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 ring-1 ring-blue-400 animate-pulse">
                      Para hoy
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                      Confirmada
                    </span>
                  )}
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(c)}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(c.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}