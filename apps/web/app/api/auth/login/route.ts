import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Credenciais obrigatorias." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() }
  });

  if (!user || user.passwordHash !== body.password) {
    return NextResponse.json(
      { error: "Credenciais invalidas. Use rafa@orbitdesk.dev com a senha orbit123." },
      { status: 401 }
    );
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    expires: expiresAt,
    path: "/"
  });

  return NextResponse.json({ ok: true });
}
