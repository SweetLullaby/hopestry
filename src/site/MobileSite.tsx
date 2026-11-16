import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParticleWord, { type ParticleWordHandle } from './ParticleWord'
import LanguageSwitcher from '../desktop/LanguageSwitcher'
import { translations, type Lang } from '../desktop/i18n'
import { SECTIONS, SECTION_COLOR, SectionContent, sectionTagline, sectionWord, type SectionId } from './content'

/**
 * Phone layout: one scrolling page. The dotted word stays fixed in the top
 * half; scrolling makes the dots stream, and each section morphs the word
 * into its own name as it comes up.
 */

// The word lives in the top part of the screen; content starts below it.
const WORD_AREA = 0.4
// A section becomes active when its top passes this point of the screen.
const ACTIVATE_AT = 0.62

type Props = {
  lang: Lang
  setLang: (lang: Lang) => void
  section: SectionId | null
  reduced: boolean
}

export default function MobileSite({ lang, setLang, section, reduced }: Props) {
  const t = translations[lang]
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const particles = useRef<ParticleWordHandle>(null)
  const blocks = useRef<Partial<Record<SectionId, HTMLElement>>>({})
  const [active, setActive] = useState<SectionId>(section ?? 'about')
  const activeRef = useRef(active)

  // Deep links (/pear, /strobe, …) open the page scrolled to that section.
  useLayoutEffect(() => {
    if (!section || section === 'about') return
    const jump = () => {
      const el = blocks.current[section]
      if (el && scrollRef.current) scrollRef.current.scrollTop = el.offsetTop
    }
    jump()
    // Fonts and images change the text height while loading; keep the
    // section in place until the visitor scrolls on their own.
    const scroller = scrollRef.current
    let touched = false
    const stop = () => {
      touched = true
    }
    scroller?.addEventListener('touchstart', stop, { passive: true, once: true })
    scroller?.addEventListener('wheel', stop, { passive: true, once: true })
    const again = () => {
      if (!touched) jump()
    }
    document.fonts?.ready.then(again).catch(() => undefined)
    const timers = [250, 700, 1500].map((ms) => window.setTimeout(again, ms))
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      scroller?.removeEventListener('touchstart', stop)
      scroller?.removeEventListener('wheel', stop)
    }
    // Only on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    let last = scroller.scrollTop
    let frame = 0

    const update = () => {
      frame = 0
      const top = scroller.scrollTop
      const dy = top - last
      last = top
      if (dy) particles.current?.disturb(dy)

      const line = top + scroller.clientHeight * ACTIVATE_AT
      let current: SectionId = 'about'
      for (const id of SECTIONS) {
        const el = blocks.current[id]
        if (el && el.offsetTop <= line) current = id
      }
      if (current !== activeRef.current) {
        activeRef.current = current
        setActive(current)
        navigate(current === 'about' ? '/' : `/${current}`, { replace: true })
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [navigate])

  const goTo = (id: SectionId) => {
    const el = blocks.current[id]
    if (!el || !scrollRef.current) return
    scrollRef.current.scrollTo({ top: id === 'about' ? 0 : el.offsetTop, behavior: reduced ? 'auto' : 'smooth' })
  }

  const fade = `linear-gradient(to bottom, transparent 0%, transparent ${WORD_AREA * 100 - 12}%, #000 ${WORD_AREA * 100 - 3}%, #000 100%)`

  return (
    <div className="fixed inset-0 bg-[#0b0c0d] font-[family-name:var(--font-site)] text-[#ecebe6]">
      {/* Dotted word: fixed, sized to the large viewport so the browser bar doesn't resize it. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[100lvh]">
        <ParticleWord
          ref={particles}
          word={sectionWord(active, lang)}
          color={SECTION_COLOR[active]}
          heightRatio={WORD_AREA}
          count={1500}
        />
      </div>

      {/* Content scrolls over the lower half and fades out as it reaches the word. */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto overscroll-y-contain [scrollbar-width:none]"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        {SECTIONS.map((id) => (
          <section
            key={id}
            ref={(el) => {
              if (el) blocks.current[id] = el
            }}
            className="flex min-h-[100svh] flex-col gap-6 px-5"
            style={{ paddingTop: `${WORD_AREA * 100 - 2}svh`, paddingBottom: id === 'contact' ? '30svh' : '14svh' }}
          >
            {id === 'about' && (
              <p className="font-[family-name:var(--font-serif)] text-[34px] leading-[1.02] text-[#ecebe6]">
                {sectionTagline('about', lang)}
              </p>
            )}
            <SectionContent id={id} lang={lang} onOpen={goTo} />
          </section>
        ))}
      </div>

      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
        <button type="button" onClick={() => goTo('about')} className="text-[17px] font-semibold tracking-[-0.02em]">
          hopestry
        </button>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex justify-between px-5 pt-8"
        style={{
          paddingBottom: 'max(18px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, #0b0c0d 55%, rgba(11,12,13,0))',
        }}
      >
        {SECTIONS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => goTo(id)}
            aria-current={active === id ? 'true' : undefined}
            className="text-[15px] transition-colors duration-300"
            style={{ color: active === id ? SECTION_COLOR[id] : 'rgba(236,235,230,0.45)' }}
          >
            {t.site.nav[id]}
          </button>
        ))}
      </nav>
    </div>
  )
}
