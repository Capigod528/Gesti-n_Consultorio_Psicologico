import { NextResponse } from "next/server";
import { createCita, getCitas } from "@/services/citaService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const especialistaIdParam = searchParams.get("especialistaId");
    const filter = especialistaIdParam ? { especialistaId: Number(especialistaIdParam) } : undefined;
    const result = await getCitas(filter);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error en GET /api/citas:", error);
    return NextResponse.json({ error: "Error al obtener las citas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createCita(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/citas:", error);
    return NextResponse.json({ error: "Error interno al procesar la cita" }, { status: 500 });
  }
}