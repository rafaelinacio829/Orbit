import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ categoryId: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const { categoryId } = await context.params;
  const body = (await request.json()) as {
    name?: string;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Nome da categoria obrigatorio." }, { status: 400 });
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: body.name.trim()
    }
  });

  return NextResponse.json({ ok: true });
}
