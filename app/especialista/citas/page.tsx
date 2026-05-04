"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Loader2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

type Cita = {
  id: number
  fecha: string
  motivo: string
  estado: string
  paciente: { nombre: string; email: string }
}

const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'HECHA']

const estadoConfig: Record<string, { color: string; icon: any }> = {
  PENDIENTE:  { color: 'bg-amber-50 text-amber-600',   icon: AlertCircle },
  CONFIRMADA: { color: 'bg-indigo-50 text-indigo-600', icon: CheckCircle2 },
  HECHA:      { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
}

export default function MisCitasPage() {
  const { data: session } = useSession()
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEstado, setFilterEstado] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchCitas = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/especialistas/me/citas')
      const data = await res.json()
      setCitas(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Error cargando tus citas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCitas() }, [])

  const filteredCitas = citas.filter(c => !filterEstado || c.estado === filterEstado)

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/citas?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      })
      if (res.ok) {
        toast.success(`Estado actualizado a ${nuevoEstado}`)
        fetchCitas()
      } else {
        toast.error("Error al actualizar estado")
      }
    } catch {
      toast.error("Error al actualizar estado")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans space-y-8">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mis Citas</h1>
        <p className="text-slate-500 font-medium mt-1">Gestiona el estado de tus sesiones</p>
      </header>

      {/* Filtros */}
      <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
        {[['', 'Todas'], ['PENDIENTE', 'Pendiente'], ['CONFIRMADA', 'Confirmada'], ['HECHA', 'Hecha']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilterEstado(val)}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
              filterEstado === val
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin mx-auto text-indigo-600" size={40} />
        </div>
      ) : filteredCitas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No tienes citas en este estado.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCitas.map((cita) => {
            const config = estadoConfig[cita.estado] || estadoConfig.PENDIENTE
            const Icon = config.icon
            return (
              <div key={cita.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{cita.paciente.nombre}</h3>
                    <p className="text-slate-400 text-sm font-medium">{cita.motivo}</p>
                    <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {new Date(cita.fecha).toLocaleString('es-PE')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Badge estado actual */}
                  <span className={`px-4 py-2 rounded-full text-xs font-black uppercase flex items-center gap-1.5 ${config.color}`}>
                    <Icon size={14} /> {cita.estado}
                  </span>

                  {/* Cambiar estado */}
                  <select
                    value={cita.estado}
                    disabled={updatingId === cita.id}
                    onChange={(e) => cambiarEstado(cita.id, e.target.value)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {ESTADOS.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>

                  {updatingId === cita.id && (
                    <Loader2 size={18} className="animate-spin text-indigo-600" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}