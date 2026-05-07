# Orbit Desk

Orbit Desk is an AI-assisted help desk platform focused on ticket intake, triage, SLA tracking, and operator productivity.

This repository starts with the MVP foundation:

- `apps/web`: future front-end application
- `apps/api`: future back-end API
- `packages/shared`: shared types and utilities
- `prisma`: initial data model for the MVP
- `docs`: product, architecture, and roadmap notes

## MVP scope

The first version focuses on:

- authentication and roles
- companies and users
- categories and subcategories
- ticket creation and tracking
- ticket messages and attachments
- SLA policies
- AI-generated classification, summaries, and reply suggestions
- audit history for important events

## Suggested stack

- Front-end: Next.js
- API: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- AI: OpenAI or Gemini

## Project structure

```text
apps/
  api/
  web/
docs/
packages/
  shared/
prisma/
```

## Local database

The project is configured for PostgreSQL with Prisma.

1. Copy `.env.example` to `.env`
2. Start PostgreSQL locally:

```bash
npm run db:up
```

3. Sync the schema:

```bash
npm run db:push
```

4. Seed demo data:

```bash
npm run db:seed
```

Demo login:

- `rafa@orbitdesk.dev`
- `orbit123`

## Next steps

1. Initialize the workspace dependencies.
2. Create the database and apply the Prisma schema.
3. Implement authentication and role-based access.
4. Build the first CRUD flows for companies, users, and tickets.
