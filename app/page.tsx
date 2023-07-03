"use client";

import { useMemo, useRef, useState } from "react";
import { useInterval } from "./hooks/useInterval";
import { Button } from "./components/Button";
import { AnalyticsCard } from "./components/AnalyticsCard";
import { Tooltip } from "./components/Tooltip";
import { PixelaClient } from "./pixela";
import { Setting, Setup } from "./components/Setup";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

type Pixel = {
  date: string;
  quantity: string;
};

export default function Index() {
  const [count, setCount] = useState(FOCUS_DURATION);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  const [setting, setSetting] = useState<Setting>({
    username: "",
    graphID: "",
    token: "",
  });
  const [isPixelaInitialized, setIsPixelaInitialized] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const lastWeek = formatDate(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );

  const incrementPixela = async () => {
    const pixelaClient = new PixelaClient(
      setting.username,
      setting.graphID,
      setting.token
    );
    await pixelaClient.increment();
    refreshPixels();
  };

  const refreshPixels = async () => {
    const pixelaClient = new PixelaClient(
      setting.username,
      setting.graphID,
      setting.token
    );
    const pixels = await pixelaClient.getPixels(lastWeek);
    setPixels(pixels);
  };

  useInterval(
    () => {
      if (count === 0) {
        if (isFocusMode) {
          setCount(BREAK_DURATION);
          setIsFocusMode(false);
          incrementPixela();
        } else {
          setCount(FOCUS_DURATION);
          setIsFocusMode(true);
        }
        setTimerRunning(false);
        playAlarmSound();
        return;
      }
      setCount((c) => c - 1);
    },
    timerRunning ? 1000 : null
  );

  const todayPixelQuantity = useMemo(() => {
    const today = formatDate(new Date());
    return Number(pixels.find((p) => p.date === today)?.quantity ?? "0");
  }, [pixels]);

  const yesterdayPixelQuantity = useMemo(() => {
    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatDate(yesterdayDate);
    return Number(pixels.find((p) => p.date === yesterday)?.quantity ?? "0");
  }, [pixels]);

  const totalPixelQuantity = useMemo(() => {
    return pixels.reduce((acc, pixel) => {
      return acc + Number(pixel.quantity);
    }, 0);
  }, [pixels]);

  const lastWeekPixelQuantity = useMemo(() => {
    return Number(pixels.find((p) => p.date === lastWeek)?.quantity ?? "0");
  }, [lastWeek, pixels]);

  const playAlarmSound = () => {
    if (!alarmSoundRef.current) {
      const alarmSound = new Audio("alarm-clock-short-6402.mp3");
      alarmSoundRef.current = alarmSound;
    }
    alarmSoundRef.current.play().catch((error) => {
      console.error("Failed to play alarm sound:", error);
    });
  };

  const start = () => {
    if (alarmSoundRef.current !== null) {
      alarmSoundRef.current.pause();
    }
    setTimerRunning(true);
  };

  const pause = () => {
    setTimerRunning(false);
  };

  const skip = () => {
    setTimerRunning(false);
    setCount(isFocusMode ? BREAK_DURATION : FOCUS_DURATION);
    setIsFocusMode((m) => !m);
  };

  const handleSetup = async (value: Setting) => {
    setSetting(value);
    setIsPixelaInitialized(true);
    const pixelaClient = new PixelaClient(
      value.username,
      value.graphID,
      value.token
    );
    const pixels = await pixelaClient.getPixels(lastWeek);
    setPixels(pixels);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {isPixelaInitialized && (
        <>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl">{isFocusMode ? "FOCUS" : "BREAK"}</span>
            <span className="text-9xl mt-4">
              {Math.floor(count / 60)
                .toString()
                .padStart(2, "0")}
              :{(count % 60).toString().padStart(2, "0")}
            </span>
            {timerRunning && (
              <div className="mt-8 flex items-center">
                <Button onClick={pause}>PAUSE</Button>
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
            {!timerRunning && (
              <Button className="mt-8" onClick={start}>
                START
              </Button>
            )}
          </div>
          <div className="mt-20 flex">
            <AnalyticsCard
              title="Today Focus"
              value={todayPixelQuantity}
              prevValue={yesterdayPixelQuantity}
              diffLabel="yesterday"
            />
            <AnalyticsCard
              title="Weekly Focus"
              value={totalPixelQuantity}
              prevValue={lastWeekPixelQuantity}
              diffLabel="7 days ago"
              className="ml-4"
            />
          </div>
        </>
      )}
      {!isPixelaInitialized && <Setup onSetup={handleSetup} />}
    </main>
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

function formatDate(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = year + month + day;
  return formattedDate;
}
