import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ParticleWord, { type ParticleWordHandle } from './ParticleWord'
import MobileSite from './MobileSite'
import LanguageSwitcher from '../desktop/LanguageSwitcher'
import { getInitialLang, translations, type Lang } from '../desktop/i18n'
import {
  SECTIONS,
  SECTION_COLOR,
  SectionContent,
  sectionAccent,
  sectionTagline,
  sectionWord,
  type SectionId,
} from './content'

const CYCLE: SectionId[] = ['about', 'pear', 'strobe']
// Wheel distance needed to move to the next word, and the pause after each change.
const WHEEL_STEP = 60
const WHEEL_COOLDOWN_MS = 650
const DESKTOP_QUERY = '(min-width: 768px)'

function sectionFromPath(pathname: string): SectionId | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  if (slug === 'instagram') return 'contact'
  return (SECTIONS as string[]).includes(slug) ? (slug as SectionId) : null
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

function useViewportWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

export default function Site() {
  const location = useLocation()
  const navigate = useNavigate()
  const section = sectionFromPath(location.pathname)

  const [lang, setLang] = useState<Lang>(() => getInitialLang())
  const t = translations[lang]
  const isDesktop = useMedia(DESKTOP_QUERY)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const vw = useViewportWidth()
  const [preview, setPreview] = useState<SectionId | null>(null)
  const [cycleIdx, setCycleIdx] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem('hopestry-lang', lang)
    } catch {
      /* storage may be blocked */
    }
    document.documentElement.lang = lang
  }, [lang])

  // On the desktop home page the mouse wheel moves through the studio and its products.
  const particles = useRef<ParticleWordHandle>(null)
  const wheelOn = isDesktop && !section
  useEffect(() => {
    if (!wheelOn) return
    let acc = 0
    let lockedUntil = 0
    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      particles.current?.disturb(Math.max(-12, Math.min(12, dy * 0.15)))
      const now = performance.now()
      if (now < lockedUntil) return
      acc += dy
      if (Math.abs(acc) < WHEEL_STEP) return
      const dir = acc > 0 ? 1 : -1
      acc = 0
      lockedUntil = now + WHEEL_COOLDOWN_MS
      setPreview(null)
      setCycleIdx((i) => (i + dir + CYCLE.length) % CYCLE.length)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [wheelOn])

  useEffect(() => {
    document.title = section ? `hopestry · ${section === 'about' ? t.site.nav.about : sectionWord(section, lang)}` : 'hopestry'
  }, [section, lang, t])

  useEffect(() => {
    if (!section) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [section, navigate])

  const shown: SectionId = (isDesktop ? preview : null) ?? section ?? CYCLE[cycleIdx]
  const word = sectionWord(shown, lang)
  const color = SECTION_COLOR[shown]
  const tagline = sectionTagline(shown, lang)

  const open = (id: SectionId) => {
    if (id === section) return
    navigate(`/${id}`)
  }

  const navItems = SECTIONS.map((id) => ({ id, label: t.site.nav[id] }))

  if (isDesktop) {
    const panelW = Math.min(480, Math.max(380, Math.round(vw * 0.38)))
    const panelOpen = !!section

    return (
      <div className="relative h-[100svh] w-full overflow-hidden bg-[#0b0c0d] font-[family-name:var(--font-site)] text-[#ecebe6]">
        <ParticleWord ref={particles} word={word} color={color} accent={sectionAccent(shown)} rightInset={panelOpen ? panelW : 0} />

        <header
          className="pointer-events-none absolute left-0 top-0 z-20 flex items-center justify-between px-8 pt-6 transition-[right] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ right: panelOpen ? panelW : 0 }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="pointer-events-auto text-[17px] font-semibold tracking-[-0.02em] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
          >
            hopestry
          </button>
          <nav className="pointer-events-auto flex items-center gap-7 text-[14px]">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => open(id)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setPreview(id)}
                onPointerLeave={() => setPreview(null)}
                aria-current={section === id ? 'page' : undefined}
                className={`transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 ${
                  section === id ? 'underline decoration-1 underline-offset-[6px] opacity-100' : 'opacity-60'
                }`}
                style={section === id ? { color: SECTION_COLOR[id] } : undefined}
              >
                {label}
              </button>
            ))}
            <LanguageSwitcher lang={lang} onChange={setLang} />
          </nav>
        </header>

        <div
          className="pointer-events-none absolute bottom-0 left-0 z-10 flex items-end justify-between gap-8 px-8 pb-7 transition-[right] duration-500"
          style={{ right: panelOpen ? panelW : 0 }}
        >
          <p
            className="max-w-[min(46rem,60%)] font-[family-name:var(--font-serif)] text-[clamp(26px,3.2vw,46px)] leading-[1] transition-colors duration-500"
            style={{ color: shown === 'about' ? '#ecebe6' : color }}
          >
            {tagline}
          </p>
        </div>

        <aside
          aria-hidden={!panelOpen}
          className={`absolute inset-y-0 right-0 z-30 flex flex-col transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            panelOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-10 opacity-0'
          }`}
          style={{ width: panelW }}
        >
          <div className="flex items-center justify-end px-8 pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              tabIndex={panelOpen ? 0 : -1}
              className="text-[14px] opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100"
            >
              {t.site.close}
            </button>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-10 pt-8">
            <div className="my-auto">
              {section && <SectionContent id={section} lang={lang} onOpen={open} />}
            </div>
          </div>
        </aside>
      </div>
    )
  }

  return <MobileSite lang={lang} setLang={setLang} section={section} reduced={reduced} />
}
