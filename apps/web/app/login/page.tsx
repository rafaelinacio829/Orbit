"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("rafa@orbitdesk.dev");
  const [password, setPassword] = useState("orbit123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Falha ao entrar.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="login-page">
      <section className="login-layout">
        <aside className="login-showcase">
          <div className="login-showcase-shell">
            <div className="showcase-head">
              <div className="brand">
                <div className="brand-icon">O</div>
                <div>
                  <p className="brand-kicker">Orbit Platform</p>
                  <h1>Orbit Desk</h1>
                </div>
              </div>
              <Link href="/dashboard" className="inline-link">
                Ir para dashboard
              </Link>
            </div>

            <div className="showcase-body">
              <p className="section-kicker">Acesso operacional</p>
              <h2>Entre na central que organiza SLA, IA e atendimento em uma so orbita.</h2>
              <p className="showcase-copy">
                O Orbit Desk agora opera com sessao real, persistencia no servidor e base pronta
                para escalar atendimento, automacoes e inteligencia.
              </p>
            </div>

            <div className="showcase-panels">
              <article className="mini-panel">
                <span>Demo</span>
                <p>Entre como administrador com rafa@orbitdesk.dev.</p>
              </article>
              <article className="mini-panel">
                <span>Senha</span>
                <p>A senha padrao dos usuarios seed e orbit123.</p>
              </article>
              <article className="mini-panel">
                <span>Stack</span>
                <p>Next.js, Prisma e PostgreSQL sustentando o MVP.</p>
              </article>
            </div>

            <div className="showcase-metrics">
              <article className="showcase-metric">
                <strong>24h</strong>
                <span>monitoramento de fila</span>
              </article>
              <article className="showcase-metric">
                <strong>IA</strong>
                <span>apoio para triagem e resposta</span>
              </article>
              <article className="showcase-metric">
                <strong>DB</strong>
                <span>dados persistidos no servidor</span>
              </article>
            </div>
          </div>
        </aside>

        <section className="login-card">
          <div className="login-card-shell">
            <div className="login-card-head">
              <p className="section-kicker">Login</p>
              <h3>Entrar na operacao</h3>
              <p>Use um dos usuarios seed do banco para acessar o sistema.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>E-mail</span>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                />
              </label>

              <label className="field">
                <span>Senha</span>
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </label>

              {error ? <p className="form-error">{error}</p> : null}

              <button className="primary-button block login-submit" disabled={loading} type="submit">
                {loading ? "Entrando..." : "Entrar no Orbit Desk"}
              </button>
            </form>

            <div className="login-helper-card">
              <div className="login-helper-head">
                <strong>Usuarios demo adicionais</strong>
                <span>mesma senha padrao</span>
              </div>
              <div className="demo-users">
                <p><strong>Amanda</strong> amanda@orbitdesk.dev</p>
                <p><strong>Joao</strong> joao@orbitdesk.dev</p>
                <p><strong>Senha</strong> orbit123</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
