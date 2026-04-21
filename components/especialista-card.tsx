'use client'

import { Especialista } from '@/types'
import { Button } from '@/components/ui/button'
import { Calendar, Phone, Mail } from 'lucide-react'

interface EspecialistaCardProps {
  especialista: Especialista
}

export function EspecialistaCard({ especialista }: EspecialistaCardProps) {
  return (
    <div className="group h-full p-6 space-y-4 rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          {especialista.fotoUrl ? (
            <img 
              src={especialista.fotoUrl} 
              alt={especialista.nombre} 
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-primary">
              {especialista.nombre.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
            {especialista.nombre}
          </h3>
          <p className="text-sm text-muted-foreground">
            {especialista.especialidad}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {especialista.citas?.length || 0} citas
          </p>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1 h-9">
          <Calendar className="h-4 w-4 mr-1" />
          Agenda cita
        </Button>
      </div>
    </div>
  )
}

