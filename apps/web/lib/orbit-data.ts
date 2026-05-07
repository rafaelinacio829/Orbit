export type UserRole = "ADMIN" | "SUPERVISOR" | "AGENT" | "REQUESTER";
export type TicketStatus =
  | "ABERTO"
  | "EM_TRIAGEM"
  | "EM_ATENDIMENTO"
  | "AGUARDANDO_CLIENTE"
  | "RESOLVIDO"
  | "FECHADO";
export type TicketPriority = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type TicketMessageView = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  isInternal: boolean;
};

export type TicketView = {
  id: string;
  number: string;
  title: string;
  description: string;
  companyId: string;
  companyName: string;
  requesterId: string;
  requesterName: string;
  assignedToId: string | null;
  assignedToName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessageView[];
};

export type CategoryView = {
  id: string;
  name: string;
};

export type CompanyView = {
  id: string;
  name: string;
  plan: string;
};

export type DashboardPayload = {
  currentUser: CurrentUser;
  tickets: TicketView[];
  categories: CategoryView[];
  companies: CompanyView[];
  teamMembers: CurrentUser[];
};

export const statusOptions: Array<{ value: TicketStatus; label: string }> = [
  { value: "ABERTO", label: "Aberto" },
  { value: "EM_TRIAGEM", label: "Em triagem" },
  { value: "EM_ATENDIMENTO", label: "Em atendimento" },
  { value: "AGUARDANDO_CLIENTE", label: "Aguardando cliente" },
  { value: "RESOLVIDO", label: "Resolvido" },
  { value: "FECHADO", label: "Fechado" }
];

export const priorityOptions: Array<{ value: TicketPriority; label: string }> = [
  { value: "BAIXA", label: "Baixa" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "CRITICA", label: "Critica" }
];

export const statusLabel = (value: TicketStatus) =>
  statusOptions.find((option) => option.value === value)?.label ?? value;

export const priorityLabel = (value: TicketPriority) =>
  priorityOptions.find((option) => option.value === value)?.label ?? value;

export const formatRelativeTicketTime = (isoDate: string) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return `ha ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `ha ${hours}h`;
  }

  const days = Math.floor(hours / 24);
  return `ha ${days}d`;
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
