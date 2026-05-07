"use client";

import type { CSSProperties } from "react";
import { CollapsiblePanel } from "./collapsible-panel";

type AgentCapacityItem = {
  label: string;
  rate: string;
  width: string;
  tone: "blue" | "purple" | "teal";
};

type TeamCapacityCardProps = {
  agents: AgentCapacityItem[];
};

export function TeamCapacityCard({ agents }: TeamCapacityCardProps) {
  return (
    <CollapsiblePanel kicker="Atendentes" title="Capacidade da equipe">
      <div className="agents-list">
        {agents.map((item, index) => (
          <article className="agent-row" key={item.label} style={{ "--delay": `${index * 90}ms` } as CSSProperties}>
            <span className={`agent-avatar ${item.tone}`}>{item.label.slice(0, 2)}</span>
            <div className="agent-copy">
              <strong>{item.label}</strong>
              <span>resolucao recente</span>
            </div>
            <div className="agent-load">
              <b>{item.rate}</b>
              <div className="agent-load-bar">
                <i className={item.tone} style={{ width: item.width }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </CollapsiblePanel>
  );
}
