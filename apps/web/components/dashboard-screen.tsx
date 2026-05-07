import Link from "next/link";
import type { CSSProperties } from "react";
import { AppShell } from "./app-shell";
import { CollapsiblePanel } from "./collapsible-panel";
import { TeamCapacityCard } from "./team-capacity-card";
import {
  formatRelativeTicketTime,
  getInitials,
  priorityLabel,
  type DashboardPayload
} from "../lib/orbit-data";

const toneByPriority = {
  BAIXA: "low",
  MEDIA: "medium",
  ALTA: "high",
  CRITICA: "critical"
} as const;

const toneByStatus = {
  ABERTO: "open",
  EM_TRIAGEM: "open",
  EM_ATENDIMENTO: "progress",
  AGUARDANDO_CLIENTE: "waiting",
  RESOLVIDO: "resolved",
  FECHADO: "resolved"
} as const;

type DashboardScreenProps = {
  data: DashboardPayload;
};

export function DashboardScreen({ data }: DashboardScreenProps) {
  const openTickets = data.tickets.filter((ticket) =>
    ["ABERTO", "EM_TRIAGEM", "EM_ATENDIMENTO", "AGUARDANDO_CLIENTE"].includes(ticket.status)
  );
  const inProgressTickets = data.tickets.filter((ticket) => ticket.status === "EM_ATENDIMENTO");
  const riskTickets = data.tickets.filter((ticket) => ticket.priority === "CRITICA");
  const resolvedTickets = data.tickets.filter((ticket) => ticket.status === "RESOLVIDO");

  const categoryCount = data.categories.map((category) => {
    const total = data.tickets.filter((ticket) => ticket.categoryId === category.id).length;
    const width = `${Math.max(10, (total / Math.max(data.tickets.length, 1)) * 100)}%`;
    return { ...category, total, width };
  });

  const agentCount = data.teamMembers.map((member) => {
    const owned = data.tickets.filter((ticket) => ticket.assignedToId === member.id).length;
    const resolved = data.tickets.filter(
      (ticket) => ticket.assignedToId === member.id && ticket.status === "RESOLVIDO"
    ).length;
    const rate = owned ? `${Math.round((resolved / owned) * 100)}%` : "0%";
    const width = owned ? `${Math.max(8, Math.round((resolved / owned) * 100))}%` : "8%";
    const tone: "blue" | "purple" | "teal" =
      member.role === "ADMIN" ? "blue" : member.role === "SUPERVISOR" ? "purple" : "teal";

    return { label: member.name.split(" ")[0], rate, width, tone };
  });

  const highlightedTickets = data.tickets.slice(0, 4);
  const topCategory = [...categoryCount].sort((first, second) => second.total - first.total)[0];

  return (
    <AppShell
      currentUser={data.currentUser}
      title=""
      subtitle="Visao geral"
      tickets={data.tickets}
      actions={
        <>
          <Link className="ghost-button" href="/tickets">
            Ver fila
          </Link>
          <Link className="primary-button" href="/tickets">
            + Novo chamado
          </Link>
        </>
      }
    >
      <div className="metrics-grid orbit-kpis">
        <article className="metric-card blue orbit-kpi-card">
          <div className="metric-topline">
            <span className="metric-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 3.8h6.3L19 8.5v9.7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
                <path d="M14 4v4.8h4.8M9 12h6M9 15.5h4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
              </svg>
            </span>
            <span>Abertos</span>
          </div>
          <div className="metric-body">
            <div className="metric-orbit">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="metric-ring-base" cx="60" cy="60" r="48" />
                <circle className="metric-ring-value" cx="60" cy="60" r="48" style={{ strokeDashoffset: 302 - Math.min(100, openTickets.length * 22) * 3.02 }} />
              </svg>
            </div>
            <div className="metric-value-block">
              <strong>{openTickets.length}</strong>
              <small className="metric-chip metric-chip-up">+8 hoje</small>
            </div>
          </div>
        </article>
        <article className="metric-card purple orbit-kpi-card">
          <div className="metric-topline">
            <span className="metric-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12a7 7 0 0 1 14 0v3.2a3.2 3.2 0 0 1-3.2 3.2H13" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                <path d="M4.5 12.4h3v4.8h-3a1 1 0 0 1-1-1v-2.8a1 1 0 0 1 1-1ZM19.5 12.4h-3v4.8h3a1 1 0 0 0 1-1v-2.8a1 1 0 0 0-1-1ZM12.5 18.4a1.4 1.4 0 0 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
              </svg>
            </span>
            <span>Em atendimento</span>
          </div>
          <div className="metric-body">
            <div className="metric-orbit">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="metric-ring-base" cx="60" cy="60" r="48" />
                <circle className="metric-ring-value" cx="60" cy="60" r="48" style={{ strokeDashoffset: 302 - Math.min(100, inProgressTickets.length * 28) * 3.02 }} />
              </svg>
            </div>
            <div className="metric-value-block">
              <strong>{inProgressTickets.length}</strong>
              <small className="metric-chip">+3 equipe</small>
            </div>
          </div>
        </article>
        <article className="metric-card amber orbit-kpi-card">
          <div className="metric-topline">
            <span className="metric-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 6.2v6.1l3.7 2.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                <path d="M20 12a8 8 0 1 1-2.35-5.65" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                <path d="M17.6 4.8h2.7v2.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </span>
            <span>SLA em risco</span>
          </div>
          <div className="metric-body">
            <div className="metric-orbit">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="metric-ring-base" cx="60" cy="60" r="48" />
                <circle className="metric-ring-value" cx="60" cy="60" r="48" style={{ strokeDashoffset: 302 - Math.min(100, riskTickets.length * 42) * 3.02 }} />
              </svg>
            </div>
            <div className="metric-value-block">
              <strong>{riskTickets.length}</strong>
              <small className="metric-chip metric-chip-warn">atencao</small>
            </div>
          </div>
        </article>
        <article className="metric-card green orbit-kpi-card">
          <div className="metric-topline">
            <span className="metric-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 7 10.2 16.8 5 11.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M4.8 5.4A9 9 0 1 1 3 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
              </svg>
            </span>
            <span>Resolvidos</span>
          </div>
          <div className="metric-body">
            <div className="metric-orbit">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="metric-ring-base" cx="60" cy="60" r="48" />
                <circle className="metric-ring-value" cx="60" cy="60" r="48" style={{ strokeDashoffset: 302 - Math.min(100, resolvedTickets.length * 36) * 3.02 }} />
              </svg>
            </div>
            <div className="metric-value-block">
              <strong>{resolvedTickets.length}</strong>
              <small className="metric-chip metric-chip-up">+94%</small>
            </div>
          </div>
        </article>
      </div>

      <div className="ai-strip orbit-ai-panel">
        <div className="ai-badge">ORBIT AI</div>
        <p>
          <strong>Leitura da fila:</strong> {riskTickets.length} chamado(s) critico(s) e maior
          volume atual em <strong>{topCategory?.name ?? "Acesso"}</strong>. A melhor acao agora e
          atacar autenticacao e integrações antes do restante da fila.
        </p>
        <div className="ai-actions">
          <button className="ghost-button" type="button">
            Revisar prioridades
          </button>
          <button className="ghost-button" type="button">
            Gerar resumo
          </button>
        </div>
      </div>

      <div className="dashboard-split-grid">
        <CollapsiblePanel kicker="Fila ao vivo" title="Chamados mais recentes" className="queue-collapsible-card">
          <div className="queue-head">
            <span />
            <span>Titulo</span>
            <span>Status</span>
            <span>SLA</span>
            <span>Idade</span>
            <span>Owner</span>
          </div>

          <div className="ticket-list orbit-queue-list">
            {highlightedTickets.map((ticket, index) => (
              <article
                key={ticket.id}
                className={`ticket-row orbit-queue-row ${index === 0 ? "selected" : ""}`}
                style={{ "--delay": `${index * 90}ms` } as CSSProperties}
              >
                <span className={`priority-dot ${toneByPriority[ticket.priority]}`} />
                <div className="queue-title">
                  <h4>{ticket.title}</h4>
                  <p className="queue-meta">
                    {ticket.number} • {ticket.companyName} • {priorityLabel(ticket.priority)}
                  </p>
                </div>
                <span className={`status-pill ${toneByStatus[ticket.status]}`}>
                  {ticket.status.replaceAll("_", " ")}
                </span>
                <div className="sla-cell">
                  <div className="sla-bar">
                    <i className={riskTickets.length > 0 && ticket.priority === "CRITICA" ? "bad" : "ok"} style={{ width: ticket.priority === "CRITICA" ? "88%" : "54%" }} />
                  </div>
                  <span className="ticket-time">{ticket.priority === "CRITICA" ? "risco alto" : "estavel"}</span>
                </div>
                <span className="ticket-time queue-age">{formatRelativeTicketTime(ticket.updatedAt)}</span>
                <span className="avatar-sm">
                  {getInitials(ticket.assignedToName ?? ticket.requesterName)}
                </span>
              </article>
            ))}
          </div>
        </CollapsiblePanel>

        <div className="dashboard-side-stack">
          <TeamCapacityCard agents={agentCount} />

          <CollapsiblePanel kicker="Categorias" title="Distribuicao da fila">
            <div className="category-list">
              {categoryCount.map((item, index) => (
                <div key={item.id} className="category-row" style={{ "--delay": `${index * 90}ms` } as CSSProperties}>
                  <span>{item.name}</span>
                  <div className="category-bar">
                    <i style={{ width: item.width }} />
                  </div>
                  <strong>{item.total}</strong>
                </div>
              ))}
            </div>
          </CollapsiblePanel>
        </div>
      </div>
    </AppShell>
  );
}
