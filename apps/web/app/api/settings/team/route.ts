import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import type { UserRole } from "../../../../lib/orbit-data";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    role?: UserRole;
  };

  if (!body.name?.trim() || !body.email?.trim() || !body.role) {
    return NextResponse.json({ error: "Dados do membro obrigatorios." }, { status: 400 });
  }

  await prisma.user.create({
    data: {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      role: body.role,
      companyId: user.companyId,
      passwordHash: "orbit123"
    }
  });

  return NextResponse.json({ ok: true });
}
