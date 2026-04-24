"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { 
  Brain, Mail, Lock, ArrowRight, LogIn, Sparkles, Loader2 
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Credenciales incorrectas", {
        description: "Revisa tu correo y contraseña e intenta de nuevo.",
      });
      setLoading(false);
    } else {
      toast.success("¡Bienvenido de nuevo!", {
        icon: <Sparkles className="text-amber-500" />,
      });
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Fondo con orbes (Igual a tu Landing y Register) */}
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
              Accede a tu panel profesional
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" required
                  placeholder="hola@tuconsultorio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="password" required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 hover:-translate-y-1.5 transition-all shadow-2xl shadow-slate-200 mt-6 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Iniciando sesión..." : "Entrar al Panel"}
              <LogIn size={22} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm">
              ¿Eres nuevo?{" "}
              <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-4">
                Crea tu cuenta aquí
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