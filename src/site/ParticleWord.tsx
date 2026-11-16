import { useEffect, useRef } from 'react'

/**
 * A word drawn with thousands of dots. When `word` changes the dots scatter
 * and re-form into the new word; the pointer (mouse or finger) pushes them
 * away and they spring back.
 */

type ParticleWordProps = {
  word: string
  color: string
  /** Pixels on the right that the word should keep clear of (e.g. an open panel). */
  rightInset?: number
  count?: number
}

const BG = [11, 12, 13] as const
const FONT_FAMILY = '"Inter Tight", "Helvetica Neue", Arial, sans-serif'

type Engine = {
  setTarget: (word: string, color: string, rightInset: number) => void
  destroy: () => void
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function createEngine(canvas: HTMLCanvasElement, N: number): Engine {
  const ctx = canvas.getContext('2d')!
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  let W = 0
  let H = 0
  let gap = 4
  let word = ''
  let inset = 0
  let ready = false
  let settled = false
  let fontsReady = false
  let visible = true
  let raf = 0

  const xs = new Float32Array(N)
  const ys = new Float32Array(N)
  const vxs = new Float32Array(N)
  const vys = new Float32Array(N)
  const txs = new Float32Array(N)
  const tys = new Float32Array(N)

  const col = [236, 235, 230]
  let targetCol = [236, 235, 230]

  const pointer = { x: 0, y: 0, active: false }

  function clearFull() {
    ctx.fillStyle = `rgb(${BG[0]},${BG[1]},${BG[2]})`
    ctx.fillRect(0, 0, W, H)
  }

  function sample() {
    if (!W || !H || !word || !fontsReady) return
    const areaW = Math.max(120, W - inset)
    const ow = Math.ceil(areaW)
    const oh = Math.ceil(H)
    const off = document.createElement('canvas')
    off.width = ow
    off.height = oh
    const o = off.getContext('2d', { willReadFrequently: true })!

    let fs = H * 0.55
    o.font = `800 ${fs}px ${FONT_FAMILY}`
    const measured = o.measureText(word).width
    if (measured > areaW * 0.84) {
      fs *= (areaW * 0.84) / measured
      o.font = `800 ${fs}px ${FONT_FAMILY}`
    }
    const m = o.measureText(word)
    const asc = m.actualBoundingBoxAscent || fs * 0.72
    const desc = m.actualBoundingBoxDescent || 0
    o.textAlign = 'center'
    o.textBaseline = 'alphabetic'
    o.fillStyle = '#fff'
    o.fillText(word, ow / 2, oh / 2 + (asc - desc) / 2)

    const data = o.getImageData(0, 0, ow, oh).data
    let filled = 0
    for (let y = 0; y < oh; y += 2)
      for (let x = 0; x < ow; x += 2) if (data[(y * ow + x) * 4 + 3] > 128) filled++
    gap = Math.max(2, Math.sqrt((filled * 4) / N))

    const pts: number[] = []
    for (let y = gap / 2; y < oh; y += gap)
      for (let x = gap / 2; x < ow; x += gap) {
        if (data[((y | 0) * ow + (x | 0)) * 4 + 3] > 128) pts.push(x, y)
      }
    const len = pts.length / 2
    if (!len) return

    // Shuffle point order so particles travel to random places when morphing.
    const order = new Uint32Array(len)
    for (let i = 0; i < len; i++) order[i] = i
    for (let i = len - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0
      const t = order[i]
      order[i] = order[j]
      order[j] = t
    }
    for (let i = 0; i < N; i++) {
      const k = order[i % len]
      txs[i] = pts[k * 2]
      tys[i] = pts[k * 2 + 1]
    }
    ready = true

    if (reduced || !settled) {
      xs.set(txs)
      ys.set(tys)
      vxs.fill(0)
      vys.fill(0)
      settled = true
      if (reduced) {
        col.splice(0, 3, ...targetCol)
        draw(true)
      }
    } else {
      for (let i = 0; i < N; i++) {
        vxs[i] += (Math.random() - 0.5) * 16
        vys[i] += (Math.random() - 0.5) * 16
      }
    }
  }

  function draw(full: boolean) {
    if (full) clearFull()
    else {
      ctx.fillStyle = `rgba(${BG[0]},${BG[1]},${BG[2]},0.32)`
      ctx.fillRect(0, 0, W, H)
    }
    ctx.fillStyle = `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`
    const s = Math.min(3, Math.max(1.2, gap * 0.45))
    const h = s / 2
    for (let i = 0; i < N; i++) ctx.fillRect(xs[i] - h, ys[i] - h, s, s)
  }

  function step() {
    for (let c = 0; c < 3; c++) col[c] += (targetCol[c] - col[c]) * 0.08
    const R = Math.max(60, Math.min(W, H) * 0.2)
    const R2 = R * R
    const px = pointer.x
    const py = pointer.y
    const push = pointer.active
    for (let i = 0; i < N; i++) {
      let vx = vxs[i] + (txs[i] - xs[i]) * 0.045
      let vy = vys[i] + (tys[i] - ys[i]) * 0.045
      if (push) {
        const dx = xs[i] - px
        const dy = ys[i] - py
        const d2 = dx * dx + dy * dy
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const f = (1 - d / R) * 7
          vx += (dx / d) * f
          vy += (dy / d) * f
        }
      }
      vx *= 0.8
      vy *= 0.8
      vxs[i] = vx
      vys[i] = vy
      xs[i] += vx
      ys[i] += vy
    }
  }

  function frame() {
    raf = requestAnimationFrame(frame)
    if (!ready || !visible || document.hidden) return
    step()
    draw(false)
  }

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h || (Math.abs(w - W) < 1 && Math.abs(h - H) < 1)) return
    W = w
    H = h
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    clearFull()
    settled = false
    sample()
  }

  // Pointer handling: mouse pushes on hover, touch pushes while the finger is down.
  function setPointer(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    pointer.x = e.clientX - r.left
    pointer.y = e.clientY - r.top
    pointer.active = true
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || e.buttons) setPointer(e)
  }
  const onDown = (e: PointerEvent) => setPointer(e)
  const onEnd = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.type === 'pointerleave') pointer.active = false
  }
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointerup', onEnd)
  canvas.addEventListener('pointercancel', onEnd)
  canvas.addEventListener('pointerleave', onEnd)

  // Start every dot scattered so the first word assembles itself.
  for (let i = 0; i < N; i++) {
    xs[i] = Math.random() * 1600
    ys[i] = Math.random() * 900
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
  })
  io.observe(canvas)

  const fontTimer = window.setTimeout(() => {
    if (!fontsReady) {
      fontsReady = true
      sample()
    }
  }, 1500)
  ;(document.fonts?.load(`800 100px ${FONT_FAMILY}`) ?? Promise.resolve())
    .catch(() => undefined)
    .then(() => {
      window.clearTimeout(fontTimer)
      if (!fontsReady) {
        fontsReady = true
        sample()
      }
    })

  if (!reduced) raf = requestAnimationFrame(frame)

  return {
    setTarget(nextWord, color, nextInset) {
      targetCol = hexToRgb(color)
      const changed = nextWord !== word || nextInset !== inset
      word = nextWord
      inset = nextInset
      if (changed) sample()
      else if (reduced) {
        col.splice(0, 3, ...targetCol)
        draw(true)
      }
    },
    destroy() {
      cancelAnimationFrame(raf)
      window.clearTimeout(fontTimer)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onEnd)
      canvas.removeEventListener('pointercancel', onEnd)
      canvas.removeEventListener('pointerleave', onEnd)
    },
  }
}

export default function ParticleWord({
  word,
  color,
  rightInset = 0,
  count = 2400,
}: ParticleWordProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)

  useEffect(() => {
    const engine = createEngine(canvasRef.current!, count)
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [count])

  useEffect(() => {
    engineRef.current?.setTarget(word, color, rightInset)
  }, [word, color, rightInset, count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 block h-full w-full"
      style={{ touchAction: 'pan-y' }}
    />
  )
}
