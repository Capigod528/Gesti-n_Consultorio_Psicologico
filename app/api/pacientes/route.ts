import { NextResponse } from "next/server";
import { getAllPacientes, createPaciente } from "@/services/pacienteService";

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