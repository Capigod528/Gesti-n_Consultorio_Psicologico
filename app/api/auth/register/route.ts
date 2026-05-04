import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validar que el rol sea válido
    const rolValido = role === "ESPECIALISTA" ? "ESPECIALISTA" : "SECRETARIO";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: rolValido,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("DEBUG REGISTRO:", error);
    return NextResponse.json({ 
      error: "Error al crear usuario",
      message: error.message
    }, { status: 500 });
  }
}