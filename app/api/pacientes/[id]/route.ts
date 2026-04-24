import { NextResponse } from 'next/server';
import { updatePaciente, deletePaciente } from "@/services/pacienteService";

// PUT: Actualizar un paciente existente
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();

    // Usamos el service para mantener la lógica centralizada
    const result = await updatePaciente(id, body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error en PUT /api/pacientes/[id]:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE: Borrado lógico para no romper la integridad de las citas
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    
    // El service ahora pone 'activo: false' en lugar de borrarlo físicamente
    const result = await deletePaciente(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ message: "Paciente desactivado correctamente" });
  } catch (error) {
    console.error("Error en DELETE /api/pacientes/[id]:", error);
    return NextResponse.json({ error: "Error al procesar la baja" }, { status: 500 });
  }
}