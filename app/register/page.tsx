"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { 
  Brain, User, Mail, Lock, ArrowRight, CheckCircle2, Sparkles, Loader2 
} from "lucide-react";

export default function RegisterPage() {
  // 1. Estado actualizado con el campo 'role'
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "SECRETARIO" // Valor por defecto
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("¡Cuenta creada!", {
          description: `Bienvenido, ${formData.name}. Redirigiendo al acceso...`,
          icon: <CheckCircle2 className="text-emerald-500" size={20} />,
        });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al procesar el registro");
      }
    } catch (err) {
      toast.error("Error crítico de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Fondo decorativo */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[120px] z-0"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.1)] border border-white p-8 md:p-12 transition-all">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6">
              {loading ? (
                <Loader2 size={36} className="animate-spin" />
              ) : (
                <Brain size={36} className="animate-pulse" />
              )}
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Únete a PsicoControl</h1>
            <p className="text-slate-500 mt-3 font-medium text-sm flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Gestión profesional para tu consultorio
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="text" required
                  placeholder="Ej. Psic. Anderson"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" required
                  placeholder="hola@tuconsultorio.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="password" required
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* 2. Selector de Rol */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: "SECRETARIO"})}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                    formData.role === "SECRETARIO"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-slate-100 bg-white/50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  📋 Secretario
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: "ESPECIALISTA"})}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                    formData.role === "ESPECIALISTA"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-slate-100 bg-white/50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  🧠 Especialista
                </button>
              </div>
            </div>

            {/* Botón Submit */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 hover:-translate-y-1.5 transition-all shadow-2xl shadow-slate-200 mt-6 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Creando cuenta..." : "Crear mi cuenta"}
              {!loading && <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-4">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-8">
          PsicoControl v1.0 — Seguridad y Confidencialidad
        </p>
      </div>
    </div>
  );
}