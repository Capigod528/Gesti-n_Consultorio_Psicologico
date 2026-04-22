import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const citas = await prisma.cita.findMany({
      include: { paciente: true } // Muestra los datos del paciente en la cita
    });
    return NextResponse.json(citas);
  } catch (error) {
    console.error("Error en GET Citas:", error);
    return NextResponse.json({ error: "Error al obtener citas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.fecha || !body.motivo || !body.pacienteId) {
      return NextResponse.json({ error: "Fecha, motivo y pacienteId son obligatorios" }, { status: 400 });
    }

    const nuevaCita = await prisma.cita.create({
      data: {
        fecha: new Date(body.fecha), // Convierte el string de Postman a fecha real
        motivo: body.motivo,
        notas: body.notas || "",
        pacienteId: Number(body.pacienteId),
      },
    });
    return NextResponse.json(nuevaCita);
  } catch (error) {
    console.error("Error en POST Cita:", error);
    return NextResponse.json({ error: "Error al crear la cita. Revisa si el pacienteId existe." }, { status: 500 });
  }
}
