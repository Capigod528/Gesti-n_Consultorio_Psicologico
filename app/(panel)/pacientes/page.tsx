"use client";
import { useEffect, useState } from "react";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    edad: ""
  });

  const fetchPacientes = async () => {
    const res = await fetch("/api/pacientes");
    const data = await res.json();
    setPacientes(data);
    setLoading(false);
  };

  useEffect(() => { fetchPacientes(); }, []);

  // Función para enviar los datos a MySQL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          edad: parseInt(formData.edad) // Convertir a número para Prisma
        }),
      });

      if (res.ok) {
        setShowModal(false); // Cerrar modal
        setFormData({ nombre: "", email: "", telefono: "", edad: "" }); // Limpiar
        fetchPacientes(); // Recargar tabla
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  if (loading) return <p className="p-8 text-slate-500 text-center">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Pacientes</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          + Nuevo Paciente
        </button>
      </div>

      {/* Tabla de Pacientes */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 border-b">Nombre</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Edad</th>
              <th className="p-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium">{p.nombre}</td>
                <td className="p-4">{p.email}</td>
                <td className="p-4">{p.edad} años</td>
                <td className="p-4">
                  <button className="text-red-500 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DEL FORMULARIO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Registrar Nuevo Paciente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nombre Completo</label>
                <input 
                  type="text" required
                  className="w-full p-2 border border-slate-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input 
                    type="email" required
                    className="w-full p-2 border border-slate-300 rounded mt-1 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Edad</label>
                  <input 
                    type="number" required
                    className="w-full p-2 border border-slate-300 rounded mt-1 outline-none"
                    value={formData.edad}
                    onChange={(e) => setFormData({...formData, edad: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Teléfono</label>
                <input 
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded mt-1 outline-none"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar en MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}