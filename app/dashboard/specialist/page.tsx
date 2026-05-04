"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserCheck, Loader2, Sparkles, X } from "lucide-react";
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
  citas: Array<{
    id: number;
    fecha: string;
    motivo: string;
    estado: string;
  }>;
}

export default function SpecialistDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historial, setHistorial] = useState<HistorialPaciente | null>(null);

  const especialistaId = (session?.user as any)?.especialistaId;
  const userName = session?.user?.name || "Especialista";

  useEffect(() => {
    if (status === "authenticated") {
      if (!especialistaId) {
        toast.error("No se encontró el perfil de especialista.");
        return;
      }
      fetchCitas();
    }
  }, [status, especialistaId]);

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
      const res = await fetch("/api/citas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: citaId, estado: newEstado }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar cita");
      toast.success("Estado actualizado correctamente");
      fetchCitas();
    } catch (error) {
      toast.error("No se pudo actualizar el estado.");
    } finally {
      setLoading(false);
    }
  };

  const openHistorial = async (pacienteId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pacientes/${pacienteId}/historial`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cargar el historial");
      setHistorial(data);
      setHistoryOpen(true);
    } catch (error) {
      toast.error("No se pudo cargar el historial del paciente.");
    } finally {
      setLoading(false);
    }
  };

  const closeHistory = () => {
    setHistoryOpen(false);
    setHistorial(null);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={36} className="animate-spin text-indigo-600" />
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
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Hola, {userName}
        </h1>
        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Revisa tus citas y su estado para hoy.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total de citas</p>
          <h2 className="text-4xl font-black text-slate-900 mt-4">{citas.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pendientes</p>
          <h2 className="text-4xl font-black text-slate-900 mt-4">{citas.filter((c) => c.estado === "PENDIENTE").length}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Confirmadas</p>
          <h2 className="text-4xl font-black text-slate-900 mt-4">{citas.filter((c) => c.estado === "CONFIRMADA").length}</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Mis citas</h2>
            <p className="text-slate-500 mt-1">Actualiza el estado y consulta el historial del paciente.</p>
          </div>
          <button
            onClick={fetchCitas}
            className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="animate-spin mx-auto text-indigo-600" size={40} />
          </div>
        ) : citas.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-4xl p-16 text-center">
            <UserCheck size={48} className="mx-auto text-indigo-500 mb-4" />
            <p className="text-slate-500 font-medium">No tienes citas asignadas aún.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {citas.map((cita) => (
              <div key={cita.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{cita.paciente.nombre}</h3>
                    <p className="text-sm text-slate-500">{new Date(cita.fecha).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}</p>
                  </div>
                  <span className="px-4 py-2 rounded-full text-xs font-black uppercase text-white bg-indigo-600">
                    {cita.estado}
                  </span>
                </div>
                <p className="text-slate-600">Motivo: {cita.motivo}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {Estados.map((estado) => {
                    const active = cita.estado === estado;
                    return (
                      <button
                        key={estado}
                        onClick={() => handleStatusUpdate(cita.id, estado)}
                        className={`rounded-2xl px-3 py-2 text-xs font-black transition-all ${active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        {estado}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => openHistorial(cita.paciente.id)}
                    className="rounded-2xl px-3 py-2 text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
                  >
                    Ver historial del paciente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {historyOpen && historial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-w-3xl w-full overflow-auto rounded-4xl bg-white shadow-2xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Historial de {historial.nombre}</h2>
                <p className="text-slate-500 mt-1">Citas previas del paciente y estado actual.</p>
              </div>
              <button onClick={closeHistory} className="text-slate-500 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                <p className="mt-2 font-bold text-slate-900">{historial.email}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Teléfono</p>
                <p className="mt-2 font-bold text-slate-900">{historial.telefono || "No registrado"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Edad</p>
                <p className="mt-2 font-bold text-slate-900">{historial.edad ?? "No registrado"}</p>
              </div>
            </div>

            <div className="space-y-4">
              {historial.citas.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                  No hay citas previas registradas.
                </div>
              ) : (
                historial.citas.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 p-6 bg-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-slate-500 text-sm">{new Date(item.fecha).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</p>
                        <h3 className="text-lg font-bold text-slate-900 mt-2">{item.motivo}</h3>
                      </div>
                      <span className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-black uppercase text-white">{item.estado}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
