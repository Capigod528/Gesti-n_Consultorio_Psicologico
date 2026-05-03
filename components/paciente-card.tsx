'use client'

import { Paciente } from '@/types'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Phone, 
  Mail, 
  CalendarDays, 
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PacienteCardProps {
  paciente: Paciente
}

export function PacienteCard({ paciente }: PacienteCardProps) {
  const router = useRouter()

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_rgba(79,70,229,0.15)] hover:-translate-y-1">

      {/* Gradiente de fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-indigo-50/20 pointer-events-none" />

      {/* Línea superior de color */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex flex-col p-6 space-y-5">

        {/* Cabecera: Avatar y Datos de Identidad */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-600 border border-indigo-200 shadow-sm group-hover:shadow-lg group-hover:from-indigo-500 group-hover:to-violet-500 group-hover:text-white transition-all duration-300">
              <User size={24} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {paciente.nombre}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-semibold">ID: #{paciente.id}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="font-semibold">{paciente.edad || '25'} años</span>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Información de Contacto */}
        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center gap-3 group/item">
            <div className="p-2 bg-blue-50 rounded-lg group-hover/item:bg-blue-100 transition-colors">
              <Mail size={14} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-600 truncate">{paciente.email}</span>
          </div>
          {paciente.telefono && (
            <div className="flex items-center gap-3 group/item">
              <div className="p-2 bg-green-50 rounded-lg group-hover/item:bg-green-100 transition-colors">
                <Phone size={14} className="text-green-600" />
              </div>
              <span className="text-xs font-medium text-slate-600">{paciente.telefono}</span>
            </div>
          )}
        </div>

        {/* Stats de actividad */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-indigo-50/60 to-violet-50/60 rounded-lg border border-indigo-100/50">
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">
              {paciente.citas?.length || 0} sesiones
            </span>
          </div>
          <span className="px-2.5 py-1 bg-white rounded text-[10px] font-bold text-indigo-600 border border-indigo-200 shadow-xs">
            ACTIVO
          </span>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => router.push(`/dashboard/pacientes/${paciente.id}`)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <FileText size={14} />
            Ver Perfil
          </button>

          <button
            onClick={() => router.push(`/dashboard/citas/nueva?paciente=${paciente.id}`)}
            className="px-3 py-2.5 rounded-lg border-2 border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all group/btn"
            title="Agendar Cita"
          >
            <CalendarDays size={16} className="transition-transform group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </div>
  )
}