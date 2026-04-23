import Link from 'next/link';
import { Home, Users, Calendar, Brain } from 'lucide-react'; // Iconos pro

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col h-screen">
      <div className="p-6 text-xl font-bold border-b border-slate-700 flex items-center gap-2">
        <Brain className="text-blue-400" />
        PsicoControl
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 p-3 rounded hover:bg-slate-700 transition">
          <Home size={20} /> Inicio
        </Link>
        <Link href="/pacientes" className="flex items-center gap-3 p-3 rounded hover:bg-slate-700 transition">
          <Users size={20} /> Pacientes
        </Link>
        <Link href="/citas" className="flex items-center gap-3 p-3 rounded hover:bg-slate-700 transition">
          <Calendar size={20} /> Citas Médicas
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        Usuario: Psic. Castillo
      </div>
    </aside>
  );
}