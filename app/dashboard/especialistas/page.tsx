"use client"

import { useEffect, useState } from 'react'
import { EspecialistaCard } from '@/components/especialista-card'
import { Especialista } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function EspecialistasPage() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call
    const mockEspecialistas: Especialista[] = [
      {
        id: 1,
        nombre: 'Dra. María López',
        especialidad: 'Psicología Clínica',
        fotoUrl: '/avatar1.jpg'
      },
      {
        id: 2,
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Terapia Cognitivo-Conductual',
        fotoUrl: undefined
      },
      {
        id: 3,
        nombre: 'Lic. Ana García',
        especialidad: 'Psicología Infantil',
      }
    ]
    setEspecialistas(mockEspecialistas)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Cargando especialistas...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Especialistas
        </h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Especialista
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {especialistas.map((especialista) => (
          <EspecialistaCard key={especialista.id} especialista={especialista} />
        ))}
      </div>
      {especialistas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay especialistas registrados.
          </p>
        </div>
      )}
    </div>
  )
}

