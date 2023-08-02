import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import {
  addDays,
  addWeeks,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { NextResponse } from "next/server";

type Analytics = {
  today: number;
  yesterday: number;
  weekly: number;
  lastWeek: number;
};

export async function GET() {
  const session = await getSession();
  if (session?.user == null) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  const userId = session.user.sub;

  const today = new Date();
  const todayCount = await prisma.pomodoro.count({
    where: {
      endTime: {
        gte: startOfDay(today),
        lte: today,
      },
      Session: {
        userId: userId,
      },
    },
  });

  const yesterday = addDays(today, -1);
  const yesterdayCount = await prisma.pomodoro.count({
    where: {
      endTime: {
        gte: startOfDay(yesterday),
        lte: endOfDay(yesterday),
      },
      Session: {
        userId: userId,
      },
    },
  });

  const weeklyCount = await prisma.pomodoro.count({
    where: {
      endTime: {
        gte: startOfWeek(today),
        lte: today,
      },
      Session: {
        userId: userId,
      },
    },
  });

  const lastWeek = addWeeks(today, -1);
  const lastWeekCount = await prisma.pomodoro.count({
    where: {
      endTime: {
        gte: startOfWeek(lastWeek),
        lte: endOfWeek(lastWeek),
      },
      Session: {
        userId: userId,
      },
    },
  });

  const response: Analytics = {
    today: todayCount,
    yesterday: yesterdayCount,
    weekly: weeklyCount,
    lastWeek: lastWeekCount,
  };
  return NextResponse.json(response);
}
