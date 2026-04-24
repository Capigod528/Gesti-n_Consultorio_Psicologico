import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    // ESTO ES CLAVE: Mira tu terminal de VS Code después de intentar registrarte
    console.error("DEBUG REGISTRO:", error); 
    
    return NextResponse.json({ 
      error: "Error al crear usuario",
      message: error.message // Esto enviará el error real al navegador para que lo veas
    }, { status: 500 });
  }
}