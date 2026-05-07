"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type CollapsiblePanelProps = {
  kicker: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function CollapsiblePanel({ kicker, title, children, className = "" }: CollapsiblePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={`panel orbit-card collapsible-card ${isExpanded ? "expanded" : ""} ${className}`}>
      <button
        className="collapsible-card-trigger"
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
      >
        <span>
          <p className="section-kicker">{kicker}</p>
          <h3>{title}</h3>
        </span>
        <span className="collapse-corner-indicator" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </svg>
        </span>
      </button>

      <div className="collapsible-card-body">
        <div className="collapsible-card-inner">{children}</div>
      </div>
    </section>
  );
}
