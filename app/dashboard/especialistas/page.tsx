"use client";

import { useEffect, useState } from "react";
import { Plus, Stethoscope, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Especialista = {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
};

export default function EspecialistasPage() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEspecialistas = async () => {
    try {
      const res = await fetch("/api/especialistas");
      const data = await res.json();
      setEspecialistas(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error cargando especialistas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEspecialistas() }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Especialistas ✨
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestiona el equipo médico y sus especialidades disponibles.
          </p>
        </div>
      </header>

      {especialistas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <Stethoscope className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No hay especialistas registrados aún.</p>
          <p className="text-slate-400 text-sm mt-1">Los especialistas aparecen aquí cuando se registran en el sistema.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {especialistas.map((esp) => (
            <div key={esp.id} className="group bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-[1.5rem]" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Stethoscope size={22} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {esp.nombre}
                  </h3>
                  <p className="text-xs font-bold text-indigo-500">{esp.especialidad}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  {esp.email}
                </div>
                {esp.telefono && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    {esp.telefono}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}