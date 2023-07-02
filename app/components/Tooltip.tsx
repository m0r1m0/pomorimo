import { type ReactNode } from "react"

type Props = {
  children: ReactNode
  label: string
}

export function Tooltip({ children, label }: Props) {
  return (
    <div className="relative group">
      <span className={`
        whitespace-nowrap
        rounded
        bg-black
        dark:bg-slate-50
        text-slate-50
        dark:text-black
        px-2
        py-1
        absolute
        -top-10
        left-1/2
        -translate-x-1/2
        before:content-['']
        before:absolute
        before:-translate-x-1/2
        before:left-1/2
        before:top-full
        before:border-4
        before:border-transparent
        before:border-t-slate-50
        opacity-0
        group-hover:opacity-100
        transition
        pointer-events-none
      `}>
        {label}
      </span>
      {children}
    </div>
  )
}