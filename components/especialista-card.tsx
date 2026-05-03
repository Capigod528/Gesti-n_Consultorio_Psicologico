'use client'

import { Especialista } from '@/types'
import { Button } from '@/components/ui/button'
import { Calendar, Star, Award, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EspecialistaCardProps {
  especialista: Especialista
}

export function EspecialistaCard({ especialista }: EspecialistaCardProps) {
  const router = useRouter();

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_rgba(79,70,229,0.15)] hover:-translate-y-1">

      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-violet-50/20 pointer-events-none" />

      {/* Línea superior de color */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex flex-col items-center p-6 space-y-4 text-center">

        {/* Avatar mejorado */}
        <div className="relative">
          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-0.5 shadow-lg">
            <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
              {especialista.fotoUrl ? (
                <img
                  src={especialista.fotoUrl}
                  alt={especialista.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-indigo-600">
                  {especialista.nombre.charAt(0)}
                </span>
              )}
            </div>
          </div>
          {/* Badge de verificación */}
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white p-1 rounded-full shadow-md">
            <Star size={12} fill="currentColor" />
          </div>
        </div>

        {/* Información Principal */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {especialista.nombre}
          </h3>
          <div className="flex items-center justify-center gap-1.5">
            <Award size={12} className="text-indigo-600" />
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              {especialista.especialidad}
            </p>
          </div>
        </div>

        {/* Divisor */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Stats */}
        <div className="flex w-full gap-3 text-xs">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">{especialista.citas?.length || 0}</p>
            <p className="text-[10px] font-medium text-slate-500 uppercase">Citas</p>
          </div>
          <div className="w-px bg-slate-200 h-6 self-center" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">4.9</p>
            <p className="text-[10px] font-medium text-slate-500 uppercase">Rating</p>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={() => router.push(`/dashboard/citas/nueva?especialista=${especialista.id}`)}
          className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
        >
          <Calendar className="h-3.5 w-3.5" />
          Agendar Sesión
        </button>
      </div>
    </div>
  )
}