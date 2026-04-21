"use client"

import { Cita } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, UserCheck } from 'lucide-react'

interface CitaCardProps {
  cita: Cita
}

export function CitaCard({ cita }: CitaCardProps) {
  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'confirmada': return 'default' as const
      case 'completada': return 'secondary' as const
      case 'cancelada': return 'destructive' as const
      default: return 'outline' as const
    }
  }

  return (
    <div className="group p-6 space-y-4 rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {new Date(cita.fecha).toLocaleDateString('es-ES')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {cita.pacienteNombre} - {cita.hora}
          </h3>
          <div className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Especialista ID: {cita.especialistaId}
            </span>
          </div>
        </div>
        <Badge variant={getBadgeVariant(cita.estado)}>
          {cita.estado}
        </Badge>
      </div>
      {cita.estadoAnimo && (
        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
          Estado de ánimo: {cita.estadoAnimo}
        </div>
      )}
    </div>
  )
}

