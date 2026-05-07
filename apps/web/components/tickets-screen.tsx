"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "./app-shell";
import {
  formatRelativeTicketTime,
  getInitials,
  priorityLabel,
  priorityOptions,
  statusLabel,
  statusOptions,
  type DashboardPayload,
  type TicketPriority,
  type TicketStatus
} from "../lib/orbit-data";

const priorityTone = {
  BAIXA: "low",
  MEDIA: "medium",
  ALTA: "high",
  CRITICA: "critical"
} as const;

type TicketFormState = {
  title: string;
  description: string;
  companyId: string;
  categoryId: string;
  priority: TicketPriority;
};

type TicketsScreenProps = {
  data: DashboardPayload;
};

export function TicketsScreen({ data }: TicketsScreenProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"TODOS" | TicketStatus>("TODOS");
  const [priority, setPriority] = useState<"TODAS" | TicketPriority>("TODAS");
  const [selectedId, setSelectedId] = useState(data.tickets[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [internal, setInternal] = useState(false);
  const [form, setForm] = useState<TicketFormState>({
    title: "",
    description: "",
    companyId: data.companies[0]?.id ?? "",
    categoryId: data.categories[0]?.id ?? "",
    priority: "MEDIA"
  });

  const filteredTickets = useMemo(
    () =>
      data.tickets.filter((ticket) => {
        const matchesSearch =
          ticket.title.toLowerCase().includes(search.toLowerCase()) ||
          ticket.number.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "TODOS" || ticket.status === status;
        const matchesPriority = priority === "TODAS" || ticket.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
      }),
    [data.tickets, priority, search, status]
  );

  const selectedTicket =
    filteredTickets.find((ticket) => ticket.id === selectedId) ?? filteredTickets[0] ?? null;

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleCreateTicket = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      return;
    }

    await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({
      title: "",
      description: "",
      companyId: data.companies[0]?.id ?? "",
      categoryId: data.categories[0]?.id ?? "",
      priority: "MEDIA"
    });

    refresh();
  };

  const handlePatchTicket = async (
    ticketId: string,
    patch: Partial<{
      status: TicketStatus;
      priority: TicketPriority;
      assignedToId: string;
      categoryId: string;
    }>
  ) => {
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patch)
    });

    refresh();
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !message.trim()) {
      return;
    }

    await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        isInternal: internal
      })
    });

    setMessage("");
    setInternal(false);
    refresh();
  };

  return (
    <AppShell
      currentUser={data.currentUser}
      title="Operacao de chamados"
      subtitle="Fila de atendimento"
      tickets={data.tickets}
      actions={
        <div className="toolbar-search">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por numero ou titulo"
          />
        </div>
      }
    >
      <div className="tickets-layout">
        <section className="panel ticket-create-panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Novo chamado</p>
              <h3>Abrir atendimento</h3>
            </div>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Titulo</span>
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ex.: Cliente nao acessa o sistema"
              />
            </label>

            <label className="field">
              <span>Empresa</span>
              <select
                value={form.companyId}
                onChange={(event) => setForm({ ...form, companyId: event.target.value })}
              >
                {data.companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Categoria</span>
              <select
                value={form.categoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              >
                {data.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Prioridade</span>
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value as TicketPriority })
                }
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field-span-2">
              <span>Descricao</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Descreva o problema ou solicitacao do cliente"
              />
            </label>
          </div>

          <button className="primary-button" disabled={isPending} type="button" onClick={handleCreateTicket}>
            {isPending ? "Salvando..." : "Criar chamado"}
          </button>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Fila</p>
              <h3>Chamados ativos</h3>
            </div>
          </div>

          <div className="filters-row">
            <label className="field compact">
              <span>Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as TicketStatus | "TODOS")}>
                <option value="TODOS">Todos</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field compact">
              <span>Prioridade</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as TicketPriority | "TODAS")}
              >
                <option value="TODAS">Todas</option>
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="ticket-list">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                className={`ticket-row ticket-row-button ${
                  selectedTicket?.id === ticket.id ? "selected" : ""
                }`}
                type="button"
                onClick={() => setSelectedId(ticket.id)}
              >
                <span className={`priority-dot ${priorityTone[ticket.priority]}`} />
                <div>
                  <h4>{ticket.title}</h4>
                  <p>
                    {ticket.number} • {ticket.companyName} • {priorityLabel(ticket.priority)}
                  </p>
                </div>
                <span className="status-pill open">{statusLabel(ticket.status)}</span>
                <span className="ticket-time">{formatRelativeTicketTime(ticket.updatedAt)}</span>
                <span className="avatar-sm">
                  {getInitials(ticket.assignedToName ?? ticket.requesterName)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel panel-wide">
          {selectedTicket ? (
            <>
              <div className="panel-header">
                <div>
                  <p className="section-kicker">Detalhe</p>
                  <h3>
                    {selectedTicket.number} • {selectedTicket.title}
                  </h3>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-summary">
                  <p>{selectedTicket.description}</p>

                  <div className="detail-form-grid">
                    <label className="field compact">
                      <span>Status</span>
                      <select
                        value={selectedTicket.status}
                        onChange={(event) =>
                          handlePatchTicket(selectedTicket.id, {
                            status: event.target.value as TicketStatus
                          })
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field compact">
                      <span>Prioridade</span>
                      <select
                        value={selectedTicket.priority}
                        onChange={(event) =>
                          handlePatchTicket(selectedTicket.id, {
                            priority: event.target.value as TicketPriority
                          })
                        }
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field compact">
                      <span>Responsavel</span>
                      <select
                        value={selectedTicket.assignedToId ?? ""}
                        onChange={(event) =>
                          handlePatchTicket(selectedTicket.id, {
                            assignedToId: event.target.value
                          })
                        }
                      >
                        {data.teamMembers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field compact">
                      <span>Categoria</span>
                      <select
                        value={selectedTicket.categoryId ?? ""}
                        onChange={(event) =>
                          handlePatchTicket(selectedTicket.id, {
                            categoryId: event.target.value
                          })
                        }
                      >
                        {data.categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="conversation-card">
                  <div className="conversation-list">
                    {selectedTicket.messages.map((item) => (
                      <article key={item.id} className={`message-card ${item.isInternal ? "internal" : ""}`}>
                        <div className="message-meta">
                          <strong>{item.authorName}</strong>
                          <span>{formatRelativeTicketTime(item.createdAt)}</span>
                        </div>
                        <p>{item.body}</p>
                      </article>
                    ))}
                  </div>

                  <div className="message-composer">
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder={`Responder como ${data.currentUser.name}`}
                    />

                    <div className="login-row">
                      <label className="checkbox">
                        <input
                          checked={internal}
                          onChange={(event) => setInternal(event.target.checked)}
                          type="checkbox"
                        />
                        <span>Comentario interno</span>
                      </label>

                      <button className="primary-button" disabled={isPending} type="button" onClick={handleSendMessage}>
                        {isPending ? "Enviando..." : "Enviar mensagem"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">Nenhum chamado encontrado para os filtros atuais.</div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
