import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Asegúrate de que la ruta a tu prisma client sea correcta

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id); // Extraes el ID de la URL
    const body = await request.json();

    const citaActualizada = await prisma.cita.update({
      where: { id },
      data: {
        fecha: body.fecha ? new Date(body.fecha) : undefined,
        motivo: body.motivo,
        notas: body.notas,
      },
    });
    return NextResponse.json(citaActualizada);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar la cita" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.cita.delete({ where: { id } });
    return NextResponse.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la cita" }, { status: 500 });
  }
}