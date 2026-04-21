import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; // Importamos la instancia que creaste en lib

// GET: Para ver las tareas en Postman
export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({ error: "Error al obtener tareas" }, { status: 500 });
  }
}

// POST: Para crear una tarea desde Postman
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación básica para que no envíen títulos vacíos
    if (!body.title) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title: body.title,
      },
    });
    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json({ error: "Error al crear la tarea" }, { status: 500 });
  }
}