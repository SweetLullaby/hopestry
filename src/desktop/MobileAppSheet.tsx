import type { ReactNode } from 'react'

type MobileAppSheetProps = {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function MobileAppSheet({ title, onClose, children }: MobileAppSheetProps) {
  return (
    <div
      role="dialog"
      aria-label={title}
      className="sheet-enter absolute inset-x-0 bottom-0 top-10 z-[150] flex flex-col bg-[var(--panel)]"
    >
      <div className="flex h-12 shrink-0 items-center border-b border-[var(--panel-edge)] bg-gradient-to-b from-white to-[#efece4] px-1">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--panel-ink)] active:bg-black/5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="flex-1 truncate px-1 text-center text-[15px] font-semibold tracking-tight text-[var(--panel-ink)]">
          {title}
        </span>
        <span className="h-9 w-9 shrink-0" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-5 pb-[max(20px,env(safe-area-inset-bottom))] text-[14px] leading-relaxed text-[var(--panel-muted)]">
        {children}
      </div>
    </div>
  )
}
