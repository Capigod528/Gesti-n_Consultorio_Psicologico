import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { nombre, apellido, email, password, telefono, especialidad, role } = await request.json();

    // Validar datos obligatorios
    if (!nombre || !email || !password) {
      return NextResponse.json({
        message: "Faltan datos obligatorios"
      }, { status: 400 });
    }

    // Validar que el rol sea válido
    const validRoles = ["SPECIALIST", "SECRETARY"];
    const userRole = validRoles.includes(role) ? role : "SPECIALIST";

    // Validar email único
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({
        message: "El email ya está registrado"
      }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${nombre} ${apellido}`;

    // Si es especialista, crear con relación
    if (userRole === "SPECIALIST") {
      const user = await prisma.user.create({
        // Log the user object to inspect especialistaId
        // console.log("Created specialist user:", user);
        data: {
          name: fullName,
          email,
          password: hashedPassword,
          role: "SPECIALIST",
          especialista: {
            create: {
              nombre: fullName,
              email,
              telefono: telefono || "",
              especialidad: especialidad || "General",
            },
          },
        },
        include: {
          especialista: true,
        },
      });
      return NextResponse.json({ message: "Usuario creado exitosamente", user });
    }

    // Para secretaria, crear usuario simple
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        role: "SECRETARY",
      },
    });

    return NextResponse.json({ message: "Usuario creado exitosamente", user });
  } catch (error: any) {
    console.error("DEBUG REGISTRO:", error);

    return NextResponse.json({
      message: error.message || "Error al crear usuario"
    }, { status: 500 });
  }
}