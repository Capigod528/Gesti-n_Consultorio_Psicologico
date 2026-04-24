"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CitaTable } from "@/components/citas/CitaTable";
import { CalendarPlus, Loader2, Stethoscope } from "lucide-react"; // Añadimos Stethoscope

interface Cita {
  id: number;
  fecha: string;
  motivo: string;
  paciente: { nombre: string };
  pacienteId: number;
  especialista?: { nombre: string }; // Añadimos esto para la tabla
  especialistaId?: number;
}

interface Paciente {
  id: number;
  nombre: string;
}

interface Especialista {
  id: number;
  nombre: string;
  especialidad: string;
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]); // Nuevo estado
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({ 
    id: null as number | null, 
    fecha: "", 
    motivo: "", 
    pacienteId: "",
    especialistaId: "" // Nuevo campo en el formulario
  });

  const fetchData = async () => {
    try {
      // Ahora cargamos las 3 entidades al mismo tiempo
      const [resCitas, resPacientes, resEspecialistas] = await Promise.all([
        fetch("/api/citas"),
        fetch("/api/pacientes"),
        fetch("/api/especialistas") // Tu nueva ruta de especialistas
      ]);

      const dataCitas = resCitas.ok ? await resCitas.json() : [];
      const dataPacientes = resPacientes.ok ? await resPacientes.json() : [];
      const dataEspecialistas = resEspecialistas.ok ? await resEspecialistas.json() : [];

      setCitas(Array.isArray(dataCitas) ? dataCitas : []);
      setPacientes(Array.isArray(dataPacientes) ? dataPacientes : []);
      setEspecialistas(Array.isArray(dataEspecialistas) ? dataEspecialistas : []);
    } catch (error) {
      console.error("Fallo al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (cita: Cita) => {
    setFormData({
      id: cita.id,
      fecha: new Date(cita.fecha).toISOString().slice(0, 16),
      motivo: cita.motivo,
      pacienteId: cita.pacienteId.toString(),
      especialistaId: cita.especialistaId?.toString() || "" // Cargamos el ID del especialista
    });
    setIsEditing(true);
    setShowModal(true);
  };

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
          pacienteId: parseInt(formData.pacienteId),
          especialistaId: parseInt(formData.especialistaId) // Enviamos el ID numérico
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ id: null, fecha: "", motivo: "", pacienteId: "", especialistaId: "" });
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
            setFormData({ id: null, fecha: "", motivo: "", pacienteId: "", especialistaId: "" });
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
        <CitaTable citas={citas} onEdit={handleEdit} onDelete={handleDelete} />
      )}

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

              {/* NUEVO: Selector de Especialista */}
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Stethoscope size={14} className="text-indigo-500" /> Asignar Especialista
                </label>
                <select 
                  required 
                  className="w-full p-2.5 border border-slate-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={formData.especialistaId}
                  onChange={(e) => setFormData({...formData, especialistaId: e.target.value})}
                >
                  <option value="">-- Selecciona al profesional --</option>
                  {especialistas.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nombre} ({esp.especialidad})
                    </option>
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