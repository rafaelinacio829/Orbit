import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ ticketId: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const { ticketId } = await context.params;
  const body = (await request.json()) as {
    message?: string;
    isInternal?: boolean;
  };

  if (!body.message?.trim()) {
    return NextResponse.json({ error: "Mensagem obrigatoria." }, { status: 400 });
  }

  await prisma.ticketMessage.create({
    data: {
      ticketId,
      senderId: user.id,
      message: body.message.trim(),
      isInternal: Boolean(body.isInternal)
    }
  });

  return NextResponse.json({ ok: true });
}
