"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Para que el botón funcione
import { EspecialistaCard } from '@/components/especialista-card'
import { Especialista } from '@/types'
import { Plus, Users2, Sparkles } from 'lucide-react'

export default function EspecialistasPage() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulamos la carga (luego aquí irá tu fetch a MySQL/Prisma)
    const mockEspecialistas: Especialista[] = [
      { id: 1, nombre: 'Dra. María López', especialidad: 'Psicología Clínica' },
      { id: 2, nombre: 'Dr. Juan Pérez', especialidad: 'Terapia Cognitivo-Conductual' },
      { id: 3, nombre: 'Lic. Ana García', especialidad: 'Psicología Infantil' }
    ]
    setEspecialistas(mockEspecialistas)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Cargando equipo médico...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Cabecera con estilo PsicoControl */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Especialistas <Sparkles className="text-amber-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestiona el equipo médico y sus especialidades disponibles.
          </p>
        </div>
        
        {/* Botón Funcional */}
        <button 
          onClick={() => router.push('/dashboard/especialistas/nuevo')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Nuevo Especialista
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {especialistas.map((especialista) => (
          <EspecialistaCard key={especialista.id} especialista={especialista} />
        ))}
      </div>

      {/* Estado vacío con diseño */}
      {especialistas.length === 0 && (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Users2 size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900">No hay especialistas</h3>
          <p className="text-slate-400 font-medium">Comienza agregando al primer miembro del equipo.</p>
        </div>
      )}
    </div>
  )
}