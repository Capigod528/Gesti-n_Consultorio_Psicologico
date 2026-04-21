import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({
      include: {
        citas: true
      }
    });
    return NextResponse.json(pacientes);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener pacientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, email, telefono, edad, fechaNacimiento, notas } = await request.json();
    const paciente = await prisma.paciente.create({
      data: {
        nombre,
        email,
        telefono,
        edad,
        fechaNacimiento,
        notas
      }
    });
    return NextResponse.json(paciente, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al crear paciente' }, { status: 500 });
  }
}

