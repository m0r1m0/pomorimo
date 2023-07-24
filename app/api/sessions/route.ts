import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { Pomodoro, Session } from "@prisma/client";
import { addMinutes, isBefore } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getSession();
  if (session?.user == null) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  const now = new Date();
  const userId = session.user.sub;

  const currentSession = await prisma.session.findFirst({
    where: {
      endTime: "9999-12-31T23:59:59Z",
      userId,
    },
    include: {
      pomodoros: {
        orderBy: {
          endTime: "desc",
        },
      },
    },
  });

  if (currentSession === null) {
    return NextResponse.json(null);
  }

  if (shouldEndSesssion(currentSession, now)) {
    const lastPomodoro = currentSession.pomodoros[0];
    await prisma.session.update({
      where: {
        id: currentSession.id,
      },
      data: {
        endTime: lastPomodoro.endTime,
      },
    });
    return NextResponse.json(null);
  }

  return NextResponse.json(currentSession);
}

function shouldEndSesssion(
  session: Session & { pomodoros: Pomodoro[] },
  now: Date
) {
  const lastPomodoro = session.pomodoros[0];
  if (lastPomodoro == null) {
    return false;
  }
  return isBefore(addMinutes(lastPomodoro.endTime, 15), now);
}
