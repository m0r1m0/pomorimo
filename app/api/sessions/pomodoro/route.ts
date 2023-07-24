import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

// Start pomodoro
export async function POST(request: Request) {
  const session = await getSession();
  if (session?.user == null) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  const { startTime, endTime }: { startTime: string; endTime: string } =
    await request.json();
  const userId = session.user.sub;

  const currentSession = await prisma.session.findFirst({
    where: {
      userId,
      endTime: "9999-12-31T23:59:59Z",
    },
    include: {
      pomodoros: true,
    },
  });

  if (currentSession !== null) {
    const created = await prisma.session.update({
      where: {
        id: currentSession.id,
      },
      data: {
        pomodoros: {
          create: {
            startTime,
            endTime,
          },
        },
      },
      include: {
        pomodoros: true,
      },
    });
    return NextResponse.json(created);
  }

  const created = await prisma.session.create({
    data: {
      userId,
      startTime,
      endTime: "9999-12-31T23:59:59Z",
      pomodoros: {
        create: {
          startTime,
          endTime,
        },
      },
    },
    include: {
      pomodoros: true,
    },
  });
  return NextResponse.json(created);
}
