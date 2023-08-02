import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const session = await getSession();
  if (session?.user == null) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  const sessionId = Number(params.sessionId);
  if (isNaN(sessionId)) {
    return NextResponse.json(null, {
      status: 500,
    });
  }

  const requestBody = await request.json();
  try {
    const updated = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        endTime: requestBody.endTime,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(null, {
      status: 500,
    });
  }
}
