"use client";

import { useRef, useState } from "react";
import { useInterval } from "./hooks/useInterval";

const FOCUS_DURATION = 25 * 60
const BREAK_DURATION = 5 * 60

export default function Index() {
  const [count, setCount] = useState(FOCUS_DURATION);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  useInterval(
    () => {
      if (count === 0) {
        if (isFocusMode) {
          setCount(BREAK_DURATION);
          setIsFocusMode(false);
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

  const playAlarmSound = () => {
    if (!alarmSoundRef.current) {
      const alarmSound = new Audio("alarm-clock-short-6402.mp3");
      alarmSoundRef.current = alarmSound;
    }
    setAlarmPlaying(true);
    alarmSoundRef.current.loop = true;
    alarmSoundRef.current.play().catch((error) => {
      console.error("Failed to play alarm sound:", error);
      setAlarmPlaying(false);
    });
  };

  const stopAlarmSound = () => {
    if (alarmSoundRef.current !== null) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
    }
    setAlarmPlaying(false);
  };

  const handleClick = () => {
    if (alarmPlaying) {
      stopAlarmSound();
      return;
    }

    if (timerRunning) {
      setTimerRunning(false);
      return;
    }

    if (!timerRunning) {
      setTimerRunning(true);
      return;
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <span className="text-2xl">{isFocusMode ? "FOCUS" : "BREAK"}</span>
      <span className="text-9xl mt-4">{Math.floor(count / 60).toString().padStart(2, '0')}:{(count % 60).toString().padStart(2, '0')}</span>
      <button
        className="mt-8 bg-slate-50 text-black font-bold w-40 h-10 text-2xl rounded"
        onClick={handleClick}
      >
        {alarmPlaying || timerRunning ? "STOP" : "START"}
      </button>
    </main>
  );
}