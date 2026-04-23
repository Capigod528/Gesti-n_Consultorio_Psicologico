import { NextResponse } from "next/server";
import { getDashboardStats } from "@/services/statsService";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error en GET /api/stats:", error);
    return NextResponse.json(
      { error: "Error al cargar estadísticas" }, 
      { status: 500 }
    );
  }
}