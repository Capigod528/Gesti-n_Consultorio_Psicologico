"use client"

import { useEffect, useState } from 'react'
import { PacienteCard } from '@/components/paciente-card'
import { Paciente } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'

const columns = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "edad",
    header: "Edad",
  },
]

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockPacientes: Paciente[] = [
      {
        id: 1,
        nombre: 'Juan Martínez',
        email: 'juan@example.com',
        telefono: '+34 600 123 456',
        edad: 32,
        notas: 'Paciente regular desde 2023'
      },
      {
        id: 2,
        nombre: 'María Rodríguez',
        email: 'maria@example.com',
        edad: 28,
        notas: 'Primera consulta'
      }
    ]
    setPacientes(mockPacientes)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Cargando pacientes...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Pacientes
        </h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>
      
<DataTable columns={columns} data={pacientes} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pacientes.map((paciente) => (
          <PacienteCard key={paciente.id} paciente={paciente} />
        ))}
      </div>
    </div>
  )
}

