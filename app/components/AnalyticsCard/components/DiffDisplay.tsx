import { ArrowDown } from "../../icons/ArrowDown";
import { ArrowUp } from "../../icons/ArrowUp";

type Props = {
  className?: string;
  diff: number;
  label: string;
};

export function DiffDisplay({ className, diff, label }: Props) {
  if (diff === 0) {
    return (
      <div className={`flex justify-center items-center text-sm ${className}`}>
        <span className="text-gray-600 font-bold">±{diff}</span>
        <span className="ml-1 text-gray-500">{label}</span>
      </div>
    );
  }
  if (diff > 0) {
    return (
      <div className={`flex justify-center items-center text-sm ${className}`}>
        <ArrowUp className="text-green-600" />
        <span className="text-green-600 font-bold">+{diff}</span>
        <span className="ml-1 text-gray-500">{label}</span>
      </div>
    );
  }

  if (diff < 0) {
    return (
      <div className={`flex justify-center items-center text-sm ${className}`}>
        <ArrowDown className="text-red-600" />
        <span className="text-red-600 font-bold">{diff}</span>
        <span className="ml-1 text-gray-500">{label}</span>
      </div>
    );
  }
  return null;
}
