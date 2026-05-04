"use client";

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import {
  Brain, ArrowRight, ShieldCheck, Zap, Sparkles,
  Calendar, Users, BarChart3, TrendingUp, CheckCircle2,
  Phone, Mail, MapPin, Clock, Star, ChevronDown, MessageCircle,
  ClipboardList, HeartHandshake, Send
} from "lucide-react";

// --- COMPONENTE DROPDOWN ---
function RoleDropdown({ label, links }: { label: string; links: Array<{ text: string; href: string }> }) {
  return (
    <div className="relative group">
      <button className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors py-2">
        {label}
        <ChevronDown size={16} className="inline ml-1 group-hover:rotate-180 transition-transform" />
      </button>
      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-w-56">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 transition-colors"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE DE CONTADOR ANIMADO ---
function Counter({ value, duration = 2000 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let totalMiliseconds = duration;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
}

// --- COMPONENTE FAQ ---
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown size={20} className={`text-indigo-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [contactSent, setContactSent] = useState(false);
  const [sendingContact, setSendingContact] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingContact(true);
    // Aquí iría la llamada al API de contacto / Resend
    await new Promise(r => setTimeout(r, 1200));
    setContactSent(true);
    setSendingContact(false);
  };

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 selection:bg-indigo-100 relative overflow-hidden font-sans">
      
      {/* Fondo y Gradientes */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")`,
      }}></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-[128px] z-0"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-100/30 rounded-full blur-[128px] z-0"></div>

      {/* Navegación */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl tracking-tight">
            <Brain size={32} className="animate-pulse" />
            <span>PsicoControl</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#como-funciona" className="hover:text-indigo-600 transition-colors">¿Cómo funciona?</a>
            <a href="#testimonios" className="hover:text-indigo-600 transition-colors">Testimonios</a>
            <a href="#contacto" className="hover:text-indigo-600 transition-colors">Contacto</a>
          </div>
          <div className="flex items-center gap-6">
            <RoleDropdown
              label="Registrar"
              links={[
                { text: "Como Especialista", href: "/register?role=SPECIALIST" },
                { text: "Como Secretaria", href: "/register?role=SECRETARY" }
              ]}
            />
            <RoleDropdown
              label="Iniciar Sesión"
              links={[
                { text: "Como Especialista", href: "/login?role=SPECIALIST" },
                { text: "Como Secretaria", href: "/login?role=SECRETARY" }
              ]}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-10 border border-indigo-100 shadow-inner">
            <Sparkles size={14} /> La nueva era de la gestión psicológica
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold text-slate-950 mb-10 tracking-tighter leading-[1.05]">
            Tu consultorio bajo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              control total.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl lg:text-2xl text-slate-600 mb-16 leading-relaxed font-medium">
            Organiza pacientes, sesiones y historias clínicas en una plataforma
            diseñada para la eficiencia y la seguridad.
          </p>
        </div>
      </header>

      {/* CONTADORES */}
      <section className="py-24 bg-slate-950 relative overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-indigo-500 tracking-tighter">+<Counter value={500} /></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pacientes Felices</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-emerald-500 tracking-tighter"><Counter value={99} />%</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Disponibilidad</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-violet-500 tracking-tighter">+<Counter value={10} />k</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Citas Exitosas</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl lg:text-6xl font-black text-amber-500 tracking-tighter">24/7</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Soporte Activo</p>
            </div>
          </div>
        </div>
      </section>

      {/* ¿CÓMO FUNCIONA? */}
      <section id="como-funciona" className="py-32 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100">
            <Zap size={13} /> Simple y rápido
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            ¿Cómo funciona?
          </h2>
          <p className="text-slate-500 text-xl font-medium mb-20 max-w-xl mx-auto">
            En 3 pasos sencillos, tu consultorio estará en marcha.
          </p>

          <div className="grid lg:grid-cols-3 gap-8 relative">
            {/* Línea conectora desktop */}
            <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-emerald-200 z-0"></div>

            {[
              {
                step: "01",
                icon: <Sparkles size={28} />,
                color: "indigo",
                title: "Crea tu cuenta",
                desc: "Regístrate como especialista o secretaria. Solo toma 1 minuto."
              },
              {
                step: "02",
                icon: <Calendar size={28} />,
                color: "violet",
                title: "Agenda una cita",
                desc: "El paciente o secretaria programa la cita con el especialista disponible."
              },
              {
                step: "03",
                icon: <HeartHandshake size={28} />,
                color: "emerald",
                title: "Gestiona y atiende",
                desc: "Registra notas, historial clínico y seguimiento desde el panel dedicado."
              }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center p-10 rounded-4xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-lg text-white
                  ${item.color === 'indigo' ? 'bg-indigo-600' : item.color === 'violet' ? 'bg-violet-600' : 'bg-emerald-600'}`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-black uppercase tracking-widest mb-3
                  ${item.color === 'indigo' ? 'text-indigo-400' : item.color === 'violet' ? 'text-violet-400' : 'text-emerald-400'}`}>
                  Paso {item.step}
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="py-32 bg-[#fafbff] relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Conoce tus opciones
          </h2>
          <p className="text-slate-500 font-medium text-xl mb-20">
            Dos roles especializados para gestionar tu consultorio
          </p>
          <div className="grid lg:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="p-10 rounded-4xl border-2 bg-indigo-50 border-indigo-200">
              <div className="w-16 h-16 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg mx-auto text-3xl bg-indigo-600">
                🏥
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Especialista</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Gestiona tus pacientes, sesiones y registra historias clínicas en tiempo real.</p>
            </div>
            <div className="p-10 rounded-4xl border-2 bg-emerald-50 border-emerald-200">
              <div className="w-16 h-16 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg mx-auto text-3xl bg-emerald-600">
                📋
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Secretaria</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Administra la agenda, citas, pacientes y coordina el equipo de especialistas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HERRAMIENTAS PREMIUM */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-20">
            Herramientas <span className="text-indigo-600 italic">Premium</span>
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="relative group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all overflow-hidden text-left">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg"><Calendar size={28} /></div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Gestión de Citas</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">Calendario inteligente con recordatorios automáticos por correo.</p>
              <div className="absolute -right-2 -bottom-2 w-32 h-32 opacity-10 flex items-end gap-1 px-4"><div className="w-4 bg-indigo-600 h-[40%] rounded-t-md"></div><div className="w-4 bg-indigo-600 h-[95%] rounded-t-md animate-pulse"></div></div>
            </div>
            <div className="relative group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all overflow-hidden text-left">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg"><Users size={28} /></div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Expedientes Digitales</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">Historias clínicas organizadas, accesibles y seguras en la nube.</p>
              <div className="absolute right-6 top-10 text-emerald-100 opacity-20"><TrendingUp size={120} strokeWidth={1} /></div>
            </div>
            <div className="relative group p-10 rounded-[3rem] bg-indigo-600 text-white shadow-xl hover:-translate-y-2 transition-all overflow-hidden text-left">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30"><ShieldCheck size={28} /></div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">Seguridad Blindada</h3>
              <p className="text-indigo-100 font-medium leading-relaxed mb-8">Encriptación de nivel bancario para proteger la privacidad del paciente.</p>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white w-[85%] animate-pulse"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-32 bg-slate-950 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-8 border border-white/20">
            <Star size={13} className="text-amber-400" /> Lo que dicen nuestros usuarios
          </div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-20">
            Confiado por <span className="text-indigo-400">profesionales</span>
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dra. María Torres",
                role: "Psicóloga Clínica",
                avatar: "MT",
                color: "indigo",
                text: "PsicoControl transformó la forma en que administro mi consultorio. Ahora tengo todo centralizado y mis pacientes reciben recordatorios automáticos. ¡Ya no tengo ausencias!"
              },
              {
                name: "Carlos Mendoza",
                role: "Paciente",
                avatar: "CM",
                color: "emerald",
                text: "Puedo ver mis citas, mi historial y comunicarme con mi especialista desde un solo lugar. La plataforma es muy fácil de usar y me da mucha tranquilidad."
              },
              {
                name: "Ana Lucía Ríos",
                role: "Secretaria Administrativa",
                avatar: "AL",
                color: "violet",
                text: "Antes manejaba todo en Excel y llamadas telefónicas. Ahora con PsicoControl puedo asignar especialistas, confirmar citas y ver estadísticas en segundos."
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 font-medium leading-relaxed mb-8 text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-sm
                    ${t.color === 'indigo' ? 'bg-indigo-600' : t.color === 'emerald' ? 'bg-emerald-600' : 'bg-violet-600'}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-slate-400 text-sm font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-slate-500 font-medium text-lg">Todo lo que necesitas saber antes de empezar.</p>
          </div>
          <div className="space-y-3">
            <FAQItem question="¿Cómo agendar una cita como paciente?" answer="Regístrate con el rol de Paciente, accede a tu panel y selecciona 'Nueva cita'. Elige el especialista disponible, la fecha y el motivo de consulta. Recibirás un correo de confirmación automático." />
            <FAQItem question="¿Puedo tener más de un especialista en el sistema?" answer="Sí, el sistema soporta múltiples especialistas. La secretaria puede registrarlos y asignarles citas de forma independiente desde su panel." />
            <FAQItem question="¿Los datos de los pacientes están seguros?" answer="Absolutamente. Usamos encriptación de nivel bancario para proteger todos los datos clínicos. Cumplimos con buenas prácticas de seguridad y privacidad de datos." />
            <FAQItem question="¿Recibiré recordatorios de mis citas?" answer="Sí. El sistema envía correos automáticos de confirmación y recordatorio cuando se programa o actualiza una cita, tanto al paciente como al especialista." />
            <FAQItem question="¿Puedo cancelar o reprogramar una cita?" answer="Sí, desde tu panel puedes cambiar el estado de una cita a Cancelada o Reprogramada. El especialista y secretaria también pueden gestionarlo desde sus respectivos paneles." />
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-32 bg-[#fafbff] border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100">
              <MessageCircle size={13} /> Estamos aquí para ti
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Contáctanos
            </h2>
            <p className="text-slate-500 text-xl font-medium">¿Tienes dudas o quieres una demostración? Escríbenos.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Info de contacto */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-8">Información del consultorio</h3>
                <div className="space-y-5">
                  {[
                    { icon: <Phone size={20} />, label: "Teléfono", value: "+51 076 123 456", color: "indigo" },
                    { icon: <Mail size={20} />, label: "Correo", value: "contacto@psicocontrol.pe", color: "violet" },
                    { icon: <MapPin size={20} />, label: "Dirección", value: "Jr. Amazonas 450, Cajamarca, Perú", color: "emerald" },
                    { icon: <Clock size={20} />, label: "Horario de atención", value: "Lun – Vie: 8:00 am – 6:00 pm", color: "amber" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0
                        ${item.color === 'indigo' ? 'bg-indigo-600' : item.color === 'violet' ? 'bg-violet-600' : item.color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-500'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                        <p className="font-bold text-slate-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapa embed placeholder */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm h-52 bg-slate-100 flex items-center justify-center">
                <iframe
                  title="Ubicación del consultorio"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15671.245!2d-78.5127!3d-7.1638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b23b0d5c456789%3A0x1234567890abcdef!2sCajamarca%2C%20Peru!5e0!3m2!1ses!2spe!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="grayscale opacity-80"
                ></iframe>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="bg-white p-10 rounded-4xl border border-slate-200 shadow-sm">
              {contactSent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">¡Mensaje enviado!</h3>
                  <p className="text-slate-500 font-medium">Te responderemos a la brevedad posible. Gracias por contactarnos.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-slate-900 mb-8">Envíanos un mensaje</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Nombre</label>
                        <input
                          type="text" required
                          placeholder="Tu nombre completo"
                          value={contactForm.nombre}
                          onChange={e => setContactForm({ ...contactForm, nombre: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Teléfono</label>
                        <input
                          type="tel"
                          placeholder="+51 999 999 999"
                          value={contactForm.telefono}
                          onChange={e => setContactForm({ ...contactForm, telefono: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Correo electrónico</label>
                      <input
                        type="email" required
                        placeholder="tu@correo.com"
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Mensaje</label>
                      <textarea
                        required rows={4}
                        placeholder="¿En qué podemos ayudarte?"
                        value={contactForm.mensaje}
                        onChange={e => setContactForm({ ...contactForm, mensaje: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sendingContact}
                      className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {sendingContact ? "Enviando..." : "Enviar mensaje"}
                      <Send size={20} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-slate-950 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl mb-4">
                <Brain size={26} />
                <span>PsicoControl</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">
                Plataforma de gestión para consultorios psicológicos. Diseñada para eficiencia, seguridad y bienestar.
              </p>
            </div>
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-5">Acceso rápido</h4>
              <div className="space-y-3 text-sm">
                <Link href="/register?role=SPECIALIST" className="block text-slate-400 hover:text-white transition-colors font-medium">Registrarse como Especialista</Link>
                <Link href="/register?role=SECRETARY" className="block text-slate-400 hover:text-white transition-colors font-medium">Registrarse como Secretaria</Link>
              </div>
            </div>
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-5">Contacto</h4>
              <div className="space-y-3 text-sm text-slate-400 font-medium">
                <p className="flex items-center gap-2"><Phone size={14} /> +51 076 123 456</p>
                <p className="flex items-center gap-2"><Mail size={14} /> contacto@psicocontrol.pe</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> Jr. Amazonas 450, Cajamarca</p>
                <p className="flex items-center gap-2"><Clock size={14} /> Lun – Vie: 8:00 am – 6:00 pm</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm font-medium">
            <p>PsicoControl © 2026 — Todos los derechos reservados</p>
            <p className="italic">Gestión Profesional y Confidencial</p>
          </div>
        </div>
      </footer>
    </div>
  );
}