import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    plan?: string;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Nome da empresa obrigatorio." }, { status: 400 });
  }

  await prisma.company.update({
    where: { id: user.companyId },
    data: {
      name: body.name.trim(),
      plan: body.plan?.trim() || null
    }
  });

  return NextResponse.json({ ok: true });
}
