'use client'

import { useState } from 'react'
import { User, Mail, Phone, Calendar, Loader2 } from 'lucide-react'

interface Props {
  onClose: () => void;
  onRefresh: () => void;
}

export default function NuevoPacienteModal({ onClose, onRefresh }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    edad: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onRefresh()
        onClose()
      }
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl shadow-slate-200/30 animate-in fade-in zoom-in duration-300 border border-slate-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Nuevo Paciente</h2>
          <p className="text-sm text-slate-500 mt-1">Completa los datos del paciente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 transition-colors" size={18} />
            <input
              required
              placeholder="Nombre completo"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          {/* Edad y Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500 transition-colors" size={18} />
              <input
                required
                type="number"
                placeholder="Edad"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                onChange={(e) => setFormData({...formData, edad: e.target.value})}
              />
            </div>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 transition-colors" size={18} />
              <input
                placeholder="Teléfono"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 transition-colors" size={18} />
            <input
              required
              type="email"
              placeholder="Correo electrónico"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Botón submit */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3.5 mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Guardando...
              </>
            ) : (
              'Crear Paciente'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}