import { prisma } from "@/lib/prisma";

// --- OBTENER CITAS (Incluyendo Especialista para la tabla) ---
export async function getCitas() {
  try {
    const citas = await prisma.cita.findMany({
      include: {
        paciente: true,
        especialista: true, // ¡IMPORTANTE! Para que aparezca en tu tabla
      },
      orderBy: {
        fecha: "asc",
      },
    });
    return { data: citas };
  } catch (error) {
    console.error("Error en getCitas service:", error);
    return { error: "No se pudieron obtener las citas", status: 500 };
  }
}

// --- CREAR CITA (Corregido el error del ID NULL) ---
export async function createCita(data: any) {
  // 1. Extraemos los campos para evitar que el "id: null" entre al create
  const { id, fecha, motivo, pacienteId, especialistaId } = data;

  // Validación de conflicto
  const conflicto = await prisma.cita.findFirst({
    where: {
      fecha: new Date(fecha),
      especialistaId: Number(especialistaId)
    }
  });

  if (conflicto) return { error: "Conflicto de horario", status: 409 };

  // 2. Definimos los datos explícitamente sin usar ...data
  const nuevaCita = await prisma.cita.create({
    data: {
      fecha: new Date(fecha),
      motivo: motivo,
      pacienteId: Number(pacienteId),
      especialistaId: Number(especialistaId),
    }
  });
  
  return { data: nuevaCita, status: 201 };
}

// --- ACTUALIZAR CITA ---
export async function updateCita(id: number, data: any) {
  try {
    // Extraemos id para que no se intente actualizar la llave primaria
    const { id: _, ...datosAActualizar } = data;

    if (datosAActualizar.fecha || datosAActualizar.especialistaId) {
      const conflicto = await prisma.cita.findFirst({
        where: {
          fecha: datosAActualizar.fecha ? new Date(datosAActualizar.fecha) : undefined,
          especialistaId: datosAActualizar.especialistaId ? Number(datosAActualizar.especialistaId) : undefined,
          NOT: { id: id },
        },
      });
      if (conflicto) return { error: "Conflicto de horario al actualizar", status: 409 };
    }

    const citaActualizada = await prisma.cita.update({
      where: { id },
      data: {
        motivo: datosAActualizar.motivo,
        fecha: datosAActualizar.fecha ? new Date(datosAActualizar.fecha) : undefined,
        pacienteId: datosAActualizar.pacienteId ? Number(datosAActualizar.pacienteId) : undefined,
        especialistaId: datosAActualizar.especialistaId ? Number(datosAActualizar.especialistaId) : undefined,
      },
    });
    return { data: citaActualizada, status: 200 };
  } catch (error) {
    console.error("Error en updateCita service:", error);
    return { error: "No se pudo actualizar la cita", status: 500 };
  }
}

export async function deleteCita(id: number) {
  try {
    await prisma.cita.delete({
      where: { id },
    });
    return { data: { message: "Cita eliminada" }, status: 200 };
  } catch (error) {
    console.error("Error en deleteCita service:", error);
    return { error: "No se pudo eliminar la cita", status: 500 };
  }
}