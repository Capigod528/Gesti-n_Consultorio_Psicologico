"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Brain, Mail, Lock, ArrowRight, UserPlus, Sparkles, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "SPECIALIST";

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          role: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al registrarse");
        setLoading(false);
        return;
      }

      toast.success("¡Cuenta creada exitosamente!", {
        description: "Redirigiendo al inicio de sesión...",
      });

      setTimeout(() => {
        router.push(`/login?role=${role}`);
      }, 1500);
    } catch (error) {
      toast.error("Error al registrarse");
      setLoading(false);
    }
  };

  const getRoleText = () => {
    return role === "SPECIALIST" ? "Especialista" : "Secretaria";
  };

  return (
    <div className="min-h-screen bg-[#fafbff] flex items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* Fondo con orbes */}
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">PsicoControl</h1>
            <p className="text-slate-500 mt-3 font-medium text-sm flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Crear cuenta como {getRoleText()}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Nombre</label>
                <input
                  type="text" required
                  name="nombre"
                  placeholder="Juan"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Apellido</label>
                <input
                  type="text" required
                  name="apellido"
                  placeholder="Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email" required
                  name="email"
                  placeholder="correo@tuconsultorio.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                placeholder="+51 999 999 999"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password" required
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password" required
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 hover:-translate-y-1.5 transition-all shadow-2xl shadow-slate-200 mt-6 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
              <UserPlus size={22} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href={`/login?role=${role}`} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-4">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-8">
          PsicoControl v1.0 — Gestión Profesional
        </p>
      </div>
    </div>
  );
}
