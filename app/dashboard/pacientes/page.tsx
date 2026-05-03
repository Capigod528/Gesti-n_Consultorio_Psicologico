"use client"

import { useEffect, useState } from 'react'
import { Paciente } from '@/types'
import { Plus, Search, Users, Filter, X, Loader2, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: null as number | null,
    nombre: "",
    email: "",
    telefono: "",
    edad: ""
  })

  const fetchPacientes = async () => {
    try {
      const res = await fetch('/api/pacientes')
      const data = await res.json()
      setPacientes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando pacientes:", error)
      toast.error("Error al cargar pacientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPacientes()
  }, [])

  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleEdit = (paciente: Paciente) => {
    setFormData({
      id: paciente.id,
      nombre: paciente.nombre,
      email: paciente.email,
      telefono: paciente.telefono,
      edad: paciente.edad.toString()
    })
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number, nombre: string) => {
    try {
      const res = await fetch(`/api/pacientes?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success(`Paciente "${nombre}" eliminado correctamente`)
        fetchPacientes()
      } else {
        toast.error("Error al eliminar paciente")
      }
    } catch (error) {
      toast.error("Error al eliminar paciente")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const method = isEditing ? "PUT" : "POST"

    try {
      const res = await fetch("/api/pacientes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          edad: parseInt(formData.edad)
        }),
      })

      if (res.ok) {
        toast.success(isEditing ? "Paciente actualizado correctamente" : "Paciente creado correctamente")
        setIsModalOpen(false)
        resetForm()
        fetchPacientes()
      } else {
        toast.error("Error al procesar la solicitud")
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ id: null, nombre: "", email: "", telefono: "", edad: "" })
    setIsEditing(false)
  }

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

        {/* Botón Modal */}
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
          Nuevo Paciente
        </button>
      </div>

      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium transition-all"
          />
        </div>
        <button className="bg-white border border-slate-200 p-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={18} />
        </button>
      </div>

      {/* Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientesFiltrados.map((paciente) => (
          <div key={paciente.id} className="group relative p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            {/* Línea superior decorativa */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{paciente.nombre}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">{paciente.edad} años • ID: #{paciente.id}</p>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(paciente)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(paciente.id, paciente.nombre)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Email:</span>
                <span className="text-sm text-slate-700">{paciente.email}</span>
              </div>
              {paciente.telefono && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Teléfono:</span>
                  <span className="text-sm text-slate-700">{paciente.telefono}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estado si no hay datos */}
      {pacientesFiltrados.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No se encontraron registros de pacientes.</p>
        </div>
      )}

      {/* MODAL PARA CREAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? "Editar Paciente" : "Nuevo Paciente"}
              </h2>
              <button onClick={() => {
                setIsModalOpen(false)
                resetForm()
              }} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Nombre</label>
                <input
                  placeholder="Nombre completo"
                  required
                  className="w-full mt-1 p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full mt-1 p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Teléfono</label>
                  <input
                    placeholder="123456789"
                    className="w-full mt-1 p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Edad</label>
                  <input
                    type="number"
                    placeholder="25"
                    required
                    className="w-full mt-1 p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                    value={formData.edad}
                    onChange={(e) => setFormData({...formData, edad: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    isEditing ? "Guardar Cambios" : "Crear Paciente"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}