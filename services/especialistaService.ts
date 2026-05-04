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
      // Vinculamos con el usuario de Auth si viene en el data
      userId: data.userId || null, 
    }
  });
}

export async function updateEspecialista(id: number, data: any) {
  return await prisma.especialista.update({
    where: { id },
    data: {
      nombre: data.nombre,
      email: data.email,
      especialidad: data.especialidad,
      telefono: data.telefono || "",
    }
  });
}

export async function deleteEspecialista(id: number) {
  return await prisma.especialista.update({
    where: { id },
    data: { activo: false }
  });
}

// Nueva función para obtener el perfil mediante el ID de usuario de la sesión
export async function getEspecialistaByUserId(userId: string) {
  return await prisma.especialista.findUnique({
    where: { userId }
  });
}