"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, MessageSquare, X, ChevronDown } from 'lucide-react'
import { toast } from "sonner"

export function NuevaCitaModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const datosCita = {
      pacienteId: 1, 
      fecha: formData.get('fecha'),
      hora: formData.get('hora'),
      motivo: formData.get('motivo'),
      especialistaId: parseInt(formData.get('especialistaId') as string), // Captura el ID seleccionado
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
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-slate-900">Nueva Cita</h2>
        <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:text-slate-500">
          <X size={20}/>
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input name="nombre" placeholder="Paciente" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 outline-none" />
        </div>

        {/* SELECTOR DE ESPECIALISTA */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
          <select 
            name="especialistaId" 
            required
            className="w-full pl-12 pr-10 py-4 bg-indigo-50/50 border-none rounded-2xl text-slate-900 outline-none appearance-none cursor-pointer font-bold"
          >
            <option value="1">Dr. Anderson (Psicología)</option>
            <option value="2">Dr. Luis Cueva</option>
            <option value="3">Dr. Luis Carranza</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input name="fecha" type="date" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 text-sm outline-none" />
          </div>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input name="hora" type="time" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 text-sm outline-none" />
          </div>
        </div>

        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
          <textarea name="motivo" placeholder="Motivo de consulta" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 outline-none min-h-[100px]" />
        </div>

        <Button type="submit" disabled={loading} className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
          {loading ? "Sincronizando..." : "Confirmar Cita"}
        </Button>
      </form>
    </div>
  )
}