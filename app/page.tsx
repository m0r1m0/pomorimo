"use client";

import { useState } from "react";
import { useInterval } from "./hooks/useInterval";

const FOCUS_DURATION = 0.1 * 60
const BREAK_DURATION = 0.05 * 60

export default function Index() {
  const [count, setCount] = useState(FOCUS_DURATION);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);

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
        return;
      }
      setCount((c) => c - 1);
    },
    timerRunning ? 1000 : null
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <span className="text-2xl">{isFocusMode ? "FOCUS" : "BREAK"}</span>
      <span className="text-9xl mt-4">{Math.floor(count / 60).toString().padStart(2, '0')}:{(count % 60).toString().padStart(2, '0')}</span>
      <button
        className="mt-8 bg-slate-50 text-black font-bold w-40 h-10 text-2xl rounded"
        onClick={() => {
          if (!timerRunning) {
            setTimerRunning(true);
          }
        }}
      >
        START
      </button>
    </main>
  );
}
