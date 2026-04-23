"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CitaTable } from "@/components/citas/CitaTable";
import { CalendarPlus, Loader2 } from "lucide-react";

interface Cita {
  id: number;
  fecha: string;
  motivo: string;
  paciente: { nombre: string };
  pacienteId: number;
}

interface Paciente {
  id: number;
  nombre: string;
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si editamos
  
  const [formData, setFormData] = useState({ 
    id: null as number | null, // Para saber qué cita editar
    fecha: "", 
    motivo: "", 
    pacienteId: "" 
  });

  const fetchData = async () => {
    try {
      const [resCitas, resPacientes] = await Promise.all([
        fetch("/api/citas"),
        fetch("/api/pacientes")
      ]);

      const dataCitas = resCitas.ok ? await resCitas.json() : [];
      const dataPacientes = resPacientes.ok ? await resPacientes.json() : [];

      setCitas(Array.isArray(dataCitas) ? dataCitas : []);
      setPacientes(Array.isArray(dataPacientes) ? dataPacientes : []);
    } catch (error) {
      console.error("Fallo al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Función para preparar la edición
  const handleEdit = (cita: Cita) => {
    setFormData({
      id: cita.id,
      fecha: new Date(cita.fecha).toISOString().slice(0, 16),
      motivo: cita.motivo,
      pacienteId: cita.pacienteId.toString()
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Función para eliminar cita
  const handleDelete = async (id: number) => {
    if (!confirm("¿Deseas eliminar esta cita?")) return;
    try {
      const res = await fetch(`/api/citas?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    
    try {
      const res = await fetch("/api/citas", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          pacienteId: parseInt(formData.pacienteId) 
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ id: null, fecha: "", motivo: "", pacienteId: "" });
        setIsEditing(false);
        fetchData(); 
      }
    } catch (error) {
      alert("Error en el servidor");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agenda de Citas</h1>
          <p className="text-slate-500 text-sm">Organiza las sesiones de hoy y próximas fechas.</p>
        </div>
        <Button 
          onClick={() => {
            setIsEditing(false);
            setFormData({ id: null, fecha: "", motivo: "", pacienteId: "" });
            setShowModal(true);
          }} 
          className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-lg"
        >
          <CalendarPlus size={18} /> Agendar Cita
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-emerald-500" />
        </div>
      ) : (
        /* Ahora pasamos las funciones requeridas */
        <CitaTable citas={citas} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* MODAL (Se mantiene igual pero con título dinámico) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-200">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <CalendarPlus className="text-emerald-600" /> 
              {isEditing ? "Editar Cita" : "Nueva Cita Médica"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selector de Paciente */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Seleccionar Paciente</label>
                <select 
                  required 
                  className="w-full p-2.5 border border-slate-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  value={formData.pacienteId}
                  onChange={(e) => setFormData({...formData, pacienteId: e.target.value})}
                >
                  <option value="">-- Elige un paciente --</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Fecha y Hora</label>
                <input 
                  type="datetime-local" 
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                />
              </div>

              {/* Motivo */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Motivo de consulta</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: Ansiedad, Seguimiento..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {isEditing ? "Guardar Cambios" : "Confirmar Cita"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}