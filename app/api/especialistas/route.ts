import { NextResponse } from 'next/server';
import { getAllEspecialistas, createEspecialista } from "@/services/especialistaService";

export async function GET() {
  try {
    const especialistas = await getAllEspecialistas();
    return NextResponse.json(especialistas);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener especialistas" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoEspecialista = await createEspecialista(body);
    return NextResponse.json(nuevoEspecialista, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear especialista" }, 
      { status: 500 }
    );
  }
}