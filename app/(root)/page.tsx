"use client";

import { useEffect, useRef, useState } from "react";
import { useInterval } from "./hooks/useInterval";
import { Button } from "../components/Button";
import { AnalyticsCard } from "./components/AnalyticsCard";
import { Tooltip } from "./components/Tooltip";
import { Countdown } from "./components/Countdown";
import {
  addSeconds,
  compareAsc,
  differenceInSeconds,
  parseISO,
} from "date-fns";
import { LinkButton } from "@/app/components/LinkButton";
import { Pomodoro, Session } from "@prisma/client";

const FOCUS_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const POMODOROS_PER_LONG_BREAK = 4;
const TIMER_INTERVAL_SEC = 1;

type TimerState = "running" | "stopped";

export default function Index() {
  const [count, setCount] = useState(FOCUS_DURATION);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [timerState, setTimerState] = useState<TimerState>("stopped");
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentSession, setCurrentSession] = useState<APIResponseJson<
    Session & { pomodoros: Pomodoro[] }
  > | null>(null);
  const [analytics, setAnalytics] = useState<{
    today: number;
    yesterday: number;
    weekly: number;
    lastWeek: number;
  } | null>(null);

  useEffect(() => {
    async function getCurrentSession(): Promise<APIResponseJson<
      Session & {
        pomodoros: Pomodoro[];
      }
    > | null> {
      const response = await fetch("/api/sessions");
      return response.json();
    }
    getCurrentSession().then((session) => {
      if (session === null) {
        return;
      }
      setCurrentSession(session);

      const runningPomodoro = findRunningPomodoro(session.pomodoros);
      if (runningPomodoro == null) {
        return;
      }

      setCount(
        differenceInSeconds(parseISO(runningPomodoro.endTime), new Date())
      );
      setEndDate(parseISO(runningPomodoro.endTime));
      setTimerState("running");
    });
  }, []);

  useEffect(() => {
    async function getAnalytics() {
      const res = await fetch(`/api/analytics`);
      const data = await res.json();
      setAnalytics(data);
    }
    getAnalytics();
  }, []);

  useInterval(
    () => {
      if (endDate == null || currentSession == null) {
        return;
      }
      if (count === 0) {
        if (isFocusMode) {
          if (currentSession.pomodoros.length === POMODOROS_PER_LONG_BREAK) {
            setCount(LONG_BREAK_DURATION);
            fetch(`/api/sessions/${currentSession?.id}/end`, {
              method: "PUT",
              body: JSON.stringify({
                endTime: new Date().toISOString(),
              }),
            });
            setCurrentSession(null);
          } else {
            setCount(SHORT_BREAK_DURATION);
          }
          setIsFocusMode(false);
        } else {
          setCount(FOCUS_DURATION);
          setIsFocusMode(true);
        }
        setTimerState("stopped");
        playAlarmSound();
        return;
      }
      const now = new Date();
      const newCount = differenceInSeconds(endDate, now);
      setCount(newCount);
    },
    timerState === "running" ? TIMER_INTERVAL_SEC * 1000 : null
  );

  const playAlarmSound = () => {
    if (!alarmSoundRef.current) {
      const alarmSound = new Audio("alarm-clock-short-6402.mp3");
      alarmSoundRef.current = alarmSound;
    }
    alarmSoundRef.current.play().catch((error) => {
      console.error("Failed to play alarm sound:", error);
    });
  };

  const handleStart = () => {
    if (alarmSoundRef.current !== null) {
      alarmSoundRef.current.pause();
    }
    if (timerState === "stopped") {
      startTimer();
      return;
    }
  };

  const startPomodoro = async (startTime: Date, endTime: Date) => {
    const response = await fetch(`/api/sessions/pomodoro`, {
      method: "POST",
      body: JSON.stringify({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }),
    });
    const updatedSession = await response.json();
    setCurrentSession(updatedSession);
  };

  const deletePomodoro = async (pomodoroId: number) => {
    const response = await fetch(`/api/sessions/pomodoro/${pomodoroId}`, {
      method: "DELETE",
    });
    const updatedSession = await response.json();

    setCurrentSession(updatedSession);
  };

  const startTimer = () => {
    const now = new Date();
    const end = addSeconds(now, count + TIMER_INTERVAL_SEC);
    if (isFocusMode) {
      startPomodoro(now, end);
    }
    setEndDate(end);
    setTimerState("running");
  };

  const restartTimer = () => {
    setTimerState("running");
  };

  const skip = () => {
    const runningPomodoro = findRunningPomodoro(
      currentSession?.pomodoros ?? []
    );
    if (runningPomodoro) {
      deletePomodoro(runningPomodoro.id);
    }
    setTimerState("stopped");
    setCount(isFocusMode ? SHORT_BREAK_DURATION : FOCUS_DURATION);
    setIsFocusMode((m) => !m);
  };

  return (
    <>
      <LinkButton
        href="/api/auth/logout"
        label="Logout"
        className="fixed top-8 right-8 text-sm !w-20 h-8"
      />
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl">{isFocusMode ? "FOCUS" : "BREAK"}</span>
        <Countdown className="mt-4" count={count} />
        {timerState === "running" && (
          <div className="mt-8 flex items-center">
            <Tooltip label="Skip this session">
              <Button
                className="ml-2 font-normal bg-transparent text-current hover:border border-black dark:border-slate-50 transition"
                onClick={skip}
              >
                Skip
              </Button>
            </Tooltip>
          </div>
        )}
        {timerState === "stopped" && (
          <Button className="mt-8" onClick={handleStart}>
            START
          </Button>
        )}
      </div>
      {analytics !== null && (
        <div className="mt-20 flex">
          <AnalyticsCard
            title="Today Focus"
            value={analytics.today}
            prevValue={analytics.yesterday}
            diffLabel="yesterday"
          />
          <AnalyticsCard
            title="Weekly Focus"
            value={analytics.weekly}
            prevValue={analytics.lastWeek}
            diffLabel="last week"
            className="ml-4"
          />
        </div>
      )}
    </>
  );
}

const retryFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const response = await fetch(input, init);
  if (response.status === 503) {
    const body = await response.json();
    if (body.isRejected) {
      return await retryFetch(input, init);
    }
  }
  return response;
};

function findRunningPomodoro(pomodoros: APIResponseJson<Pomodoro>[]) {
  const now = new Date();
  return pomodoros.find(
    (pomodoro) => compareAsc(now, parseISO(pomodoro.endTime)) === -1
  );
}
