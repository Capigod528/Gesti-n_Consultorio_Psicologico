"use client";
import { Button } from "@/components/ui/button";
import { Trash2, User, Pencil } from "lucide-react";

interface PacienteTableProps {
  pacientes: any[];
  onEdit: (paciente: any) => void;
  onDelete: (id: number, nombre: string) => void;
}

export function PacienteTable({ pacientes, onEdit, onDelete }: PacienteTableProps) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse bg-white">
        <thead className="bg-gradient-to-r from-indigo-50 to-violet-50 text-slate-600">
          <tr>
            <th className="p-4 border-b font-semibold">Paciente</th>
            <th className="p-4 border-b font-semibold">Email</th>
            <th className="p-4 border-b font-semibold">Edad</th>
            <th className="p-4 border-b font-semibold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id} className="border-b hover:bg-indigo-50/30 transition-colors">
              <td className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-indigo-600" />
                </div>
                <span className="font-medium text-slate-800">{p.nombre}</span>
              </td>
              <td className="p-4 text-slate-600">{p.email}</td>
              <td className="p-4 text-slate-600">{p.edad} años</td>
              <td className="p-4 text-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(p)}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  <Pencil size={16} />
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(p.id, p.nombre)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}