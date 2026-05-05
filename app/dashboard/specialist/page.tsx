"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserCheck, Loader2, Sparkles, X, ClipboardEdit, Save, Search, Filter, Calendar as CalendarIcon, Download, FileText, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Estados = ["PENDIENTE", "CONFIRMADA", "REALIZADA", "CANCELADA"] as const;

interface Cita {
  id: number;
  fecha: string;
  motivo: string;
  estado: string;
  paciente: {
    id: number;
    nombre: string;
    email?: string;
  };
}

interface HistorialPaciente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  edad?: number | null;
  citas: Array<any>;
}

interface PlantillaClinica {
  id: string;
  nombre: string;
  diagnostico: string;
  tratamiento: string;
  medicinas: string;
  sintomas: string;
}

export default function SpecialistDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historial, setHistorial] = useState<HistorialPaciente | null>(null);
  const [plantillas, setPlantillas] = useState<PlantillaClinica[]>([]);
  
  // Filtros y búsqueda
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  
  // Estado para la edición de la atención
  const [selectedCitaId, setSelectedCitaId] = useState<number | null>(null);
  const [selectedCitaData, setSelectedCitaData] = useState<Cita | null>(null);
  const [editFormData, setEditFormData] = useState({
    diagnostico: "",
    sintomas: "",
    tratamiento: "",
    medicinas: "",
    notas: "",
  });

  const especialistaId = (session?.user as any)?.especialistaId;
  const userName = session?.user?.name || "Especialista";

  useEffect(() => {
    if (status === "authenticated") {
      if (!especialistaId) {
        toast.error("No se encontró el perfil de especialista.");
        return;
      }
      fetchCitas();
      cargarPlantillas();
    }
  }, [status, especialistaId]);

  const cargarPlantillas = () => {
    const guardadas = localStorage.getItem("plantillasClinicas");
    if (guardadas) {
      setPlantillas(JSON.parse(guardadas));
    }
  };

  const guardarPlantilla = (nombre: string, datos: typeof editFormData) => {
    const nuevaPlantilla: PlantillaClinica = {
      id: Date.now().toString(),
      nombre,
      ...datos
    };
    const nuevas = [...plantillas, nuevaPlantilla];
    setPlantillas(nuevas);
    localStorage.setItem("plantillasClinicas", JSON.stringify(nuevas));
    toast.success("Plantilla guardada");
  };

  const citasFiltradas = useMemo(() => {
    return citas.filter(cita => {
      const matchEstado = !filtroEstado || cita.estado === filtroEstado;
      const matchPaciente = !busquedaPaciente || 
        cita.paciente.nombre.toLowerCase().includes(busquedaPaciente.toLowerCase());
      const matchFecha = !fechaFiltro || 
        new Date(cita.fecha).toISOString().split('T')[0] === fechaFiltro;
      return matchEstado && matchPaciente && matchFecha;
    });
  }, [citas, filtroEstado, busquedaPaciente, fechaFiltro]);

  const exportarHistorialPDF = async (pacienteId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pacientes/${pacienteId}/historial`);
      const data = await res.json();
      
      const citasConDatos = data.citas.map((c: any) => ({
        fecha: new Date(c.fecha).toLocaleDateString('es-PE'),
        motivo: c.motivo,
        estado: c.estado,
        diagnostico: c.diagnostico || '-',
        tratamiento: c.tratamiento || '-'
      }));
      
      const htmlContent = `
        <html>
          <head><title>Historial - ${data.nombre}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #4f46e5;">Historial Clínico</h1>
            <p><strong>Paciente:</strong> ${data.nombre}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="border: 1px solid #ddd; padding: 8px;">Fecha</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Motivo</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Diagnóstico</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Tratamiento</th>
                </tr>
              </thead>
              <tbody>
                ${citasConDatos.map((c: any) => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${c.fecha}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${c.motivo}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${c.diagnostico}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${c.tratamiento}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historial-${data.nombre.replace(/\s+/g, '-')}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Historial exportado");
    } catch (error) {
      toast.error("Error al exportar historial");
    } finally {
      setLoading(false);
    }
  };

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/citas?especialistaId=${especialistaId}`);
      const data = await response.json();
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Error cargando tus citas.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (citaId: number, newEstado: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/citas/${citaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newEstado }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      toast.success("Estado actualizado");
      fetchCitas();
    } catch (error) {
      toast.error("No se pudo actualizar el estado.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAtencion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitaId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/citas/${selectedCitaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, estado: "REALIZADA" }),
      });

      if (!res.ok) throw new Error("Error al guardar");
      
      toast.success("Atención registrada con éxito");
      setEditModalOpen(false);
      fetchCitas();
    } catch (error) {
      toast.error("Error al guardar la información clínica.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (cita: Cita) => {
    setSelectedCitaId(cita.id);
    setSelectedCitaData(cita);
    setEditFormData({
      diagnostico: cita.paciente?.email ? "" : "",
      sintomas: "",
      tratamiento: "",
      medicinas: "",
      notas: "",
    });
    setEditModalOpen(true);
  };

  const openHistorial = async (pacienteId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pacientes/${pacienteId}/historial`);
      const data = await res.json();
      setHistorial(data);
      setHistoryOpen(true);
    } catch (error) {
      toast.error("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  };

  const aplicarPlantilla = (plantilla: PlantillaClinica) => {
    setEditFormData({
      diagnostico: plantilla.diagnostico,
      sintomas: plantilla.sintomas,
      tratamiento: plantilla.tratamiento,
      medicinas: plantilla.medicinas,
      notas: "",
    });
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-8 bg-[#0d1823] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hola, {userName}</h1>
        <p className="text-slate-500 font-medium mt-1">Gestiona tus consultas y registros médicos.</p>
      </header>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={busquedaPaciente}
              onChange={(e) => setBusquedaPaciente(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos los estados</option>
            {Estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          <button
            onClick={() => { setBusquedaPaciente(""); setFechaFiltro(""); setFiltroEstado(""); }}
            className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {citasFiltradas.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm text-center">
            <p className="text-slate-500 font-medium">No hay citas que coincidan con los filtros.</p>
          </div>
        ) : (
          citasFiltradas.map((cita) => (
            <div key={cita.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{cita.paciente.nombre}</h3>
                  <p className="text-sm text-slate-500">{new Date(cita.fecha).toLocaleString()}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
                  cita.estado === 'REALIZADA' ? 'bg-emerald-50 text-emerald-600' :
                  cita.estado === 'CONFIRMADA' ? 'bg-blue-50 text-blue-600' :
                  cita.estado === 'CANCELADA' ? 'bg-red-50 text-red-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {cita.estado}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => openEditModal(cita)}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  <ClipboardEdit size={16} /> Registrar Atención
                </button>
                
                <button 
                  onClick={() => openHistorial(cita.paciente.id)}
                  className="bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-emerald-100 transition-all"
                >
                  Ver Historial
                </button>

                <button 
                  onClick={() => exportarHistorialPDF(cita.paciente.id)}
                  className="bg-blue-50 text-blue-600 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-blue-100 transition-all"
                >
                  <Download size={16} /> Exportar
                </button>

                <div className="h-10 w-px bg-slate-100 mx-2" />

                {Estados.map((est) => (
                  <button
                    key={est}
                    onClick={() => handleStatusUpdate(cita.id, est)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${cita.estado === est ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {est}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL DE REGISTRO DE ATENCIÓN --- */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-w-3xl w-full bg-white rounded-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Registro de Consulta</h2>
              <button onClick={() => setEditModalOpen(false)}><X className="text-slate-400" /></button>
            </div>

            {/* Plantillas guardadas */}
            {plantillas.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-black uppercase text-slate-400 mb-2">Plantillas guardadas</p>
                <div className="flex flex-wrap gap-2">
                  {plantillas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => aplicarPlantilla(p)}
                      className="px-3 py-1.5 rounded-xl text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                    >
                      {p.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveAtencion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-2">Síntomas</label>
                  <textarea 
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    placeholder="¿Qué manifiesta el paciente?"
                    value={editFormData.sintomas}
                    onChange={(e) => setEditFormData({...editFormData, sintomas: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-2">Diagnóstico</label>
                  <textarea 
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    placeholder="Resultado de la evaluación"
                    value={editFormData.diagnostico}
                    onChange={(e) => setEditFormData({...editFormData, diagnostico: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-2">Tratamiento y Recomendaciones</label>
                <textarea 
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Pasos a seguir..."
                  value={editFormData.tratamiento}
                  onChange={(e) => setEditFormData({...editFormData, tratamiento: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-2">Medicinas recetadas</label>
                <textarea 
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Medicamentos y dosis..."
                  value={editFormData.medicinas}
                  onChange={(e) => setEditFormData({...editFormData, medicinas: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-2">Notas adicionales</label>
                <textarea 
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Observaciones..."
                  value={editFormData.notas}
                  onChange={(e) => setEditFormData({...editFormData, notas: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Guardar Atención y Finalizar</>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nombre = prompt("Nombre de la plantilla:");
                    if (nombre) {
                      guardarPlantilla(nombre, editFormData);
                    }
                  }}
                  className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
                >
                  Guardar plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Historial */}
      {historyOpen && historial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-w-4xl w-full bg-white rounded-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Historial de {historial.nombre}</h2>
              <button onClick={() => setHistoryOpen(false)}><X className="text-slate-400" /></button>
            </div>
            
            <div className="space-y-4">
              {historial.citas.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No hay citas registradas.</p>
              ) : (
                historial.citas.map((cita: any) => (
                  <div key={cita.id} className="border border-slate-100 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-slate-900">{new Date(cita.fecha).toLocaleDateString()}</p>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{cita.estado}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2"><strong>Motivo:</strong> {cita.motivo}</p>
                    {cita.diagnostico && <p className="text-sm text-slate-600 mb-1"><strong>Diagnóstico:</strong> {cita.diagnostico}</p>}
                    {cita.tratamiento && <p className="text-sm text-slate-600"><strong>Tratamiento:</strong> {cita.tratamiento}</p>}
                  </div>
                ))
              )}
            </div>
            
            <button
              onClick={() => exportarHistorialPDF(historial.id)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} /> Exportar historial a PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}