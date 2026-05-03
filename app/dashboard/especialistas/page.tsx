"use client"

import { useEffect, useState } from 'react'
import { Especialista } from '@/types'
import { Plus, Users2, Sparkles, X, Loader2 } from 'lucide-react'

export default function EspecialistasPage() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: null as number | null,
    nombre: "",
    email: "",
    especialidad: ""
  })

  const fetchEspecialistas = async () => {
    try {
      const res = await fetch("/api/especialistas")
      const data = await res.json()
      setEspecialistas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando especialistas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEspecialistas()
  }, [])

  const handleEdit = (esp: any) => {
    setFormData({
      id: esp.id,
      nombre: esp.nombre,
      email: esp.email,
      especialidad: esp.especialidad
    })
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar a este especialista?")) return
    try {
      const res = await fetch(`/api/especialistas/${id}`, { method: "DELETE" })
      if (res.ok) fetchEspecialistas()
    } catch (error) {
      alert("Error al eliminar")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = isEditing ? `/api/especialistas/${formData.id}` : "/api/especialistas"
    const method = isEditing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setIsEditing(false)
        setFormData({ id: null, nombre: "", email: "", especialidad: "" })
        fetchEspecialistas()
      }
    } catch (error) {
      alert("Error al procesar la solicitud")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Cargando equipo médico...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Cabecera con estilo PsicoControl */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Especialistas <Sparkles className="text-amber-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestiona el equipo médico y sus especialidades disponibles.
          </p>
        </div>

        {/* Botón Modal */}
        <button
          onClick={() => {
            setIsEditing(false)
            setFormData({ id: null, nombre: "", email: "", especialidad: "" })
            setShowModal(true)
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Nuevo Especialista
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {especialistas.map((especialista) => (
          <div key={especialista.id} className="group relative p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{especialista.nombre}</h3>
                <p className="text-sm text-indigo-600 font-semibold">{especialista.especialidad}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(especialista)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(especialista.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4">{especialista.email}</p>
            <button
              onClick={() => {}}
              className="w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold"
            >
              Ver Perfil
            </button>
          </div>
        ))}
      </div>

      {/* Estado vacío con diseño */}
      {especialistas.length === 0 && (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Users2 size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900">No hay especialistas</h3>
          <p className="text-slate-400 font-medium">Comienza agregando al primer miembro del equipo.</p>
        </div>
      )}

      {/* MODAL PARA CREAR/EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? "Editar Especialista" : "Nuevo Especialista"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Nombre Completo</label>
                <input
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Especialidad</label>
                <input
                  placeholder="Ej: Psicólogo Clínico"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.especialidad}
                  onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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