export interface Especialista {
  id: number;
  nombre: string;
  especialidad: string;
  fotoUrl?: string;
  citas?: Cita[];
}

export interface Cita {
  id: number
  pacienteNombre: string
  pacienteEmail: string
  fecha: string
  hora: string
  motivo: string        // ✅ agregar esto
  notas?: string        // ✅ también existe en el schema
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA'
  estadoAnimo?: string
  especialistaId: number
  pacienteId: number    // ✅ también existe en el schema
  createdAt: string
  updatedAt?: string
  especialista?: Especialista
  paciente?: Paciente
}

export interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  edad?: number;
  fechaNacimiento?: string;
  notas?: string;
  citas?: Cita[];
}

export interface Sesion {
  id: number;
  citaId: number;
  notas?: string;
  duracion?: number;
  estadoAnimoPost?: string;
  createdAt: string;
}

