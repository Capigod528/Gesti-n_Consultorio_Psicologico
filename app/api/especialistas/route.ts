import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    const especialistas = await prisma.especialista.findMany({
      include: {
        citas: true
      }
    });
    return NextResponse.json(especialistas);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener especialistas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, especialidad, fotoUrl } = await request.json();
    const especialista = await prisma.especialista.create({
      data: {
        nombre,
        especialidad,
        fotoUrl
      }
    });
    return NextResponse.json(especialista, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al crear especialista' }, { status: 500 });
  }
}

