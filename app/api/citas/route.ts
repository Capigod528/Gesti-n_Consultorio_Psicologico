import { NextResponse } from "next/server";
import { createCita, getCitas, updateCita, deleteCita } from "@/services/citaService";

// --- FUNCIÓN PARA OBTENER LAS CITAS (Arregla el error 405) ---
export async function GET() {
  try {
    const result = await getCitas();
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status || 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error en GET /api/citas:", error);
    return NextResponse.json(
      { error: "Error al obtener las citas" }, 
      { status: 500 }
    );
  }
}

// --- TU FUNCIÓN POST QUE YA TENÍAS ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createCita(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/citas:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la cita" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de cita no proporcionado" }, { status: 400 });
    }

    const result = await updateCita(id, data);

    if (result.error) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error en PUT /api/citas:", error);
    return NextResponse.json(
      { error: "Error al actualizar cita" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID de cita no proporcionado" }, { status: 400 });
    }
    
    const result = await deleteCita(id);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error en DELETE /api/citas:", error);
    return NextResponse.json(
      { error: "Error al eliminar cita" }, 
      { status: 500 }
    );
  }
}
