import { NextResponse } from "next/server";
import { updateCita, deleteCita } from "@/services/citaService";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID de cita no válido" }, { status: 400 });
    }

    const body = await request.json();
    const result = await updateCita(id, body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error en PUT /api/citas/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar cita" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID de cita no válido" }, { status: 400 });
    }

    const result = await deleteCita(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error en DELETE /api/citas/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar cita" }, { status: 500 });
  }
}