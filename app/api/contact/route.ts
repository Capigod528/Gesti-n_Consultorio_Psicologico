import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nombre, email, telefono, mensaje } = await req.json();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "PsicoControl <onboarding@resend.dev>", // Cambia esto cuando tengas dominio propio
      to: ["contacto@tuconsultorio.com"],            // ← Pon aquí el correo real del consultorio
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafbff; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #4f46e5; font-size: 24px; font-weight: 900; margin: 0;">🧠 PsicoControl</h1>
            <p style="color: #64748b; margin-top: 8px; font-size: 14px;">Nuevo mensaje de contacto</p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
            <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 20px 0;">Datos del remitente</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Nombre</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${nombre}</td>
              </tr>
              <tr style="border-top: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Correo</td>
                <td style="padding: 10px 0; color: #4f46e5; font-weight: 600;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Teléfono</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${telefono || "No proporcionado"}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px 0;">Mensaje</h2>
            <p style="color: #475569; line-height: 1.7; margin: 0; white-space: pre-wrap;">${mensaje}</p>
          </div>

          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 32px;">
            Este mensaje fue enviado desde el formulario de contacto de PsicoControl © 2026
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
    }

    // También enviar confirmación al remitente
    await resend.emails.send({
      from: "PsicoControl <onboarding@resend.dev>",
      to: [email],
      subject: "Recibimos tu mensaje — PsicoControl",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafbff; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #4f46e5; font-size: 24px; font-weight: 900; margin: 0;">🧠 PsicoControl</h1>
          </div>
          
          <h2 style="color: #0f172a; font-size: 20px; text-align: center;">¡Hola, ${nombre}! 👋</h2>
          <p style="color: #475569; line-height: 1.7; text-align: center; font-size: 16px;">
            Recibimos tu mensaje correctamente. Nuestro equipo te responderá a la brevedad posible.
          </p>

          <div style="background: #4f46e5; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="color: white; font-weight: 700; margin: 0; font-size: 15px;">📞 También puedes llamarnos</p>
            <p style="color: #c7d2fe; margin: 8px 0 0 0; font-size: 14px;">+51 076 123 456 — Lun a Vie, 8am–6pm</p>
          </div>

          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 32px;">
            PsicoControl © 2026 — Gestión Profesional y Confidencial
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}