import { useEffect, useRef, useState, type ReactNode } from 'react'

type WindowFrameProps = {
  title: string
  z: number
  onClose: () => void
  onFocus: () => void
  width?: number
  height?: number
  children: ReactNode
}

export default function WindowFrame({
  title,
  z,
  onClose,
  onFocus,
  width = 420,
  height = 320,
  children,
}: WindowFrameProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 80 + (z % 5) * 28, y: 72 + (z % 5) * 24 })
  const drag = useRef<{ ox: number; oy: number; px: number; py: number } | null>(
    null,
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return
      setPos({
        x: drag.current.px + (e.clientX - drag.current.ox),
        y: drag.current.py + (e.clientY - drag.current.oy),
      })
    }
    const onUp = () => {
      drag.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      onPointerDown={onFocus}
      className="absolute flex flex-col overflow-hidden rounded-lg border border-[var(--panel-edge)] bg-[var(--panel)] shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
      style={{
        left: pos.x,
        top: pos.y,
        width: `min(${width}px, calc(100vw - 24px))`,
        height: `min(${height}px, calc(100vh - 48px))`,
        zIndex: 100 + z,
      }}
    >
      <div
        className="flex h-10 shrink-0 cursor-grab items-center justify-between border-b border-[var(--panel-edge)] bg-[#eceee8] px-3 active:cursor-grabbing"
        onPointerDown={(e) => {
          onFocus()
          drag.current = {
            ox: e.clientX,
            oy: e.clientY,
            px: pos.x,
            py: pos.y,
          }
        }}
      >
        <span className="text-[13px] font-medium tracking-wide text-[var(--ink)]">
          {title}
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d7dbd1] text-[12px] text-[var(--ink)] transition hover:bg-[#c5cbbf]"
        >
          ×
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 text-[14px] leading-relaxed text-[var(--muted)]">
        {children}
      </div>
    </div>
  )
}
