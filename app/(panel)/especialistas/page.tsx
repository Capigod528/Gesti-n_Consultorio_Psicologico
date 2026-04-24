"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EspecialistaTable } from "@/components/especialistas/EspecialistaTable";
import { UserPlus, Loader2, X } from "lucide-react";

interface Especialista {
  id: number;
  nombre: string;
  email: string;
  especialidad: string;
}

export default function EspecialistasPage() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({ 
    id: null as number | null, 
    nombre: "", 
    email: "", 
    especialidad: "" 
  });

  const fetchEspecialistas = async () => {
    try {
      const res = await fetch("/api/especialistas");
      const data = await res.json();
      setEspecialistas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando especialistas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEspecialistas(); }, []);

  const handleEdit = (esp: Especialista) => {
    setFormData({ id: esp.id, nombre: esp.nombre, email: esp.email, especialidad: esp.especialidad });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar a este especialista?")) return;
    try {
      // Tu estructura usa la carpeta [id] para DELETE
      const res = await fetch(`/api/especialistas/${id}`, { method: "DELETE" });
      if (res.ok) fetchEspecialistas();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Determinamos la ruta y el método según si editamos o creamos
    const url = isEditing ? `/api/especialistas/${formData.id}` : "/api/especialistas";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setIsEditing(false);
        setFormData({ id: null, nombre: "", email: "", especialidad: "" });
        fetchEspecialistas();
      }
    } catch (error) {
      alert("Error al procesar la solicitud");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Especialistas</h1>
          <p className="text-slate-500 text-sm">Gestiona el equipo médico y sus especialidades.</p>
        </div>
        <Button 
          onClick={() => { setIsEditing(false); setFormData({id: null, nombre: "", email: "", especialidad: ""}); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-md"
        >
          <UserPlus size={18} /> Nuevo Especialista
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" /></div>
      ) : (
        <EspecialistaTable 
          especialistas={especialistas} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      {/* MODAL DE ESPECIALISTA */}
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
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isEditing ? "Guardar Cambios" : "Registrar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}