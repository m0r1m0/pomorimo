import { useMemo } from "react";
import { DiffDisplay } from "./components/DiffDisplay";

type Props = {
  value: number;
  prevValue?: number;
  title: string;
  diffLabel: string;
  className?: string
};

export function AnalyticsCard({ className, value, prevValue, title, diffLabel }: Props) {
  const diff = useMemo(() => {
    if (prevValue == null) {
      return 0;
    }
    return value - prevValue;
  }, [value, prevValue]);

  return (
    <div className={`rounded bg-slate-50 text-black w-40 h-28 p-2 ${className}`}>
      <div className="flex justify-center items-center font-bold">
        <h2>{title}</h2>
      </div>
      <div className="mt-2 flex justify-center items-center font-bold">
        <span className="text-4xl">{value}</span>
      </div>
      <DiffDisplay
        className="mt-1"
        diff={diff}
        label={diffLabel}
      />
    </div>
  );
}
