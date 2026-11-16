import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ParticleWord from './ParticleWord'
import LanguageSwitcher from '../desktop/LanguageSwitcher'
import { getInitialLang, translations, type Lang } from '../desktop/i18n'
import {
  SECTIONS,
  SECTION_COLOR,
  SectionContent,
  sectionTagline,
  sectionWord,
  type SectionId,
} from './content'

const CYCLE: SectionId[] = ['about', 'pear', 'strobe']
const CYCLE_MS = 4800
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
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem('hopestry-lang', lang)
    } catch {
      /* storage may be blocked */
    }
    document.documentElement.lang = lang
  }, [lang])

  // On the home page the word cycles through the studio and its products.
  const cycling = !section && !preview && !reduced
  useEffect(() => {
    if (!cycling) return
    const id = window.setInterval(() => setCycleIdx((i) => (i + 1) % CYCLE.length), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [cycling])

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
    if (!isDesktop) scrollRef.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  const navItems = SECTIONS.map((id) => ({ id, label: t.site.nav[id] }))

  if (isDesktop) {
    const panelW = Math.min(480, Math.max(380, Math.round(vw * 0.38)))
    const panelOpen = !!section

    return (
      <div className="relative h-[100svh] w-full overflow-hidden bg-[#0b0c0d] font-[family-name:var(--font-site)] text-[#ecebe6]">
        <ParticleWord word={word} color={color} rightInset={panelOpen ? panelW : 0} />

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

  // ---------- Mobile: one vertical page; word on top, content below ----------
  const current = section ?? 'about'
  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 overflow-y-auto overscroll-y-contain bg-[#0b0c0d] font-[family-name:var(--font-site)] text-[#ecebe6]"
    >
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#0b0c0d] px-4">
        <button type="button" onClick={() => navigate('/')} className="text-[17px] font-semibold tracking-[-0.02em]">
          hopestry
        </button>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </header>

      <div className="relative h-[46svh] min-h-[280px] max-h-[520px]">
        <ParticleWord word={word} color={color} count={1500} />
        <p className="pointer-events-none absolute bottom-3 right-4 text-[12px] text-white/35">
          {t.site.hintTouch}
        </p>
      </div>

      {!section && (
        <p
          className="px-4 pb-5 font-[family-name:var(--font-serif)] text-[30px] leading-[1.02] transition-colors duration-500"
          style={{ color: shown === 'about' ? '#ecebe6' : color }}
        >
          {tagline}
        </p>
      )}

      <nav className="sticky top-14 z-20 flex gap-2 overflow-x-auto bg-[#0b0c0d] px-4 py-3 [scrollbar-width:none]">
        {navItems.map(({ id, label }) => {
          const active = current === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => (id === 'about' && !section ? undefined : open(id))}
              aria-current={active ? 'page' : undefined}
              className="shrink-0 rounded-full px-4 py-1.5 text-[14px] transition"
              style={
                active
                  ? { background: SECTION_COLOR[id], color: '#0b0c0d' }
                  : { background: 'rgba(255,255,255,0.07)', color: 'rgba(236,235,230,0.8)' }
              }
            >
              {label}
            </button>
          )
        })}
      </nav>

      <main className="px-4 pb-[max(4rem,env(safe-area-inset-bottom))] pt-8">
        <SectionContent id={current} lang={lang} onOpen={open} />
      </main>
    </div>
  )
}
