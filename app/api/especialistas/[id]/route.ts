import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const body = await request.json();

    const actualizado = await prisma.especialista.update({
      where: { id },
      data: {
        nombre: body.nombre,
        email: body.email,
        especialidad: body.especialidad,
        telefono: body.telefono,
      }
    });
    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    await prisma.especialista.update({
      where: { id },
      data: { activo: false }
    });
    return NextResponse.json({ message: "Especialista desactivado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al desactivar especialista" }, { status: 500 });
  }
}
