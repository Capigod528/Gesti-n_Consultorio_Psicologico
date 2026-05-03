"use client"

import { useEffect, useState } from 'react'
import { Paciente } from '@/types'
import { Plus, Search, Users, Filter, X, Loader2 } from 'lucide-react'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [formData, setFormData] = useState({
    id: null as number | null,
    nombre: "",
    email: "",
    telefono: "",
    edad: ""
  })

  // Función para cargar pacientes desde tu API (MySQL)
  const fetchPacientes = async () => {
    try {
      const res = await fetch('/api/pacientes')
      const data = await res.json()
      setPacientes(Array.isArray(data) ? data : [])
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

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar a este paciente?")) return
    try {
      const res = await fetch(`/api/pacientes?id=${id}`, { method: "DELETE" })
      if (res.ok) fetchPacientes()
    } catch (error) {
      alert("Error al eliminar")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        setIsModalOpen(false)
        resetForm()
        fetchPacientes()
      }
    } catch (error) {
      alert("Error al procesar la solicitud")
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
          <div key={paciente.id} className="group relative p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{paciente.nombre}</h3>
                <p className="text-sm text-slate-500">{paciente.edad} años</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(paciente)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(paciente.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-2">{paciente.email}</p>
            <p className="text-sm text-slate-500">{paciente.telefono}</p>
          </div>
        ))}
      </div>

      {/* Estado si no hay datos */}
      {pacientesFiltrados.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No se encontraron registros de pacientes.</p>
        </div>
      )}

      {/* MODAL PARA CREAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? "Editar Paciente" : "Registrar Nuevo Paciente"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Nombre completo"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <div className="flex gap-4">
                <input
                  placeholder="Teléfono"
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Edad"
                  className="w-24 p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.edad}
                  onChange={(e) => setFormData({...formData, edad: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
                >
                  {isEditing ? "Guardar Cambios" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}