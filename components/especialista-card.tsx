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
    <div className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2 overflow-hidden">
      
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

      <div className="relative flex flex-col items-center text-center space-y-5">
        
        {/* Avatar Pro */}
        <div className="relative">
          <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-indigo-600 to-violet-500 p-[3px] shadow-lg shadow-indigo-100">
            <div className="h-full w-full rounded-[1.8rem] bg-white flex items-center justify-center overflow-hidden">
              {especialista.fotoUrl ? (
                <img 
                  src={especialista.fotoUrl} 
                  alt={especialista.nombre} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-indigo-600">
                  {especialista.nombre.charAt(0)}
                </span>
              )}
            </div>
          </div>
          {/* Badge de "Destacado" o Verificado */}
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-1.5 rounded-xl shadow-md">
            <Star size={14} fill="currentColor" />
          </div>
        </div>

        {/* Información Principal */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
            {especialista.nombre}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <Award size={14} className="text-indigo-500" />
            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">
              {especialista.especialidad}
            </p>
          </div>
        </div>

        {/* Stats Rápidos */}
        <div className="flex w-full gap-4 py-4 border-y border-slate-50">
          <div className="flex-1 text-center">
            <p className="text-lg font-black text-slate-800">{especialista.citas?.length || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Citas</p>
          </div>
          <div className="w-px bg-slate-100 h-8 self-center" />
          <div className="flex-1 text-center">
            <p className="text-lg font-black text-slate-800">4.9</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Rating</p>
          </div>
        </div>

        {/* Botón de Acción */}
        <Button 
          onClick={() => router.push(`/dashboard/citas/nueva?especialista=${especialista.id}`)}
          className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm transition-all shadow-lg hover:shadow-indigo-200 group/btn"
        >
          <Calendar className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
          Agendar Sesión
          <ChevronRight size={16} className="ml-auto opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-4 group-hover/btn:translate-x-0" />
        </Button>
      </div>
    </div>
  )
}