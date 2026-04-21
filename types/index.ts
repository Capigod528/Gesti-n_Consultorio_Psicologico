export interface Especialista {
  id: number;
  nombre: string;
  especialidad: string;
  fotoUrl?: string;
  citas?: Cita[];
}

export interface Cita {
  id: number;
  pacienteNombre: string;
  pacienteEmail: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  estadoAnimo?: string;
  especialistaId: number;
  createdAt: string;
  especialista?: Especialista;
  paciente?: Paciente;
}

export interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  edad?: number;
  fechaNacimiento?: string;
  notas?: string;
}

export interface Sesion {
  id: number;
  citaId: number;
  notas?: string;
  duracion?: number;
  estadoAnimoPost?: string;
  createdAt: string;
}

