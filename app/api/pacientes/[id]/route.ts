import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PUT: Actualizar un paciente existente
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();

    const actualizado = await prisma.paciente.update({
      where: { id },
      data: {
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        edad: Number(body.edad),
      },
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar paciente" }, { status: 500 });
  }
}

// DELETE: Eliminar un paciente
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.paciente.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "No se puede eliminar: tiene citas asociadas" }, { status: 400 });
  }
}