import { prisma } from "@/lib/prisma";

// --- NUEVA FUNCIÓN PARA OBTENER CITAS ---
export async function getCitas() {
  try {
    const citas = await prisma.cita.findMany({
      include: {
        paciente: true, // Trae los datos del paciente (nombre, etc.)
      },
      orderBy: {
        fecha: "asc", // Las ordena por fecha (la más cercana primero)
      },
    });
    return { data: citas };
  } catch (error) {
    console.error("Error en getCitas service:", error);
    return { error: "No se pudieron obtener las citas", status: 500 };
  }
}

// --- TU FUNCIÓN CREATE QUE YA TENÍAS ---
export async function createCita(data: any) {
  // Validación de conflicto
  const conflicto = await prisma.cita.findFirst({
    where: {
      fecha: new Date(data.fecha),
      // Si no usas especialistaId todavía, asegúrate de que el campo exista o sea opcional
      especialistaId: Number(data.especialistaId)
    }
  });

  if (conflicto) return { error: "Conflicto de horario", status: 409 };

  const nuevaCita = await prisma.cita.create({
    data: {
      ...data,
      fecha: new Date(data.fecha),
      pacienteId: Number(data.pacienteId),
      especialistaId: Number(data.especialistaId),
    }
  });
  
  return { data: nuevaCita, status: 201 };
}