export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Bienvenido al Sistema, Psic. Castillo</h1>
      <p className="text-slate-600">Este es el resumen de tu consultorio para hoy.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Pacientes */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-blue-600 text-3xl mb-2">👥</div>
          <h3 className="font-bold text-slate-800 text-lg">Pacientes</h3>
          <p className="text-slate-600 text-sm mb-4">Gestiona la base de datos de tus pacientes.</p>
          <a href="/pacientes" className="text-blue-600 font-semibold hover:underline">Ver lista →</a>
        </div>

        {/* Tarjeta de Citas */}
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-emerald-600 text-3xl mb-2">📅</div>
          <h3 className="font-bold text-slate-800 text-lg">Citas Médicas</h3>
          <p className="text-slate-600 text-sm mb-4">Revisa tu agenda y próximas sesiones.</p>
          <a href="/citas" className="text-emerald-600 font-semibold hover:underline">Ir a la agenda →</a>
        </div>

        {/* Tarjeta de Configuración */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm text-slate-400">
          <div className="text-3xl mb-2">⚙️</div>
          <h3 className="font-bold text-lg text-slate-500">Configuración</h3>
          <p className="text-sm">Próximamente: Ajustes del perfil.</p>
        </div>
      </div>
    </div>
  );
}