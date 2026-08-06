import type { AppId, OpenWindow } from './types'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import DesktopIcon from './DesktopIcon'
import WindowFrame from './WindowFrame'
import SnakeGame from './SnakeGame'

const APPS: {
  id: AppId
  label: string
  title: string
  width?: number
  height?: number
  icon: ReactNode
}[] = [
  {
    id: 'blindo',
    label: 'Blindo',
    title: 'Blindo',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="#2f4f3e" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" fill="#2f4f3e" />
      </svg>
    ),
  },
  {
    id: 'pear',
    label: 'Pear',
    title: 'Pear',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4c2.5 1 4.5 4.2 4.5 8.2S14.2 20 12 20s-4.5-3.8-4.5-7.8S9.5 5 12 4Z"
          stroke="#2f4f3e"
          strokeWidth="1.6"
        />
        <path d="M12 4c0-1.2.6-2 1.5-2" stroke="#2f4f3e" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact us',
    title: 'Contact us',
    width: 380,
    height: 240,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#2f4f3e" strokeWidth="1.6" />
        <path d="M4 7l8 6 8-6" stroke="#2f4f3e" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: 'About us',
    title: 'About us',
    width: 400,
    height: 260,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="#2f4f3e" strokeWidth="1.6" />
        <path d="M12 10v6" stroke="#2f4f3e" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1" fill="#2f4f3e" />
      </svg>
    ),
  },
  {
    id: 'snake',
    label: 'Snake',
    title: 'Snake',
    width: 340,
    height: 340,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="10" width="5" height="4" rx="1" fill="#2f4f3e" />
        <rect x="7" y="10" width="5" height="4" rx="1" fill="#2f4f3e" />
        <rect x="11" y="10" width="5" height="4" rx="1" fill="#2f4f3e" />
        <rect x="15" y="6" width="5" height="4" rx="1" fill="#2f4f3e" />
      </svg>
    ),
  },
]

function AppContent({ id }: { id: AppId }) {
  switch (id) {
    case 'pear':
      return (
        <div>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-[22px] font-semibold text-[var(--ink)]">
            Pear
          </h2>
          <p>Coming soon. Bu pencereyi sonra dolduracağız.</p>
        </div>
      )
    case 'blindo':
      return (
        <div>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-[22px] font-semibold text-[var(--ink)]">
            Blindo
          </h2>
          <p>Coming soon. Bu pencereyi sonra dolduracağız.</p>
        </div>
      )
    case 'contact':
      return (
        <div>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-[22px] font-semibold text-[var(--ink)]">
            Contact us
          </h2>
          <p className="mb-4">Yazman yeterli.</p>
          <a
            href="mailto:contact@hopestry.studio"
            className="inline-flex rounded-full border border-[var(--panel-edge)] bg-white px-4 py-2 text-[13px] text-[var(--ink)] transition hover:border-[var(--accent)]"
          >
            contact@hopestry.studio
          </a>
        </div>
      )
    case 'about':
      return (
        <div>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-[22px] font-semibold text-[var(--ink)]">
            About us
          </h2>
          <p>
            Hopestry, Ankara merkezli sade bir yazılım stüdyosu. Pear ve Blindo
            üzerinde çalışıyoruz.
          </p>
        </div>
      )
    case 'snake':
      return <SnakeGame />
  }
}

export default function Desktop() {
  const [windows, setWindows] = useState<OpenWindow[]>([])
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  )

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const nextZ = (prev: OpenWindow[]) =>
    (prev.reduce((m, w) => Math.max(m, w.z), 0) || 0) + 1

  const openApp = useCallback((id: AppId) => {
    setWindows((prev) => {
      const z = nextZ(prev)
      if (prev.some((w) => w.id === id)) {
        return prev.map((w) => (w.id === id ? { ...w, z } : w))
      }
      return [...prev, { id, z }]
    })
  }, [])

  const closeApp = (id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const focusApp = (id: AppId) => {
    setWindows((prev) => {
      const z = nextZ(prev)
      return prev.map((w) => (w.id === id ? { ...w, z } : w))
    })
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      {/* Wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 15% 20%, #e7ebe1 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 85% 80%, #cfd6c8 0%, transparent 50%), linear-gradient(165deg, #dfe3d8 0%, #d2d7cb 45%, #c8cec0 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.45%27/%3E%3C/svg%3E")',
        }}
      />

      {/* Menu bar */}
      <header className="absolute inset-x-0 top-0 z-[200] flex h-9 items-center justify-between border-b border-black/10 bg-[#f0f2ec]/80 px-4 text-[12px] backdrop-blur-md">
        <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold tracking-tight text-[var(--ink)]">
          hopestry
        </span>
        <span className="text-[var(--muted)]">{clock}</span>
      </header>

      {/* Icons */}
      <div className="absolute left-4 top-14 z-10 flex flex-col gap-3 sm:left-6 sm:top-16">
        {APPS.map((app) => (
          <DesktopIcon key={app.id} label={app.label} onOpen={() => openApp(app.id)}>
            {app.icon}
          </DesktopIcon>
        ))}
      </div>

      {/* Hint */}
      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[11px] text-[var(--muted)]">
        Çift tıkla · mobilde tek tık
      </p>

      {/* Windows */}
      {windows.map((w) => {
        const meta = APPS.find((a) => a.id === w.id)!
        return (
          <WindowFrame
            key={w.id}
            title={meta.title}
            z={w.z}
            width={meta.width}
            height={meta.height}
            onClose={() => closeApp(w.id)}
            onFocus={() => focusApp(w.id)}
          >
            <AppContent id={w.id} />
          </WindowFrame>
        )
      })}
    </div>
  )
}
