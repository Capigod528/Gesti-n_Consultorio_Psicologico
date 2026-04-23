import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalPacientes, citasHoy, pacienteEstrella] = await Promise.all([
    prisma.paciente.count({ where: { activo: true } }),
    prisma.cita.count({
      where: {
        fecha: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.cita.groupBy({
      by: ['pacienteId'],
      _count: { pacienteId: true },
      orderBy: { _count: { pacienteId: 'desc' } },
      take: 1,
    }),
  ]);

  let nombreEstrella = "Sin datos";
  if (pacienteEstrella.length > 0) {
    const p = await prisma.paciente.findUnique({
      where: { id: pacienteEstrella[0].pacienteId },
      select: { nombre: true }
    });
    nombreEstrella = p?.nombre || "Sin datos";
  }

  return { totalPacientes, citasHoy, pacienteEstrella: nombreEstrella };
}