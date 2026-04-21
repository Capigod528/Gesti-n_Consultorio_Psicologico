"use client"

import { useEffect, useState } from 'react'
import { CitaCard } from '@/components/cita-card'
import { Cita } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const citaColumns = [
  {
    accessorKey: "pacienteNombre",
    header: "Paciente",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "hora",
    header: "Hora",
  },
  {
    accessorKey: "estado",
    header: "Estado",
  cell: ({ row }: { row: any }) => (
      <Badge variant="outline">
        {row.original.estado}
      </Badge>
    ),
  },
]

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEstado, setFilterEstado] = useState('')

  useEffect(() => {
    const mockCitas: Cita[] = [
      {
        id: 1,
        pacienteNombre: 'Juan Martínez',
        pacienteEmail: 'juan@example.com',
        fecha: '2024-04-25',
        hora: '10:00',
        estado: 'pendiente',
        especialistaId: 1,
        createdAt: "2024-04-25T09:00:00Z"
      },
      {
        id: 2,
        pacienteNombre: 'María Rodríguez',
        pacienteEmail: 'maria@example.com',
        fecha: '2024-04-26',
        hora: '15:30',
        estado: 'confirmada',
        especialistaId: 2,
        estadoAnimo: 'ansiosa',
        createdAt: "2024-04-26T14:30:00Z"
      }
    ]
    setCitas(mockCitas)
    setLoading(false)
  }, [])

  const filteredCitas = citas.filter(cita => 
    !filterEstado || cita.estado === filterEstado
  )

  if (loading) {
    return <div className="p-8 text-center">Cargando citas...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Citas
        </h1>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          variant={filterEstado === '' ? 'default' : 'outline'}
          onClick={() => setFilterEstado('')}
        >
          Todas
        </Button>
        <Button 
          variant={filterEstado === 'pendiente' ? 'default' : 'outline'}
          onClick={() => setFilterEstado('pendiente')}
        >
          Pendientes
        </Button>
        <Button 
          variant={filterEstado === 'confirmada' ? 'default' : 'outline'}
          onClick={() => setFilterEstado('confirmada')}
        >
          Confirmadas
        </Button>
      </div>

      {filteredCitas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCitas.map((cita) => (
            <CitaCard key={cita.id} cita={cita} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay citas {filterEstado ? `en estado "${filterEstado}"` : ''}
          </p>
        </div>
      )}
    </div>
  )
}

