import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllEspecialistas, createEspecialista, updateEspecialista, deleteEspecialista } from "@/services/especialistaService";

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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const actualizado = await updateEspecialista(body.id, body);
    return NextResponse.json(actualizado);
  } catch (error) {
    console.error("Error PUT:", error);
    return NextResponse.json(
      { error: "Error al actualizar especialista" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" }, 
        { status: 400 }
      );
    }

    const resultado = await deleteEspecialista(Number(id));
    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error DELETE:", error);
    return NextResponse.json(
      { error: "Error al eliminar especialista" }, 
      { status: 500 }
    );
  }
}