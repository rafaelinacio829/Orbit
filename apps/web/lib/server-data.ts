import { prisma } from "./prisma";
import type { DashboardPayload, TicketView } from "./orbit-data";

const mapTicket = (ticket: Awaited<ReturnType<typeof fetchTicketsRaw>>[number]): TicketView => ({
  id: ticket.id,
  number: ticket.ticketNumber,
  title: ticket.title,
  description: ticket.description,
  companyId: ticket.companyId,
  companyName: ticket.company.name,
  requesterId: ticket.requesterId,
  requesterName: ticket.requester.name,
  assignedToId: ticket.assignedToId,
  assignedToName: ticket.assignedTo?.name ?? null,
  categoryId: ticket.categoryId,
  categoryName: ticket.category?.name ?? null,
  status: ticket.status,
  priority: ticket.priority,
  createdAt: ticket.createdAt.toISOString(),
  updatedAt: ticket.updatedAt.toISOString(),
  messages: ticket.messages.map((message) => ({
    id: message.id,
    authorName: message.sender.name,
    body: message.message,
    createdAt: message.createdAt.toISOString(),
    isInternal: message.isInternal
  }))
});

const fetchTicketsRaw = async () =>
  prisma.ticket.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      company: true,
      requester: true,
      assignedTo: true,
      category: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: true
        }
      }
    }
  });

export async function getDashboardPayload(userId: string): Promise<DashboardPayload> {
  const [user, tickets, categories, companies, teamMembers] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId }
    }),
    fetchTicketsRaw(),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "SUPERVISOR", "AGENT"]
        }
      },
      orderBy: { name: "asc" }
    })
  ]);

  return {
    currentUser: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    tickets: tickets.map(mapTicket),
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name
    })),
    companies: companies.map((company) => ({
      id: company.id,
      name: company.name,
      plan: company.plan ?? "Plano"
    })),
    teamMembers: teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role
    }))
  };
}
