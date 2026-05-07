"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "./app-shell";
import type { SettingsPayload, UserRole } from "../lib/orbit-data";

type SettingsScreenProps = {
  data: SettingsPayload;
};

export function SettingsScreen({ data }: SettingsScreenProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profileName, setProfileName] = useState(data.currentUser.name);
  const [companyName, setCompanyName] = useState(data.company.name);
  const [companyPlan, setCompanyPlan] = useState(data.company.plan);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<UserRole>("AGENT");
  const [message, setMessage] = useState("");

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleRequest = async (url: string, method: string, body: object, successMessage: string) => {
    setMessage("");
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error ?? "Nao foi possivel salvar.");
      return false;
    }

    setMessage(successMessage);
    refresh();
    return true;
  };

  const saveProfile = async () => {
    await handleRequest(
      "/api/settings/profile",
      "PATCH",
      { name: profileName },
      "Perfil atualizado com sucesso."
    );
  };

  const saveCompany = async () => {
    await handleRequest(
      "/api/settings/company",
      "PATCH",
      { name: companyName, plan: companyPlan },
      "Empresa atualizada com sucesso."
    );
  };

  const createCategory = async () => {
    const ok = await handleRequest(
      "/api/settings/categories",
      "POST",
      { name: newCategory },
      "Categoria criada com sucesso."
    );

    if (ok) {
      setNewCategory("");
    }
  };

  const saveCategory = async () => {
    if (!editingCategoryId) {
      return;
    }

    const ok = await handleRequest(
      `/api/settings/categories/${editingCategoryId}`,
      "PATCH",
      { name: editingCategoryName },
      "Categoria atualizada com sucesso."
    );

    if (ok) {
      setEditingCategoryId(null);
      setEditingCategoryName("");
    }
  };

  const createMember = async () => {
    const ok = await handleRequest(
      "/api/settings/team",
      "POST",
      { name: memberName, email: memberEmail, role: memberRole },
      "Membro adicionado com senha inicial orbit123."
    );

    if (ok) {
      setMemberName("");
      setMemberEmail("");
      setMemberRole("AGENT");
    }
  };

  return (
    <AppShell
      currentUser={data.currentUser}
      title="Configuracoes do sistema"
      subtitle="Gestao e parametros"
      actions={
        <div className="content-actions">
          <div className="searchbox settings-status">
            {isPending ? "Atualizando dados..." : message || "Configure sua operacao e equipe"}
          </div>
        </div>
      }
    >
      <div className="settings-overview-grid">
        <article className="metric-card blue">
          <span>Chamados abertos</span>
          <strong>{data.stats.openTickets}</strong>
          <small>Operacao atual em acompanhamento</small>
        </article>
        <article className="metric-card purple">
          <span>Total de chamados</span>
          <strong>{data.stats.totalTickets}</strong>
          <small>Historico persistido no banco</small>
        </article>
        <article className="metric-card amber">
          <span>Categorias</span>
          <strong>{data.stats.totalCategories}</strong>
          <small>Classificacao ativa da fila</small>
        </article>
        <article className="metric-card green">
          <span>Equipe</span>
          <strong>{data.stats.totalTeamMembers}</strong>
          <small>Membros internos cadastrados</small>
        </article>
      </div>

      <div className="settings-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Perfil</p>
              <h3>Dados do usuario</h3>
            </div>
          </div>

          <div className="form-grid single-column">
            <label className="field">
              <span>Nome</span>
              <input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
            </label>
            <label className="field">
              <span>E-mail</span>
              <input value={data.currentUser.email} disabled />
            </label>
            <label className="field">
              <span>Perfil</span>
              <input value={data.currentUser.role} disabled />
            </label>
          </div>

          <button className="primary-button" type="button" disabled={isPending} onClick={saveProfile}>
            Salvar perfil
          </button>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Empresa</p>
              <h3>Identidade da operacao</h3>
            </div>
          </div>

          <div className="form-grid single-column">
            <label className="field">
              <span>Nome da empresa</span>
              <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
            </label>
            <label className="field">
              <span>Plano</span>
              <input value={companyPlan} onChange={(event) => setCompanyPlan(event.target.value)} />
            </label>
          </div>

          <button className="primary-button" type="button" disabled={isPending} onClick={saveCompany}>
            Salvar empresa
          </button>
        </section>

        <section className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Categorias</p>
              <h3>Organizacao da fila</h3>
            </div>
          </div>

          <div className="settings-list">
            {data.categories.map((category) => {
              const editing = editingCategoryId === category.id;
              return (
                <article className="settings-item" key={category.id}>
                  <div className="settings-item-copy">
                    <strong>{category.name}</strong>
                    <span>ID: {category.id}</span>
                  </div>

                  {editing ? (
                    <div className="settings-inline-form">
                      <input
                        value={editingCategoryName}
                        onChange={(event) => setEditingCategoryName(event.target.value)}
                      />
                      <button className="ghost-button" type="button" onClick={saveCategory}>
                        Salvar
                      </button>
                    </div>
                  ) : (
                    <button
                      className="ghost-button"
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setEditingCategoryName(category.name);
                      }}
                    >
                      Editar
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <div className="settings-create-row">
            <input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="Nova categoria"
            />
            <button className="primary-button" type="button" disabled={isPending} onClick={createCategory}>
              Adicionar categoria
            </button>
          </div>
        </section>

        <section className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Equipe</p>
              <h3>Usuarios internos</h3>
            </div>
          </div>

          <div className="settings-list">
            {data.teamMembers.map((member) => (
              <article className="settings-item" key={member.id}>
                <div className="settings-item-copy">
                  <strong>{member.name}</strong>
                  <span>
                    {member.email} • {member.role}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="form-grid team-grid">
            <label className="field">
              <span>Nome</span>
              <input value={memberName} onChange={(event) => setMemberName(event.target.value)} />
            </label>
            <label className="field">
              <span>E-mail</span>
              <input value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} />
            </label>
            <label className="field">
              <span>Perfil</span>
              <select value={memberRole} onChange={(event) => setMemberRole(event.target.value as UserRole)}>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="AGENT">AGENT</option>
              </select>
            </label>
          </div>

          <button className="primary-button" type="button" disabled={isPending} onClick={createMember}>
            Adicionar membro
          </button>
        </section>
      </div>
    </AppShell>
  );
}
