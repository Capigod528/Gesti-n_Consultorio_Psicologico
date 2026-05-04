import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const especialista = await prisma.especialista.findUnique({
    where: { userId }
  });

  if (!especialista) {
    return NextResponse.json({ error: "No tienes un perfil de especialista vinculado" }, { status: 404 });
  }

  // Traer pacientes únicos que tienen citas con este especialista
  const citas = await prisma.cita.findMany({
    where: { especialistaId: especialista.id },
    include: {
      paciente: {
        include: {
          citas: {
            where: { especialistaId: especialista.id },
            orderBy: { fecha: "desc" }
          }
        }
      }
    }
  });

  // Eliminar pacientes duplicados
  const pacientesMap = new Map();
  citas.forEach(cita => {
    if (!pacientesMap.has(cita.paciente.id)) {
      pacientesMap.set(cita.paciente.id, cita.paciente);
    }
  });

  return NextResponse.json(Array.from(pacientesMap.values()));
}