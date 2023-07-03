import { ReactNode } from "react";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "default";

type Props = {
  className?: string;
  onClick: () => void;
  size?: Size;
  children?: ReactNode;
  variant?: Variant;
};

function getSizeClass(size: Size = "md") {
  switch (size) {
    case "sm":
      return "w-20 text-xl";
    case "md":
      return "w-40 text-2xl";
    case "lg":
      return "w-60 text-2xl";
    default:
      return "w-40 text-2xl";
  }
}

export function Button({ size, children, className, onClick }: Props) {
  return (
    <button
      className={`bg-slate-50 text-black font-bold rounded h-10 ${getSizeClass(
        size
      )} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
