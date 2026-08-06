import { useEffect, useRef, useState } from 'react'

interface UseTypewriterOptions {
  speed?: number
  startDelay?: number
}

interface UseTypewriterResult {
  displayed: string
  done: boolean
}

/**
 * Reveals `text` one character at a time.
 * - Waits `startDelay` ms before the first character appears.
 * - Reveals one character every `speed` ms after that.
 */
export function useTypewriter(
  text: string,
  { speed = 38, startDelay = 600 }: UseTypewriterOptions = {},
): UseTypewriterResult {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    let intervalId: ReturnType<typeof setInterval> | undefined

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        indexRef.current += 1
        setDisplayed(text.slice(0, indexRef.current))

        if (indexRef.current >= text.length) {
          if (intervalId) clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
