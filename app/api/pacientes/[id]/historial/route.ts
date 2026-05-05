// app/api/pacientes/[id]/historial/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajusta según tu carpeta lib

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: paramId } = await params;
    const id = Number(paramId);
    
    const historial = await prisma.paciente.findUnique({
      where: { id },
      include: {
        citas: {
          orderBy: { fecha: 'desc' }, // Las más nuevas arriba
        }
      }
    });

    if (!historial || !historial.activo) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json(historial);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el historial" }, { status: 500 });
  }
}