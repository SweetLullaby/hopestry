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
  width = 440,
  height = 340,
  children,
}: WindowFrameProps) {
  const [pos, setPos] = useState({
    x: 96 + (z % 5) * 30,
    y: 78 + (z % 5) * 26,
  })
  const drag = useRef<{ ox: number; oy: number; px: number; py: number } | null>(
    null,
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return
      setPos({
        x: Math.max(8, drag.current.px + (e.clientX - drag.current.ox)),
        y: Math.max(36, drag.current.py + (e.clientY - drag.current.oy)),
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
      role="dialog"
      aria-label={title}
      onPointerDown={onFocus}
      className="window-enter absolute flex flex-col overflow-hidden rounded-2xl border border-white/50 bg-[var(--panel)] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      style={{
        left: pos.x,
        top: pos.y,
        width: `min(${width}px, calc(100vw - 24px))`,
        height: `min(${height}px, calc(100vh - 88px))`,
        zIndex: 100 + z,
      }}
    >
      <div
        className="flex h-11 shrink-0 cursor-grab items-center justify-between border-b border-[var(--panel-edge)] bg-gradient-to-b from-white to-[#efece4] px-3 active:cursor-grabbing"
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-sm transition hover:brightness-95"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-sm" />
        </div>
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold tracking-wide text-[var(--panel-ink)]">
          {title}
        </span>
        <span className="w-12" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-5 text-[14px] leading-relaxed text-[var(--panel-muted)]">
        {children}
      </div>
    </div>
  )
}
