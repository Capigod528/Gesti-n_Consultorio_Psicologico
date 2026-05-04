import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEspecialistaByUserId } from "@/services/especialistaService";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const especialista = await getEspecialistaByUserId(session.user.id);

  if (!especialista) {
    return NextResponse.json({ error: "Especialista no encontrado" }, { status: 404 });
  }

  return NextResponse.json(especialista);
}