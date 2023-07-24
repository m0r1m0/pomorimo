import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

// Delete pomodoro
export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { pomodoroId: string };
  }
) {
  const session = await getSession();
  if (session?.user == null) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  const userId = session.user.sub;

  const pomodoroId = Number(params.pomodoroId);
  if (isNaN(pomodoroId)) {
    return NextResponse.json(null, {
      status: 500,
    });
  }

  const targetSession = await prisma.session.findFirst({
    where: {
      userId,
      endTime: "9999-12-31T23:59:59Z",
    },
  });

  if (targetSession == null) {
    return NextResponse.json(null, {
      status: 404,
    });
  }

  await prisma.pomodoro.deleteMany({
    where: {
      id: pomodoroId,
      Session: {
        userId,
      },
    },
  });

  const currentSession = await prisma.session.findFirst({
    where: {
      id: targetSession.id,
      userId,
    },
    include: {
      pomodoros: true,
    },
  });

  return NextResponse.json(currentSession);
}
