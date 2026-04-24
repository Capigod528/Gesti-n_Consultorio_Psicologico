"use client"

import { useEffect, useState } from 'react'
import { PacienteCard } from '@/components/paciente-card'
import { Paciente } from '@/types'
import { Plus, Search, Users, Filter } from 'lucide-react'
import NuevoPacienteModal from '@/components/nuevo-paciente-modal' // Importamos tu modal

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false) // Estado para el modal
  const [busqueda, setBusqueda] = useState('')

  // Función para cargar pacientes desde tu API (MySQL)
  const fetchPacientes = async () => {
    try {
      const res = await fetch('/api/pacientes')
      const data = await res.json()
      setPacientes(data)
    } catch (error) {
      console.error("Error cargando pacientes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPacientes()
  }, [])

  // Filtrado básico por nombre
  const pacientesFiltrados = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-slate-400 text-xs tracking-tighter uppercase">Conectando con MySQL...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Expedientes</h1>
          <p className="text-slate-500 font-medium italic">Listado maestro de pacientes registrados.</p>
        </div>
        
        {/* CAMBIO: Ahora abre el Modal y no da 404 */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[2rem] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Nuevo Paciente
        </button>
      </div>

      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-medium transition-all"
          />
        </div>
        <button className="bg-white border border-slate-100 p-4 rounded-[1.5rem] text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientesFiltrados.map((paciente) => (
          <PacienteCard key={paciente.id} paciente={paciente} />
        ))}
      </div>

      {/* Estado si no hay datos */}
      {pacientesFiltrados.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No se encontraron registros de pacientes.</p>
        </div>
      )}

      {/* RENDER DEL MODAL */}
      {isModalOpen && (
        <NuevoPacienteModal 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={fetchPacientes} // Al guardar, llamamos a fetchPacientes para actualizar la lista
        />
      )}
    </div>
  )
}