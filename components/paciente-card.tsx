"use client"

import { Paciente } from '@/types'
import { Button } from '@/components/ui/button'
import { Phone, Mail, User } from 'lucide-react'

interface PacienteCardProps {
  paciente: Paciente
}

export function PacienteCard({ paciente }: PacienteCardProps) {
  return (
    <div className="group h-full p-6 space-y-4 rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary">
            {paciente.nombre.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
            {paciente.nombre}
          </h3>
          <p className="text-sm text-muted-foreground">
            {paciente.email}
          </p>
          {paciente.telefono && (
            <p className="text-xs text-muted-foreground/70 flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {paciente.telefono}
            </p>
          )}
          <p className="text-xs text-muted-foreground/70">
            {paciente.citas?.length || 0} citas
          </p>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1 h-9">
          <User className="h-4 w-4 mr-1" />
          Ver perfil
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Mail className="h-4 w-4 mr-1" />
          Mensaje
        </Button>
      </div>
    </div>
  )
}

