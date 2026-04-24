"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PacienteTable } from "@/components/pacientes/PacienteTable"; // Asegúrate que el nombre coincida
import { UserPlus, Loader2, Pencil, Search } from "lucide-react";

interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  edad: number;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null as number | null,
    nombre: "",
    email: "",
    telefono: "",
    edad: ""
  });

  const fetchPacientes = async () => {
    try {
      const res = await fetch("/api/pacientes");
      if (!res.ok) throw new Error("Error al cargar pacientes");
      const data = await res.json();
      setPacientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPacientes(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("handleSubmit called");
      console.log("formData:", formData);
      const method = isEditing ? "PUT" : "POST";
      const url = "/api/pacientes";
  
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            edad: parseInt(formData.edad)
          }),
        });
        console.log("Response from API:", res);

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchPacientes();
      }
    } catch (error) {
      alert("Error al procesar la solicitud");
    }
  };

  const resetForm = () => {
    setFormData({ id: null, nombre: "", email: "", telefono: "", edad: "" });
    setIsEditing(false);
  };

  const handleEdit = (paciente: Paciente) => {
    setFormData({
      id: paciente.id,
      nombre: paciente.nombre,
      email: paciente.email,
      telefono: paciente.telefono,
      edad: paciente.edad.toString()
    });
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
          <p className="text-slate-500 text-sm">Gestiona la información de tus pacientes registrados.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-md"
        >
          <UserPlus size={18} /> Nuevo Paciente
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Aquí pasamos la función handleEdit a tu tabla */}
          <PacienteTable pacientes={pacientes} onEdit={handleEdit} onDelete={fetchPacientes} />
        </div>
      )}

      {/* MODAL PARA AGREGAR/EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-slate-800">
              {isEditing ? "Editar Paciente" : "Registrar Nuevo Paciente"}
            </h2>
            
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