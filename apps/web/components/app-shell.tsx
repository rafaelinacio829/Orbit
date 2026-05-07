"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getInitials, type CurrentUser, type TicketView } from "../lib/orbit-data";

type AppShellProps = {
  currentUser: CurrentUser;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  tickets?: TicketView[];
  actions?: React.ReactNode;
};

export function AppShell({
  currentUser,
  title,
  subtitle,
  children,
  tickets = [],
  actions
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const openTickets = tickets.filter((ticket) => ticket.status !== "FECHADO").length;
  const riskTickets = tickets.filter(
    (ticket) => ticket.priority === "CRITICA" || ticket.status === "EM_TRIAGEM"
  ).length;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST"
    });

    router.push("/login");
    router.refresh();
  };

  return (
    <main className="dashboard-app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">O</div>
          <div>
            <p className="brand-kicker">Orbit Platform</p>
            <h1>Orbit Desk</h1>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="searchbox">Dados servidos pelo banco com Prisma</div>
          <button className="icon-button" type="button" aria-label="Notificacoes">
            <span className="dot" />
            {riskTickets}
          </button>
          <button className="user-pill" type="button" onClick={() => router.push("/dashboard")}>
            {getInitials(currentUser.name)}
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-section">
            <p className="sidebar-label">Principal</p>
            <Link className={`nav-item ${pathname === "/" || pathname === "/dashboard" ? "active" : ""}`} href="/dashboard">
              Dashboard
            </Link>
            <Link
              className={`nav-item ${pathname === "/tickets" ? "active" : ""}`}
              href="/tickets"
            >
              Chamados
              <span className="nav-badge">{openTickets}</span>
            </Link>
            <div className="nav-item">Clientes</div>
            <div className="nav-item">Empresas</div>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">Inteligencia</p>
            <div className="nav-item">Orbit AI</div>
            <div className="nav-item">Base de conhecimento</div>
            <div className="nav-item">Automações</div>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">Gestao</p>
            <div className="nav-item">
              SLA
              <span className="nav-badge danger">{riskTickets}</span>
            </div>
            <div className="nav-item">Relatorios</div>
            <button className="nav-item nav-button" type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>

          <div className="sidebar-footer">
            <p>Logado como</p>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.email}</small>
          </div>
        </aside>

        <section className="dashboard-content">
          <div className="content-head">
            <div>
              <p className="section-kicker">{subtitle}</p>
              <h2>{title}</h2>
            </div>

            {actions ? <div className="content-actions">{actions}</div> : null}
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
