import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar Simple */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">MenteSana 🩺</h1>
        <div className="space-x-6 font-medium">
          <a href="#" className="hover:text-blue-600">Inicio</a>
          <a href="#" className="hover:text-blue-600">Especialistas</a>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
            Reservar Cita
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Tu bienestar emocional es nuestra <span className="text-blue-600">prioridad.</span>
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Conecta con los mejores especialistas en psicología desde la comodidad de tu hogar. 
            Agenda una cita hoy mismo y comienza tu camino hacia el equilibrio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
              Ver Especialistas
            </button>
            <button className="border-2 border-slate-200 text-slate-700 text-lg px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition">
              Saber más
            </button>
          </div>
        </div>

        {/* Espacio para una imagen o ilustración */}
        <div className="flex-1 bg-blue-100 w-full h-80 rounded-3xl flex items-center justify-center text-blue-400 border-2 border-dashed border-blue-300">
          <p className="font-medium italic">[ Espacio para imagen del consultorio ]</p>
        </div>
      </main>

      {/* Footer / Stats */}
      <section className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">+15</p>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Especialistas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">100%</p>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Confidencial</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">Online</p>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Atención remota</p>
          </div>
        </div>
      </section>
    </div>
  );
}