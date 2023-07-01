type Props = {
  className?: string;
};

export function ArrowUp({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      className={`w-3 h-3 ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
      />
    </svg>
  );
}
