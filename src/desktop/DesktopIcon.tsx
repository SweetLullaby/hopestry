import type { ReactNode } from 'react'

type DesktopIconProps = {
  label: string
  onOpen: () => void
  delay?: number
  children: ReactNode
}

export default function DesktopIcon({
  label,
  onOpen,
  delay = 0,
  children,
}: DesktopIconProps) {
  return (
    <button
      type="button"
      onDoubleClick={onOpen}
      onClick={(e) => {
        if (window.matchMedia('(pointer: coarse)').matches) onOpen()
        e.currentTarget.focus()
      }}
      className="desk-icon-enter group flex w-[88px] flex-col items-center gap-2 rounded-xl p-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-[18px] shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_34px_rgba(0,0,0,0.35)] group-active:translate-y-0 group-active:scale-95">
        {children}
      </span>
      <span className="select-none text-[12px] font-medium leading-tight text-[var(--ink-soft)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
        {label}
      </span>
    </button>
  )
}
