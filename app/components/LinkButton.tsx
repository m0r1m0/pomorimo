type Props = {
  className?: string;
  href: string;
  label: string;
};

export function LinkButton({ href, label, className }: Props) {
  return (
    <a
      className={`bg-slate-50 text-black font-bold rounded h-10 w-40 text-2xl flex justify-center items-center ${className}`}
      href={href}
    >
      {label}
    </a>
  );
}
