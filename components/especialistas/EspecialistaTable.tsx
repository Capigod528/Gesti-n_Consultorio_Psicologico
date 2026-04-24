"use client";
import { Button } from "@/components/ui/button";
import { User, Mail, Briefcase, Pencil, Trash2 } from "lucide-react";

interface Especialista {
  id: number;
  nombre: string;
  email: string;
  especialidad: string;
}

interface EspecialistaTableProps {
  especialistas: Especialista[];
  onEdit: (especialista: Especialista) => void;
  onDelete: (id: number) => void;
}

export function EspecialistaTable({ especialistas, onEdit, onDelete }: EspecialistaTableProps) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4 border-b font-semibold text-sm">Especialista</th>
            <th className="p-4 border-b font-semibold text-sm">Especialidad</th>
            <th className="p-4 border-b font-semibold text-sm text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {especialistas.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-8 text-center text-slate-400 italic">
                No hay especialistas registrados.
              </td>
            </tr>
          ) : (
            especialistas.map((esp) => (
              <tr key={esp.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <User size={14} className="text-indigo-500" /> {esp.nombre}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                      <Mail size={12} /> {esp.email}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium border border-indigo-100 flex items-center gap-1 w-fit">
                    <Briefcase size={12} /> {esp.especialidad}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(esp)} 
                      className="text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(esp.id)} 
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}