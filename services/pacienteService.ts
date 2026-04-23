import { prisma } from "@/lib/prisma";

export async function getAllPacientes() {
  return await prisma.paciente.findMany({ where: { activo: true } });
}

export async function createPaciente(data: any) {
  return await prisma.paciente.create({ data });
}