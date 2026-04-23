import { NextResponse } from "next/server";
import { createCita, getCitas } from "@/services/citaService"; // Asegúrate de importar getCitas

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