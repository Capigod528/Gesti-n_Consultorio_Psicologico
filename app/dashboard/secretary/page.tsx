"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Cita } from "@/types";
import { Calendar, Loader2, RefreshCw, Sparkles, Search, Download, FileText, CheckCircle, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { NuevaCitaModal } from "@/components/nueva-cita-modal";

interface Especialista {
  id: number;
  nombre: string;
  especialidad: string;
}

interface HistorialCambios {
  id: number;
  citaId: number;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  fecha: string;
  usuario: string;
}

const ESTADOS = ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];

export default function SecretaryDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [pacientesCount, setPacientesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState("");
  const [filterFecha, setFilterFecha] = useState("");
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [edits, setEdits] = useState<Record<number, { especialistaId: number; estado: string }>>({});
  const [checkInStates, setCheckInStates] = useState<Record<number, { checked: boolean; hora: string }>>({});
  const [historialCambios, setHistorialCambios] = useState<HistorialCambios[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [citasRes, especialistasRes, pacientesRes] = await Promise.all([
        fetch("/api/citas"),
        fetch("/api/especialistas"),
        fetch("/api/pacientes"),
      ]);

      const citasData = await citasRes.json();
      const especialistasData = await especialistasRes.json();
      const pacientesData = await pacientesRes.json();

      setCitas(Array.isArray(citasData) ? citasData : []);
      setEspecialistas(Array.isArray(especialistasData) ? especialistasData : []);
      setPacientesCount(Array.isArray(pacientesData) ? pacientesData.length : 0);
    } catch (error) {
      toast.error("No se pudieron cargar los datos de secretaria.");
    } finally {
      setLoading(false);
    }
  };

  const exportarAgendaPDF = () => {
    const fechaHoy = new Date().toLocaleDateString('es-PE');
    const htmlContent = `
      <html>
        <head><title>Agenda del día - ${fechaHoy}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #4f46e5;">Agenda - ${fechaHoy}</h1>
          ${filteredCitas.map(cita => `
            <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
              <p><strong>${cita.paciente?.nombre}</strong> - ${new Date(cita.fecha).toLocaleTimeString()}</p>
              <p>Especialista: ${cita.especialista?.nombre}</p>
              <p>Estado: ${cita.estado}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-${fechaHoy}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Agenda exportada");
  };

  const handleCheckIn = async (citaId: number) => {
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    
    setCheckInStates(prev => ({
      ...prev,
      [citaId]: { checked: true, hora: horaFormateada }
    }));
    toast.success("Check-in registrado");
  };

  const handleEliminarCita = async (citaId: number) => {
    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;
    
    try {
      const res = await fetch(`/api/citas/${citaId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Cita eliminada");
        fetchData();
      }
    } catch (error) {
      toast.error("Error al eliminar cita");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  useEffect(() => {
    const changes: Record<number, { especialistaId: number; estado: string }> = {};
    citas.forEach((cita) => {
      changes[cita.id] = {
        especialistaId: cita.especialista?.id ?? cita.especialistaId,
        estado: cita.estado?.toUpperCase() ?? "PENDIENTE",
      };
    });
    setEdits(changes);
  }, [citas]);

  const handleSelectChange = (citaId: number, field: "especialistaId" | "estado", value: string) => {
    setEdits((prev) => ({
      ...prev,
      [citaId]: {
        ...prev[citaId],
        [field]: field === "especialistaId" ? Number(value) : value,
      },
    }));
  };

  const handleUpdateCita = async (citaId: number) => {
    const edit = edits[citaId];
    if (!edit) return;

    try {
      setLoading(true);
      // ✅ Ahora apunta a /api/citas/[id] con el ID en la URL
      const res = await fetch(`/api/citas/${citaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          especialistaId: edit.especialistaId,
          estado: edit.estado,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar cita");
      toast.success("Cita actualizada correctamente");
      fetchData();
    } catch (error) {
      toast.error("No se pudo actualizar la cita.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCitas = useMemo(() => {
    return citas.filter((cita) => {
      const matchEstado = !filterEstado || cita.estado?.toUpperCase() === filterEstado;
      const matchFecha = !filterFecha || new Date(cita.fecha).toISOString().split('T')[0] === filterFecha;
      const matchBusqueda = !busquedaPaciente || 
        cita.paciente?.nombre?.toLowerCase().includes(busquedaPaciente.toLowerCase());
      return matchEstado && matchFecha && matchBusqueda;
    });
  }, [citas, filterEstado, filterFecha, busquedaPaciente]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="font-bold text-slate-400 animate-pulse">Cargando panel de secretaria...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Panel de Secretaria
        </h1>
        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Revisa, crea y asigna citas de tu consulta.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Citas activas</p>
          <h2 className="text-4xl font-black text-slate-900 mt-4">{loading ? "..." : citas.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pacientes</p>
          <h2 className="text-4xl font-black text-slate-900 mt-4">{loading ? "..." : pacientesCount}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Especialistas</p>
          <h2 className="text-4xl font-black text-slate-900 mt-4">{loading ? "..." : especialistas.length}</h2>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <div className="bg-white rounded-4xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <Calendar size={24} className="text-indigo-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Agenda rápida</h2>
                <p className="text-slate-500 text-sm">Crea citas nuevas y asigna especialistas al instante.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <Button onClick={fetchData} variant="outline" className="w-full rounded-2xl py-3">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualizar lista
              </Button>
              <Button
                onClick={() => router.push("/dashboard/pacientes")}
                className="w-full rounded-2xl py-3 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Ver pacientes
              </Button>
            </div>
          </div>

          <NuevaCitaModal onClose={() => {}} onSuccess={fetchData} />
        </aside>

        <main>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Citas programadas</h2>
              <p className="text-slate-500 mt-1">Revisa y asigna especialistas desde aquí.</p>
            </div>
            <div className="flex flex-wrap gap-2 bg-white border border-slate-200 rounded-3xl p-2 shadow-sm">
              <Button
                variant={filterEstado === "" ? "default" : "outline"}
                onClick={() => setFilterEstado("")}
                className="rounded-full px-4"
              >
                Todas
              </Button>
              {ESTADOS.map((estado) => (
                <Button
                  key={estado}
                  variant={filterEstado === estado ? "default" : "outline"}
                  onClick={() => setFilterEstado(estado)}
                  className="rounded-full px-4 capitalize"
                >
                  {estado.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="rounded-4xl bg-white p-10 text-center shadow-sm border border-slate-200">
              <Loader2 className="animate-spin mx-auto text-indigo-600" size={40} />
            </div>
          ) : filteredCitas.length === 0 ? (
            <div className="rounded-4xl bg-white p-10 text-center shadow-sm border border-slate-200">
              <p className="text-slate-500">No hay citas con ese filtro.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCitas.map((cita) => {
                const fecha = new Date(cita.fecha);
                const fechaFormateada = fecha.toLocaleDateString("es-PE", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const horaFormateada = fecha.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const selectedEdit = edits[cita.id] || {
                  especialistaId: cita.especialista?.id ?? cita.especialistaId,
                  estado: cita.estado?.toUpperCase() ?? "PENDIENTE",
                };

                return (
                  <div key={cita.id} className="bg-white rounded-4xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Cita #{cita.id}</h3>
                        <p className="text-slate-500 text-sm mt-1">
                          {cita.paciente?.nombre ?? cita.pacienteNombre}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase text-indigo-700">
                          {selectedEdit.estado.toLowerCase()}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {fechaFormateada} • {horaFormateada}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 mt-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Especialista</p>
                        <select
                          value={selectedEdit.especialistaId}
                          onChange={(e) => handleSelectChange(cita.id, "especialistaId", e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                          {especialistas.map((esp) => (
                            <option key={esp.id} value={esp.id}>
                              {esp.nombre} ({esp.especialidad})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Estado</p>
                        <select
                          value={selectedEdit.estado}
                          onChange={(e) => handleSelectChange(cita.id, "estado", e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado.toLowerCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-slate-500 text-sm">Motivo: {cita.motivo}</p>
                      <Button
                        onClick={() => handleUpdateCita(cita.id)}
                        className="rounded-2xl px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Guardar cambios
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}