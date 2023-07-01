"use client";

import { useRef, useState } from "react";
import { useInterval } from "./hooks/useInterval";
import { Button } from "./components/buttons/Button";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export default function Index() {
  const [count, setCount] = useState(FOCUS_DURATION);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  const [username, setUsername] = useState("");
  const [graphID, setGraphID] = useState("");
  const [token, setToken] = useState("");
  const [isPixelaInitialized, setIsPixelaInitialized] = useState(false);

  const incrementPixela = async () => {
    await retryFetch(`https://pixe.la/v1/users/${username}/graphs/${graphID}/increment`, {
      method: "PUT",
      headers: {
        "X-USER-TOKEN": token,
      }
    });
  }

  const initializePixela = async () => {
    setIsPixelaInitialized(true);
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

  const playAlarmSound = () => {
    if (!alarmSoundRef.current) {
      const alarmSound = new Audio("alarm-clock-short-6402.mp3");
      alarmSoundRef.current = alarmSound;
    }
    alarmSoundRef.current.play().catch((error) => {
      console.error("Failed to play alarm sound:", error);
    });
  };

  const handleClick = () => {
    if (timerRunning) {
      setTimerRunning(false);
      return;
    }

    if (!timerRunning) {
      if (alarmSoundRef.current !== null) {
        alarmSoundRef.current.pause();
      }
      setTimerRunning(true);
      return;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {isPixelaInitialized && (
        <div className="flex flex-col items-center justify-center">
          <span className="text-2xl">{isFocusMode ? "FOCUS" : "BREAK"}</span>
          <span className="text-9xl mt-4">
            {Math.floor(count / 60)
              .toString()
              .padStart(2, "0")}
            :{(count % 60).toString().padStart(2, "0")}
          </span>
          <Button
            className="mt-8"
            onClick={handleClick}
          >
            {timerRunning ? "PAUSE" : "START"}
          </Button>
        </div>
      )}
      {!isPixelaInitialized && (
        <div className="mt-12 flex flex-col">
          <div className="flex flex-col">
            <label className="block text-sm font-bold mb-2" htmlFor="username">
              username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="username"
              onChange={(v) => {
                setUsername(v.target.value);
              }}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="block text-sm font-bold mb-2" htmlFor="graphid">
              graphID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="graphid"
              type="text"
              placeholder="graphID"
              onChange={(v) => {
                setGraphID(v.target.value);
              }}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="block text-sm font-bold mb-2" htmlFor="token">
              token
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="token"
              type="password"
              placeholder="token"
              onChange={(v) => {
                setToken(v.target.value);
              }}
            />
          </div>
          <Button
            className="mt-8"
            size="lg"
            onClick={initializePixela}
          >
            Initialize Pixela
          </Button>
        </div>
      )}
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
