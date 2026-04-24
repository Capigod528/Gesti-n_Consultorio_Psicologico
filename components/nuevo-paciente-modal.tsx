'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, Calendar, Loader2 } from 'lucide-react'

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
        onRefresh() // Refresca la lista en MySQL
        onClose()   // Cierra el modal
      }
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>

        <h2 className="text-3xl font-black text-slate-900 mb-6">Nuevo Paciente</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input required placeholder="Nombre completo" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input required type="number" placeholder="Edad" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) => setFormData({...formData, edad: e.target.value})} />
            </div>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input placeholder="Teléfono" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input required type="email" placeholder="Correo electrónico" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <button disabled={loading} type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : 'Guardar en MySQL'}
          </button>
        </form>
      </div>
    </div>
  )
}