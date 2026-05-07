import Link from "next/link";
import { AppShell } from "./app-shell";
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
    const tone = member.role === "ADMIN" ? "blue" : member.role === "SUPERVISOR" ? "purple" : "teal";

    return { label: member.name.split(" ")[0], rate, width, tone };
  });

  const highlightedTickets = data.tickets.slice(0, 4);
  const topCategory = [...categoryCount].sort((first, second) => second.total - first.total)[0];

  return (
    <AppShell
      currentUser={data.currentUser}
      title="Central operacional de suporte"
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
      <div className="metrics-grid">
        <article className="metric-card blue">
          <span>Abertos</span>
          <strong>{openTickets.length}</strong>
          <small>Fila ativa na operacao</small>
        </article>
        <article className="metric-card purple">
          <span>Em atendimento</span>
          <strong>{inProgressTickets.length}</strong>
          <small>Chamados sendo tratados agora</small>
        </article>
        <article className="metric-card amber">
          <span>SLA em risco</span>
          <strong>{riskTickets.length}</strong>
          <small>Criticos ou urgentes</small>
        </article>
        <article className="metric-card green">
          <span>Resolvidos</span>
          <strong>{resolvedTickets.length}</strong>
          <small>Ja concluídos no banco</small>
        </article>
      </div>

      <div className="ai-strip">
        <div className="ai-badge">ORBIT AI</div>
        <p>
          <strong>Leitura da fila:</strong> {riskTickets.length} chamado(s) critico(s) e maior
          volume atual em <strong>{topCategory?.name ?? "Acesso"}</strong>. A melhor acao agora e
          atacar autenticacao e integrações antes do restante da fila.
        </p>
      </div>

      <div className="dashboard-grid">
        <section className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Fila ao vivo</p>
              <h3>Chamados mais recentes</h3>
            </div>
            <Link className="ghost-button" href="/tickets">
              Abrir modulo
            </Link>
          </div>

          <div className="ticket-list">
            {highlightedTickets.map((ticket, index) => (
              <article key={ticket.id} className={`ticket-row ${index === 0 ? "selected" : ""}`}>
                <span className={`priority-dot ${toneByPriority[ticket.priority]}`} />
                <div>
                  <h4>{ticket.title}</h4>
                  <p>
                    {ticket.number} • {ticket.companyName} • {priorityLabel(ticket.priority)}
                  </p>
                </div>
                <span className={`status-pill ${toneByStatus[ticket.status]}`}>
                  {ticket.status.replaceAll("_", " ")}
                </span>
                <span className="ticket-time">{formatRelativeTicketTime(ticket.updatedAt)}</span>
                <span className="avatar-sm">
                  {getInitials(ticket.assignedToName ?? ticket.requesterName)}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Categorias</p>
              <h3>Volume por tema</h3>
            </div>
          </div>

          <div className="bars">
            {categoryCount.map((item) => (
              <div key={item.id} className="bar-row">
                <span>{item.name}</span>
                <div className="bar-track">
                  <div className="bar-fill blue" style={{ width: item.width }} />
                </div>
                <strong>{item.total}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Atendentes</p>
              <h3>Resolucao por responsavel</h3>
            </div>
          </div>

          <div className="bars">
            {agentCount.map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-track">
                  <div className={`bar-fill ${item.tone}`} style={{ width: item.width }} />
                </div>
                <strong>{item.rate}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Resumo operacional</p>
              <h3>O que agora depende do banco</h3>
            </div>
          </div>

          <div className="action-grid">
            <article className="action-card">
              <span>01</span>
              <h4>Login por sessao</h4>
              <p>Autenticacao salva em cookie e sessao registrada no banco.</p>
            </article>
            <article className="action-card">
              <span>02</span>
              <h4>Chamados persistidos</h4>
              <p>Crie, atualize e converse em tickets gravados em banco SQLite via Prisma.</p>
            </article>
            <article className="action-card">
              <span>03</span>
              <h4>Dashboard de verdade</h4>
              <p>Indicadores e fila puxados do servidor a cada refresh da aplicacao.</p>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
