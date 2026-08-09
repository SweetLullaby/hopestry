import type { AppId, OpenWindow } from './types'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import DesktopIcon from './DesktopIcon'
import WindowFrame from './WindowFrame'
import TetrisGame from './TetrisGame'
import LanguageSwitcher from './LanguageSwitcher'
import ContactForm from './ContactForm'
import { getInitialLang, translations, type Lang } from './i18n'

const IG_URL = 'https://www.instagram.com/hopestry.studio'

const APPS: {
  id: AppId
  width?: number
  height?: number
  tile: string
  icon: ReactNode
}[] = [
  {
    id: 'about',
    width: 420,
    height: 280,
    tile: 'linear-gradient(145deg, #5a5044 0%, #2a241e 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="7.5" stroke="#f0e6d6" strokeWidth="1.7" />
        <path
          d="M12 10.5v5"
          stroke="#f0e6d6"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7.8" r="1.1" fill="#f0e6d6" />
      </svg>
    ),
  },
  {
    id: 'contact',
    width: 400,
    height: 200,
    tile: 'linear-gradient(145deg, #4a5560 0%, #22282e 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2.5"
          stroke="#e4e7eb"
          strokeWidth="1.7"
        />
        <path
          d="M4 8l8 5.5L20 8"
          stroke="#e4e7eb"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'instagram',
    width: 380,
    height: 280,
    tile: 'linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 75%, #515bd4 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="white"
          strokeWidth="1.7"
        />
        <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="1.15" fill="white" />
      </svg>
    ),
  },
  {
    id: 'blindo',
    tile: '#000000',
    icon: (
      <img
        src="/blindo-logo.png"
        alt=""
        className="h-full w-full rounded-[18px] object-cover"
        draggable={false}
      />
    ),
  },
  {
    id: 'pear',
    tile: '#C8F53D',
    icon: (
      <img
        src="/pear-logo.svg"
        alt=""
        className="h-full w-full rounded-[18px] object-cover"
        draggable={false}
      />
    ),
  },
  {
    id: 'tetris',
    width: 280,
    height: 420,
    tile: 'linear-gradient(145deg, #3a4a7a 0%, #151a2e 100%)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4" y="4" width="5" height="5" rx="1" fill="#5ec8e8" />
        <rect x="9.5" y="4" width="5" height="5" rx="1" fill="#5ec8e8" />
        <rect x="15" y="4" width="5" height="5" rx="1" fill="#5ec8e8" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="#5ec8e8" />
        <rect x="4" y="15" width="5" height="5" rx="1" fill="#a78bfa" />
        <rect x="9.5" y="15" width="5" height="5" rx="1" fill="#a78bfa" />
        <rect x="15" y="15" width="5" height="5" rx="1" fill="#e89a5e" />
      </svg>
    ),
  },
]

function AppContent({ id, lang }: { id: AppId; lang: Lang }) {
  const t = translations[lang]

  switch (id) {
    case 'pear':
      return (
        <div>
          <img
            src="/pear-logo.svg"
            alt="Pear"
            className="mb-4 h-16 w-16 rounded-2xl object-cover shadow-md"
            draggable={false}
          />
          <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--panel-muted)]">
            {t.product}
          </p>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-tight text-[var(--panel-ink)]">
            {t.apps.pear.title}
          </h2>
          <p>{t.comingSoon}</p>
        </div>
      )
    case 'blindo':
      return (
        <div>
          <img
            src="/blindo-logo.png"
            alt="Blindo"
            className="mb-4 h-16 w-16 rounded-2xl object-cover shadow-md"
            draggable={false}
          />
          <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--panel-muted)]">
            {t.product}
          </p>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-tight text-[var(--panel-ink)]">
            {t.apps.blindo.title}
          </h2>
          <p>{t.comingSoon}</p>
        </div>
      )
    case 'contact':
      return <ContactForm />
    case 'about':
      return (
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--panel-muted)]">
            {t.studio}
          </p>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-tight text-[var(--panel-ink)]">
            {t.apps.about.title}
          </h2>
          <p>{t.aboutBody}</p>
        </div>
      )
    case 'instagram':
      return (
        <div className="flex h-full flex-col items-start">
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
            style={{
              background:
                'linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 75%, #515bd4 100%)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="white"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="1.7" />
              <circle cx="17.2" cy="6.8" r="1.15" fill="white" />
            </svg>
          </div>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-tight text-[var(--panel-ink)]">
            {t.apps.instagram.title}
          </h2>
          <p className="mb-5">@hopestry.studio</p>
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[var(--panel-ink)] px-5 py-2.5 text-[13px] text-white transition hover:opacity-85"
          >
            {t.openProfile}
          </a>
        </div>
      )
    case 'tetris':
      return <TetrisGame />
  }
}

export default function Desktop() {
  const [windows, setWindows] = useState<OpenWindow[]>([])
  const [lang, setLang] = useState<Lang>(() => getInitialLang())
  const t = translations[lang]
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  )

  useEffect(() => {
    localStorage.setItem('hopestry-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const locale = lang === 'tr' ? 'tr-TR' : 'en-GB'
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    }
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [lang])

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
            'radial-gradient(ellipse 80% 55% at 12% 18%, rgba(125,155,134,0.35) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 88% 12%, rgba(120,100,80,0.28) 0%, transparent 50%), radial-gradient(ellipse 60% 45% at 70% 85%, rgba(60,80,90,0.4) 0%, transparent 55%), linear-gradient(160deg, #232a26 0%, #171b18 48%, #101311 100%)',
        }}
      />
      <div className="orb-drift pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(125,155,134,0.22),transparent_70%)] blur-2xl" />
      <div
        className="orb-drift pointer-events-none absolute -right-16 bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(180,140,90,0.16),transparent_70%)] blur-2xl"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.5%27/%3E%3C/svg%3E")',
        }}
      />

      {/* Brand watermark */}
      <div className="pointer-events-none absolute bottom-24 right-6 select-none sm:bottom-28 sm:right-10">
        <p className="font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,7rem)] font-bold leading-none tracking-[-0.06em] text-white/[0.06]">
          hopestry
        </p>
      </div>

      {/* Menu bar */}
      <header className="absolute inset-x-0 top-0 z-[200] flex h-10 items-center justify-between border-b border-white/10 bg-black/25 px-4 text-[12px] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold tracking-tight text-white">
            hopestry
          </span>
          <span className="hidden text-white/45 sm:inline">{t.studioOs}</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher lang={lang} onChange={setLang} />
          <span className="tabular-nums text-white/70">{clock}</span>
        </div>
      </header>

      {/* Icons */}
      <div className="absolute left-3 top-14 z-10 flex flex-col gap-2 sm:left-5 sm:top-16 sm:gap-3">
        {APPS.map((app, i) => (
          <DesktopIcon
            key={app.id}
            label={t.apps[app.id].label}
            delay={80 + i * 60}
            onOpen={() => openApp(app.id)}
          >
            <span
              className="flex h-full w-full items-center justify-center rounded-[18px]"
              style={{ background: app.tile }}
            >
              {app.icon}
            </span>
          </DesktopIcon>
        ))}
      </div>

      {/* Windows */}
      {windows.map((w) => {
        const meta = APPS.find((a) => a.id === w.id)!
        return (
          <WindowFrame
            key={w.id}
            title={t.apps[w.id].title}
            z={w.z}
            width={meta.width}
            height={meta.height}
            onClose={() => closeApp(w.id)}
            onFocus={() => focusApp(w.id)}
          >
            <AppContent id={w.id} lang={lang} />
          </WindowFrame>
        )
      })}
    </div>
  )
}
