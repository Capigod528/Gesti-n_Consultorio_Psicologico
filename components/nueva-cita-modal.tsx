"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, MessageSquare, ChevronDown, Loader2 } from 'lucide-react'
import { toast } from "sonner"

interface Especialista {
  id: number
  nombre: string
  especialidad: string
}

interface Paciente {
  id: number
  nombre: string
}

export function NuevaCitaModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [especialistas, setEspecialistas] = useState<Especialista[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEspecialistas, resPacientes] = await Promise.all([
          fetch('/api/especialistas'),
          fetch('/api/pacientes')
        ])

        if (resEspecialistas.ok) {
          const data = await resEspecialistas.json()
          setEspecialistas(data)
        }
        if (resPacientes.ok) {
          const data = await resPacientes.json()
          setPacientes(data)
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast.error("Error al cargar especialistas y pacientes")
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const datosCita = {
      pacienteId: parseInt(formData.get('pacienteId') as string),
      fecha: formData.get('fecha'),
      hora: formData.get('hora'),
      motivo: formData.get('motivo'),
      especialistaId: parseInt(formData.get('especialistaId') as string),
      estado: 'pendiente'
    }

    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCita)
      })

      if (res.ok) {
        toast.success("¡Cita guardada con éxito!")
        onSuccess()
        onClose()
      } else {
        toast.error("Error al guardar")
      }
    } catch (error) {
      toast.error("Error de red")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">Nueva Cita</h2>
        <p className="text-xs text-slate-500 mt-0.5">Agenda una sesión con tu especialista</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Paciente */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
          <select
            name="pacienteId"
            required
            disabled={loadingData}
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">
              {loadingData ? 'Cargando pacientes...' : 'Selecciona paciente'}
            </option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        {/* Especialista */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500" size={18} />
          <select
            name="especialistaId"
            required
            disabled={loadingData}
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">
              {loadingData ? 'Cargando especialistas...' : 'Selecciona especialista'}
            </option>
            {especialistas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} ({e.especialidad})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
            <input
              name="fecha"
              type="date"
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
            <input
              name="hora"
              type="time"
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Motivo */}
        <div className="relative">
          <MessageSquare className="absolute left-4 top-3 text-blue-500" size={18} />
          <textarea
            name="motivo"
            placeholder="Motivo de consulta"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all min-h-[90px] resize-none"
          />
        </div>

        {/* Botón submit */}
        <Button
          type="submit"
          disabled={loading || loadingData}
          className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Confirmando...
            </>
          ) : (
            'Confirmar Cita'
          )}
        </Button>
      </form>
    </div>
  )
}