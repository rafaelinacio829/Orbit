import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import type { TicketPriority } from "../../../lib/orbit-data";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    companyId?: string;
    categoryId?: string;
    priority?: TicketPriority;
  };

  if (!body.title || !body.description || !body.companyId || !body.categoryId || !body.priority) {
    return NextResponse.json({ error: "Campos obrigatorios ausentes." }, { status: 400 });
  }

  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { createdAt: "desc" }
  });

  const lastNumber = lastTicket ? Number(lastTicket.ticketNumber.replace("#", "")) : 2480;
  const ticketNumber = `#${lastNumber + 1}`;

  const created = await prisma.ticket.create({
    data: {
      ticketNumber,
      title: body.title,
      description: body.description,
      companyId: body.companyId,
      requesterId: user.id,
      assignedToId: user.id,
      categoryId: body.categoryId,
      priority: body.priority,
      status: "ABERTO",
      messages: {
        create: {
          senderId: user.id,
          message: body.description,
          isInternal: false
        }
      }
    }
  });

  return NextResponse.json({ ok: true, ticketId: created.id });
}
