"use client";
import { useEffect, useState } from "react";

export default function CitasPage() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]); // Para el selector
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    fecha: "",
    motivo: "",
    notas: "",
    pacienteId: ""
  });

  const fetchData = async () => {
    try {
      const [resCitas, resPacientes] = await Promise.all([
        fetch("/api/citas"),
        fetch("/api/pacientes")
      ]);
      setCitas(await resCitas.json());
      setPacientes(await resPacientes.json());
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pacienteId: parseInt(formData.pacienteId)
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ fecha: "", motivo: "", notas: "", pacienteId: "" });
        fetchData();
      }
    } catch (error) {
      alert("Error al agendar la cita");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando agenda...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Agenda de Citas</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-md"
        >
          + Agendar Cita
        </button>
      </div>

      {/* Tabla de Citas */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 border-b">Fecha</th>
              <th className="p-4 border-b">Paciente</th>
              <th className="p-4 border-b">Motivo</th>
              <th className="p-4 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium">{new Date(c.fecha).toLocaleString()}</td>
                <td className="p-4 text-blue-600 font-bold">{c.paciente?.nombre}</td>
                <td className="p-4">{c.motivo}</td>
                <td className="p-4 font-bold text-emerald-600">Confirmada</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CITA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Nueva Cita Médica</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Seleccionar Paciente</label>
                <select 
                  required
                  className="w-full p-2 border border-slate-300 rounded mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.pacienteId}
                  onChange={(e) => setFormData({...formData, pacienteId: e.target.value})}
                >
                  <option value="">-- Elige un paciente --</option>
                  {pacientes.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Fecha y Hora</label>
                <input 
                  type="datetime-local" required
                  className="w-full p-2 border border-slate-300 rounded mt-1 outline-none"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Motivo de consulta</label>
                <input 
                  type="text" required placeholder="Ej: Ansiedad, Seguimiento..."
                  className="w-full p-2 border border-slate-300 rounded mt-1 outline-none"
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Confirmar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}