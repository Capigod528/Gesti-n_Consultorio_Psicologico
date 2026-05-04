import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    const rolValido = role === "ESPECIALISTA" ? "ESPECIALISTA" : "SECRETARIO";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: rolValido,
      },
    });

    // Si es especialista, crear también su perfil en la tabla especialistas
    if (rolValido === "ESPECIALISTA") {
      await prisma.especialista.create({
        data: {
          nombre: name,
          email: email,
          especialidad: "Por definir", // lo puede editar después
          telefono: "",
          userId: user.id, // ← aquí se vinculan las dos tablas
        }
      });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("DEBUG REGISTRO:", error);
    return NextResponse.json({
      error: "Error al crear usuario",
      message: error.message
    }, { status: 500 });
  }
}