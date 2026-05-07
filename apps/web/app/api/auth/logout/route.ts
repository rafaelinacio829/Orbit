import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { token }
    });
  }

  cookieStore.delete(SESSION_COOKIE);

  return NextResponse.json({ ok: true });
}
