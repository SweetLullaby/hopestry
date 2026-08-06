import { useEffect, useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import CopyIcon from './CopyIcon'

const TYPEWRITER_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?'

const WHITE_PILLS = ['Pear', 'Blindo']

const EMAIL = 'hello@hopestry.studio'

export default function Hero() {
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT, {
    speed: 38,
    startDelay: 600,
  })
  const [pillsVisible, setPillsVisible] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setPillsVisible(true), 400)
    return () => clearTimeout(id)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
  }

  return (
    <section className="relative z-[1] flex h-[100svh] flex-col overflow-hidden px-5 sm:px-8 md:px-10">
      {/* Copy sits above the fixed bottom pills */}
      <div className="flex min-h-0 flex-1 flex-col justify-end pb-4 pt-24 md:justify-center md:pb-28">
        <div className="relative z-10 max-w-xl">
          <p
            className="pointer-events-none mb-5 select-none text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&apos;s Adaptive Response Interface Agent
          </p>

          <p
            className="mb-5 text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '54px',
            }}
          >
            {displayed}
            {!done && (
              <span className="ml-[2px] inline-block h-[1.1em] w-[2px] animate-blink bg-black align-middle" />
            )}
          </p>
        </div>
      </div>

      {/* Pear / Blindo / Reach us — always pinned to bottom */}
      <div
        className="relative z-10 shrink-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2"
        style={{
          opacity: pillsVisible ? 1 : 0,
          transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div className="flex flex-wrap gap-y-1">
          {WHITE_PILLS.map((label) => (
            <button
              key={label}
              type="button"
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleCopy}
            className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
          >
            <span>
              Reach us:{' '}
              <span className="underline underline-offset-1">{EMAIL}</span>
            </span>
            <CopyIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
