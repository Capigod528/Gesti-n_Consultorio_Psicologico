import { prisma } from "@/lib/prisma";

export async function getAllEspecialistas() {
  return await prisma.especialista.findMany({
    where: { activo: true }
  });
}

export async function createEspecialista(data: any) {
  return await prisma.especialista.create({
    data: {
      nombre: data.nombre,
      especialidad: data.especialidad,
      email: data.email,
      telefono: data.telefono || "",
    }
  });
}