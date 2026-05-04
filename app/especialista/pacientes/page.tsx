"use client"

import { useEffect, useState } from 'react'
import { Users, Search, Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'

type Paciente = {
  id: number
  nombre: string
  email: string
  telefono: string
  edad: number
  citas: { id: number; fecha: string; estado: string; motivo: string }[]
}

export default function MisPacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch('/api/especialistas/me/pacientes')
      .then(r => r.json())
      .then(data => setPacientes(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error cargando pacientes"))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  )

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans space-y-8">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mis Pacientes</h1>
        <p className="text-slate-500 font-medium mt-1">Historial de pacientes de tus sesiones</p>
      </header>

      {/* Buscador */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        />
      </div>

      {/* Grid */}
      {filtrados.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No tienes pacientes aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((paciente) => (
            <div key={paciente.id} className="group bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-[1.5rem]" />

              <div className="mb-4">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{paciente.nombre}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{paciente.edad} años • {paciente.email}</p>
                {paciente.telefono && (
                  <p className="text-xs text-slate-400">{paciente.telefono}</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Calendar size={12} /> Citas ({paciente.citas?.length || 0})
                </p>
                {paciente.citas?.slice(0, 2).map(cita => (
                  <div key={cita.id} className="flex justify-between items-center text-xs py-1">
                    <span className="text-slate-600 font-medium truncate">{cita.motivo}</span>
                    <span className={`px-2 py-0.5 rounded-full font-black uppercase ${
                      cita.estado === 'HECHA' ? 'bg-emerald-50 text-emerald-600' :
                      cita.estado === 'CONFIRMADA' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>{cita.estado}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}