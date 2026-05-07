# Orbit Desk Architecture

## Product direction

Orbit Desk starts as a modular help desk product and is intentionally structured so it can evolve into a broader Orbit platform.

## Initial architecture

```text
User
  |
  v
Orbit Web
  |
  v
Orbit API
  |
  +--> PostgreSQL
  +--> AI provider
  +--> File storage
  +--> Email provider
```

## Core modules for the MVP

- Auth and access control
- Companies and users
- Tickets and ticket events
- Ticket messaging and attachments
- Categories and SLA policies
- AI interactions

## Multi-tenant rule

Every business entity must be scoped to a company unless it is explicitly global administration data.

## AI rule

The AI can classify, summarize, and suggest actions, but it must not close tickets automatically in the MVP.
