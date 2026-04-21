import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const citas = await prisma.cita.findMany({
      include: {
        especialista: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
    return NextResponse.json(citas);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { pacienteNombre, pacienteEmail, fecha, hora, especialistaId } = await request.json();
    const cita = await prisma.cita.create({
      data: {
        pacienteNombre,
        pacienteEmail,
        fecha,
        hora,
        especialistaId
      }
    });
    return NextResponse.json(cita, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al crear cita' }, { status: 500 });
  }
}

