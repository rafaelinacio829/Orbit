"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getInitials, type CurrentUser, type TicketView } from "../lib/orbit-data";

type AppShellProps = {
  currentUser: CurrentUser;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  tickets?: TicketView[];
  actions?: React.ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  active: boolean;
  badge: number | null;
  disabled?: boolean;
  icon: React.ReactNode;
};

type UtilityItem = {
  label: string;
  badge?: number | null;
  icon: React.ReactNode;
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const openTickets = tickets.filter((ticket) => ticket.status !== "FECHADO").length;
  const riskTickets = tickets.filter(
    (ticket) => ticket.priority === "CRITICA" || ticket.status === "EM_TRIAGEM"
  ).length;

  useEffect(() => {
    const savedValue = window.localStorage.getItem("orbit-sidebar-collapsed");
    setSidebarCollapsed(savedValue === "true");
  }, []);

  const toggleSidebar = () => {
    const nextValue = !sidebarCollapsed;
    setSidebarCollapsed(nextValue);
    window.localStorage.setItem("orbit-sidebar-collapsed", String(nextValue));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST"
    });

    router.push("/login");
    router.refresh();
  };

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/" || pathname === "/dashboard",
      badge: null,
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 3h6v6H3zM11 3h6v4h-6zM11 9h6v8h-6zM3 11h6v6H3z" fill="currentColor" />
        </svg>
      )
    },
    {
      href: "/tickets",
      label: "Chamados",
      active: pathname === "/tickets",
      badge: openTickets,
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 5h12v2H4zm0 4h12v2H4zm0 4h8v2H4z" fill="currentColor" />
        </svg>
      )
    },
    {
      href: "#",
      label: "Clientes",
      active: false,
      badge: null,
      disabled: true,
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 10a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-6 7a6 6 0 0 1 12 0Z" fill="currentColor" />
        </svg>
      )
    },
    {
      href: "#",
      label: "Empresas",
      active: false,
      badge: null,
      disabled: true,
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 4h8v12H4zm10 4h2v8h-2zM6 6h2v2H6zm0 4h2v2H6zm0 4h2v2H6z" fill="currentColor" />
        </svg>
      )
    }
  ];

  const intelligenceItems: UtilityItem[] = [
    {
      label: "Orbit AI",
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 3a7 7 0 1 0 7 7 7 7 0 0 0-7-7Zm-2 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-4 3h4a2.5 2.5 0 0 1-4 0Z" fill="currentColor" />
        </svg>
      )
    },
    {
      label: "Base de conhecimento",
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 4h10a2 2 0 0 1 2 2v10H6a2 2 0 0 0-2 2Zm2 12h8V6H6a1 1 0 0 0-1 1v10a1 1 0 0 1 1-1Z" fill="currentColor" />
        </svg>
      )
    },
    {
      label: "Automações",
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2 4 7l6 5 6-5Zm-6 9 6 5 6-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  const managementItems: UtilityItem[] = [
    {
      label: "SLA",
      badge: riskTickets,
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 3a7 7 0 1 0 7 7 7 7 0 0 0-7-7Zm1 4H9v4l3 2 1-1.6-2-1.2Z" fill="currentColor" />
        </svg>
      )
    },
    {
      label: "Relatorios",
      icon: (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 15h2V8H4Zm5 0h2V5H9Zm5 0h2V10h-2Z" fill="currentColor" />
        </svg>
      )
    }
  ];

  return (
    <main className="dashboard-app">
      <div className={`workspace ${sidebarCollapsed ? "workspace-collapsed" : ""}`}>
        <aside className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <div className="brand-icon sidebar-brand-icon">O</div>
              <div className="sidebar-brand-copy">
                <p className="brand-kicker">Orbit Platform</p>
                <strong>Orbit Desk</strong>
              </div>
            </div>

            <button
              className="sidebar-toggle"
              type="button"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
              title={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {sidebarCollapsed ? (
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M13 4 7 10l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">Principal</p>
            {navItems.map((item) =>
              item.disabled ? (
                <div className="nav-item" key={item.label} title={item.label}>
                  <span className="nav-item-main">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </span>
                  {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                </div>
              ) : (
                <Link className={`nav-item ${item.active ? "active" : ""}`} href={item.href} key={item.label} title={item.label}>
                  <span className="nav-item-main">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </span>
                  {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                </Link>
              )
            )}
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">Inteligencia</p>
            {intelligenceItems.map((item) => (
              <div className="nav-item" key={item.label} title={item.label}>
                <span className="nav-item-main">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">Gestao</p>
            {managementItems.map((item) => (
              <div className="nav-item" key={item.label} title={item.label}>
                <span className="nav-item-main">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </span>
                {item.badge ? <span className="nav-badge danger">{item.badge}</span> : null}
              </div>
            ))}
            <Link
              className={`nav-item ${pathname === "/settings" ? "active" : ""}`}
              href="/settings"
              title="Configuracoes"
            >
              <span className="nav-item-main">
                <span className="nav-icon">
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 3.2 11.4 4a6.8 6.8 0 0 1 1.6-.7l.4-1.6h2.2l.4 1.6a6.8 6.8 0 0 1 1.6.7l1.4-.8 1.1 1.9-1.3 1a7 7 0 0 1 0 1.9l1.3 1-1.1 1.9-1.4-.8a6.8 6.8 0 0 1-1.6.7l-.4 1.6h-2.2l-.4-1.6a6.8 6.8 0 0 1-1.6-.7l-1.4.8-1.1-1.9 1.3-1a7 7 0 0 1 0-1.9l-1.3-1L8.9 3.2Zm1 4.8A2 2 0 1 0 13 10a2 2 0 0 0-2-2Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="nav-label">Configuracoes</span>
              </span>
            </Link>
            <button className="nav-item nav-button" type="button" onClick={handleLogout} title="Sair">
              <span className="nav-item-main">
                <span className="nav-icon">
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M8 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M12 6l4 4-4 4M16 10H8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="nav-label">Sair</span>
              </span>
            </button>
          </div>

          <div className="sidebar-footer" data-initials={getInitials(currentUser.name)}>
            <p>Logado como</p>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.email}</small>
          </div>
        </aside>

        <section className="main-column">
          <header className="topbar">
            <div className="crumbs">
              <span>Orbit Platform</span>
              <span className="crumb-sep">/</span>
              <strong>{title}</strong>
              <span className="crumb-live">
                <i />
                online
              </span>
            </div>

            <div className="topbar-spacer" />

            <div className="topbar-actions">
              <div className="searchbox shell-search">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.2 10.2 2.8 2.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <span>Buscar chamados, clientes ou comandos</span>
                <span className="search-kbd">/</span>
              </div>
          <button className="icon-button" type="button" aria-label="Notificacoes">
            <span className="dot" />
            {riskTickets}
          </button>
              <button className="me-pill" type="button" onClick={() => router.push("/dashboard")}>
                <span className="me-pill-avatar">{getInitials(currentUser.name)}</span>
                <span className="me-pill-name">{currentUser.name}</span>
              </button>
            </div>
          </header>

          <section className="dashboard-content">
            <div className="content-head">
              <div className="hero-copy">
                <p className="content-eyebrow">
                  {subtitle}
                  <span className="content-tag">Orbit Desk</span>
                </p>
                <h2>{title}</h2>
              </div>

              {actions ? <div className="content-actions">{actions}</div> : null}
            </div>

            {children}
          </section>
        </section>
      </div>
    </main>
  );
}
