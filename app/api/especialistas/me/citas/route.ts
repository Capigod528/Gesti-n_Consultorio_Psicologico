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

  // Buscar el especialista vinculado a este usuario
  const especialista = await prisma.especialista.findUnique({
    where: { userId }
  });

  if (!especialista) {
    return NextResponse.json({ error: "No tienes un perfil de especialista vinculado" }, { status: 404 });
  }

  // Traer solo las citas de este especialista
  const citas = await prisma.cita.findMany({
    where: { especialistaId: especialista.id },
    include: { paciente: true },
    orderBy: { fecha: "asc" }
  });

  return NextResponse.json(citas);
}