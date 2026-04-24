import { NextResponse } from "next/server";
import { getAllPacientes, createPaciente, updatePaciente, deletePaciente } from "@/services/pacienteService";

export async function GET() {
  try {
    const pacientes = await getAllPacientes();
    return NextResponse.json(pacientes);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener pacientes" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoPaciente = await createPaciente(body);
    return NextResponse.json(nuevoPaciente, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear paciente" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID de paciente no proporcionado" }, { status: 400 });
    }
    const pacienteActualizado = await updatePaciente(id, data);
    return NextResponse.json(pacienteActualizado);
  } catch (error) {
    console.error("Error en PUT /api/pacientes:", error);
    return NextResponse.json(
      { error: "Error al actualizar paciente" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID de paciente no proporcionado" }, { status: 400 });
    }
    await deletePaciente(id);
    return NextResponse.json({ message: "Paciente eliminado" });
  } catch (error) {
    console.error("Error en DELETE /api/pacientes:", error);
    return NextResponse.json(
      { error: "Error al eliminar paciente" }, 
      { status: 500 }
    );
  }
}
