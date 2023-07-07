type Props = {
  className?: string;
  count: number;
};

export function Countdown({ count, className }: Props) {
  const minutes = Math.floor(count / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (count % 60).toString().padStart(2, "0");

  return (
    <span className={`text-9xl ${className}`}>
      {minutes}:{seconds}
    </span>
  );
}
