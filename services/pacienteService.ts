import { prisma } from "@/lib/prisma";

export async function getAllPacientes() {
  // Solo trae los pacientes que no han sido borrados lógicamente
  return await prisma.paciente.findMany({ where: { activo: true } });
}

export async function createPaciente(data: any) {
  try {
    // 1. Extraemos el id para evitar que el "null" rompa la inserción
    // 2. Extraemos los demás campos para tener control total
    const { id, ...datosLimpios } = data;

    const nuevoPaciente = await prisma.paciente.create({
      data: {
        nombre: datosLimpios.nombre,
        email: datosLimpios.email,
        telefono: datosLimpios.telefono,
        // Aseguramos que la edad sea un número entero
        edad: parseInt(datosLimpios.edad),
        activo: true // Por defecto al crear
      },
    });
    return { data: nuevoPaciente, status: 201 };
  } catch (error) {
    console.error("Error al crear paciente:", error);
    return { error: "Error al crear el paciente", status: 500 };
  }
}

export async function updatePaciente(id: number, data: any) {
  try {
    // También limpiamos el id aquí por seguridad
    const { id: _, ...datosActualizar } = data;

    const pacienteActualizado = await prisma.paciente.update({
      where: { id: Number(id) },
      data: {
        ...datosActualizar,
        // Si la edad viene en el update, la convertimos a número
        edad: datosActualizar.edad ? parseInt(datosActualizar.edad) : undefined,
      },
    });
    return { data: pacienteActualizado, status: 200 };
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    return { error: "Error al actualizar el paciente", status: 500 };
  }
}

export async function deletePaciente(id: number) {
  try {
    const eliminado = await prisma.paciente.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
    return { data: eliminado, status: 200 };
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    return { error: "Error al eliminar el paciente", status: 500 };
  }
}