import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import type { TicketPriority, TicketStatus } from "../../../../lib/orbit-data";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ ticketId: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const { ticketId } = await context.params;
  const body = (await request.json()) as {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedToId?: string;
    categoryId?: string;
  };

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: body.status,
      priority: body.priority,
      assignedToId: body.assignedToId,
      categoryId: body.categoryId
    }
  });

  return NextResponse.json({ ok: true });
}
