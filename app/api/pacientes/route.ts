import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({
      include: { citas: true } // Esto traerá también sus citas agendadas
    });
    return NextResponse.json(pacientes);
  } catch (error) {
    console.error("Error en GET Pacientes:", error);
    return NextResponse.json({ error: "Error al obtener pacientes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validación de campos obligatorios
    if (!body.nombre || !body.email || !body.edad) {
      return NextResponse.json({ error: "Nombre, email y edad son obligatorios" }, { status: 400 });
    }

    const nuevoPaciente = await prisma.paciente.create({
      data: {
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono || null,
        edad: Number(body.edad),
      },
    });
    return NextResponse.json(nuevoPaciente);
  } catch (error) {
    console.error("Error en POST Paciente:", error);
    return NextResponse.json({ error: "Error al registrar paciente. ¿El email ya existe?" }, { status: 500 });
  }
}
