import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Nome da categoria obrigatorio." }, { status: 400 });
  }

  await prisma.category.create({
    data: {
      name: body.name.trim(),
      companyId: user.companyId
    }
  });

  return NextResponse.json({ ok: true });
}
