import type { ReactNode } from 'react'

type DesktopIconProps = {
  label: string
  onOpen: () => void
  children: ReactNode
}

export default function DesktopIcon({ label, onOpen, children }: DesktopIconProps) {
  return (
    <button
      type="button"
      onDoubleClick={onOpen}
      onClick={(e) => {
        // Mobile / single click open
        if (window.matchMedia('(pointer: coarse)').matches) onOpen()
        e.currentTarget.focus()
      }}
      className="group flex w-[76px] flex-col items-center gap-2 rounded-md p-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--panel-edge)] bg-[var(--panel)] shadow-sm transition group-hover:scale-[1.03] group-active:scale-95">
        {children}
      </span>
      <span className="select-none text-[12px] font-medium leading-tight text-[var(--ink)] drop-shadow-sm">
        {label}
      </span>
    </button>
  )
}
