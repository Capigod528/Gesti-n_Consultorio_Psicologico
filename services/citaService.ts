import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function parseFechaHora(fecha?: string, hora?: string) {
  if (!fecha) return undefined;
  if (hora) {
    const fechaHora = new Date(`${fecha}T${hora}`);
    return Number.isNaN(fechaHora.getTime()) ? undefined : fechaHora;
  }
  const fechaSolo = new Date(fecha);
  return Number.isNaN(fechaSolo.getTime()) ? undefined : fechaSolo;
}

// --- OBTENER CITAS ---
export async function getCitas(filter?: { especialistaId?: number }) {
  try {
    const citas = await prisma.cita.findMany({
      where: filter?.especialistaId ? { especialistaId: filter.especialistaId } : undefined,
      include: {
        paciente: true,
        especialista: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });
    return { data: citas };
  } catch (error) {
    console.error("Error en getCitas service:", error);
    return { error: "No se pudieron obtener las citas", status: 500 };
  }
}

// --- CREAR CITA ---
export async function createCita(data: any) {
  const { fecha, hora, motivo, pacienteId, especialistaId, estado } = data;

  if (!fecha || !hora || !pacienteId || !especialistaId) {
    return { error: "Faltan datos obligatorios para crear la cita", status: 400 };
  }

  const fechaHora = parseFechaHora(fecha, hora);
  if (!fechaHora) {
    return { error: "Fecha u hora inválida", status: 400 };
  }

  const conflicto = await prisma.cita.findFirst({
    where: {
      fecha: fechaHora,
      especialistaId: Number(especialistaId),
    },
  });

  if (conflicto) return { error: "Conflicto de horario", status: 409 };

  const [paciente, especialista] = await Promise.all([
    prisma.paciente.findUnique({ where: { id: Number(pacienteId) } }),
    prisma.especialista.findUnique({ where: { id: Number(especialistaId) } }),
  ]);

  const nuevaCita = await prisma.cita.create({
    data: {
      fecha: fechaHora,
      motivo: motivo ?? "",
      pacienteId: Number(pacienteId),
      especialistaId: Number(especialistaId),
      estado: typeof estado === "string" ? estado.toUpperCase() : "PENDIENTE",
    },
  });

  if (paciente?.email) {
    const fechaFormateada = fechaHora.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const horaFormateada = fechaHora.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      await resend.emails.send({
        from: "PsicoControl <onboarding@resend.dev>",
        to: [paciente.email],
        subject: "✅ Tu cita ha sido programada — PsicoControl",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafbff; border-radius: 16px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #4f46e5; font-size: 24px; font-weight: 900; margin: 0;">🧠 PsicoControl</h1>
              <p style="color: #64748b; margin-top: 8px; font-size: 14px;">Confirmación de cita</p>
            </div>
            <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 8px 0;">Hola, ${paciente.nombre} 👋</h2>
            <p style="color: #475569; line-height: 1.7; margin: 0 0 24px 0;">
              Tu cita ha sido programada exitosamente. Aquí tienes los detalles:
            </p>
            <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 140px;">📅 Fecha</td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${fechaFormateada}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">🕐 Hora</td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${horaFormateada}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">👨‍⚕️ Especialista</td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${especialista?.nombre ?? "Por asignar"}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">🏥 Especialidad</td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${especialista?.especialidad ?? "—"}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">📋 Motivo</td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${motivo ?? "No especificado"}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">📌 Estado</td>
                  <td style="padding: 10px 0;">
                    <span style="background: #eef2ff; color: #4f46e5; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Pendiente</span>
                  </td>
                </tr>
              </table>
            </div>
            <div style="background: #4f46e5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <p style="color: white; font-weight: 700; margin: 0; font-size: 15px;">📞 ¿Necesitas cambiar tu cita?</p>
              <p style="color: #c7d2fe; margin: 6px 0 0 0; font-size: 14px;">Llámanos: +51 076 123 456 — Lun a Vie, 8am–6pm</p>
            </div>
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin: 0;">
              PsicoControl © 2026 — Gestión Profesional y Confidencial
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error enviando email de confirmación:", emailError);
    }
  }

  return { data: nuevaCita, status: 201 };
}

// --- ACTUALIZAR CITA ---
export async function updateCita(id: number, data: any) {
  try {
    const { 
      fecha, 
      hora, 
      motivo, 
      pacienteId, 
      especialistaId, 
      estado,
      diagnostico,
      medicinas,
      sintomas,
      tratamiento,
      notas 
    } = data;

    const fechaHora = parseFechaHora(fecha, hora);

    if (fechaHora || especialistaId) {
      const conflicto = await prisma.cita.findFirst({
        where: {
          fecha: fechaHora,
          especialistaId: especialistaId ? Number(especialistaId) : undefined,
          NOT: { id },
        },
      });
      if (conflicto) return { error: "Conflicto de horario al actualizar", status: 409 };
    }

    const citaActualizada = await prisma.cita.update({
      where: { id },
      data: {
        motivo: motivo ?? undefined,
        fecha: fechaHora ?? undefined,
        pacienteId: pacienteId != null ? Number(pacienteId) : undefined,
        especialistaId: especialistaId != null ? Number(especialistaId) : undefined,
        estado: typeof estado === "string" ? estado.toUpperCase() : undefined,
        // Nuevos campos habilitados para persistencia
        diagnostico: diagnostico !== undefined ? diagnostico : undefined,
        medicinas: medicinas !== undefined ? medicinas : undefined,
        sintomas: sintomas !== undefined ? sintomas : undefined,
        tratamiento: tratamiento !== undefined ? tratamiento : undefined,
        notas: notas !== undefined ? notas : undefined,
      },
    });
    return { data: citaActualizada, status: 200 };
  } catch (error) {
    console.error("Error en updateCita service:", error);
    return { error: "No se pudo actualizar la cita", status: 500 };
  }
}

// --- ELIMINAR CITA ---
export async function deleteCita(id: number) {
  try {
    await prisma.cita.delete({
      where: { id },
    });
    return { data: { message: "Cita eliminada" }, status: 200 };
  } catch (error) {
    console.error("Error en deleteCita service:", error);
    return { error: "No se pudo eliminar la cita", status: 500 };
  }
}