"use client"

import { useEffect, useState } from 'react'
import { Cita } from '@/types'
import { Button } from '@/components/ui/button'
import { Calendar, Loader2, RefreshCw, Clock, UserCheck } from 'lucide-react'
import { toast } from "sonner"
import { NuevaCitaModal } from '@/components/nueva-cita-modal'

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCitas = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/citas')
      const data = await response.json()
      setCitas(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error("Error cargando base de datos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCitas() }, [])

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Agenda</h1>
          <p className="text-slate-500 font-medium mt-1">Sincronizado con MySQL • SENATI Project</p>
        </div>
        <Button variant="outline" onClick={fetchCitas} className="rounded-full border-slate-200 bg-white shadow-sm">
          <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <aside className="lg:col-span-4 sticky top-6">
          <NuevaCitaModal onClose={() => {}} onSuccess={fetchCitas} />
        </aside>

        <main className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin mx-auto text-indigo-600" size={40} />
            </div>
          ) : citas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-bold">No hay citas registradas aún.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {citas.map((cita) => (
                <div key={cita.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Cita #{cita.id}</h3>
                      <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
                        <Clock size={14} /> {cita.fecha} • {cita.hora}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden md:block">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Especialista</p>
                      <p className="text-sm font-bold text-slate-700 flex items-center justify-end gap-1">
                        <UserCheck size={14} className="text-indigo-500" /> ID: {cita.especialistaId}
                      </p>
                    </div>
                    <span className="px-5 py-2 bg-emerald-50 text-emerald-600 text-xs font-black rounded-full uppercase">
                      {cita.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}