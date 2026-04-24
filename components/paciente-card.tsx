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
    <div className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] hover:-translate-y-2 overflow-hidden">
      
      {/* Indicador de estado lateral que se ilumina al pasar el mouse */}
      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col space-y-6">
        
        {/* Cabecera: Avatar y Datos de Identidad */}
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
            <User size={28} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {paciente.nombre}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Expediente: #00{paciente.id}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                {paciente.edad || '25'} Años
              </span>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="grid grid-cols-1 gap-3 py-4 border-y border-slate-50">
          <div className="flex items-center gap-3 text-slate-500 group/item">
            <div className="p-2 bg-slate-50 rounded-lg group-hover/item:bg-indigo-50 transition-colors">
              <Mail size={14} className="text-slate-400 group-hover/item:text-indigo-500" />
            </div>
            <span className="text-sm font-bold truncate">{paciente.email}</span>
          </div>
          {paciente.telefono && (
            <div className="flex items-center gap-3 text-slate-500 group/item">
              <div className="p-2 bg-slate-50 rounded-lg group-hover/item:bg-emerald-50 transition-colors">
                <Phone size={14} className="text-slate-400 group-hover/item:text-emerald-500" />
              </div>
              <span className="text-sm font-bold">{paciente.telefono}</span>
            </div>
          )}
        </div>

        {/* Resumen de actividad */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-indigo-500" />
            <span className="text-[11px] font-black uppercase tracking-tight text-slate-600">
              {paciente.citas?.length || 0} Sesiones totales
            </span>
          </div>
          <span className="bg-white px-2 py-1 rounded-md text-[9px] font-black text-indigo-600 border border-indigo-100">
            ESTABLE
          </span>
        </div>

        {/* Acciones del Card */}
        <div className="flex gap-3">
          <button 
            onClick={() => router.push(`/dashboard/pacientes/${paciente.id}`)}
            className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-200 active:scale-95"
          >
            <FileText size={16} />
            Ver Perfil
          </button>
          
          <button 
            onClick={() => router.push(`/dashboard/citas/nueva?paciente=${paciente.id}`)}
            className="w-14 h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all group/btn"
            title="Agendar Cita"
          >
            <CalendarDays size={20} className="transition-transform group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </div>
  )
}