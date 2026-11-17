import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

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
  /** Share of the canvas height (from the top) the word is laid out in. */
  heightRatio?: number
  count?: number
  /** If set, a small dot in this color is drawn after the word. */
  accent?: string
  /** Image URL of a logo drawn with dots before the word (its dark pixels become dots). */
  mark?: string
}

const BG = [11, 12, 13] as const
const FONT_FAMILY = '"Inter Tight", "Helvetica Neue", Arial, sans-serif'

type Engine = {
  setTarget: (word: string, color: string, rightInset: number, accent?: string, mark?: string) => void
  disturb: (dy: number) => void
  destroy: () => void
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Turns a logo image into a white mask of its dark pixels, cropped to the shape. */
const markCache = new Map<string, Promise<HTMLCanvasElement | null>>()
function loadMark(url: string) {
  let p = markCache.get(url)
  if (!p) {
    p = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const w = img.naturalWidth
        const h = img.naturalHeight
        const c = document.createElement('canvas')
        c.width = w
        c.height = h
        const x = c.getContext('2d', { willReadFrequently: true })!
        x.drawImage(img, 0, 0)
        const d = x.getImageData(0, 0, w, h)
        let x0 = w, y0 = h, x1 = 0, y1 = 0
        for (let i = 0; i < w * h; i++) {
          const k = i * 4
          const dark = d.data[k + 3] > 128 && d.data[k] + d.data[k + 1] + d.data[k + 2] < 300
          d.data[k] = d.data[k + 1] = d.data[k + 2] = 255
          d.data[k + 3] = dark ? 255 : 0
          if (dark) {
            const px = i % w
            const py = (i / w) | 0
            if (px < x0) x0 = px
            if (px > x1) x1 = px
            if (py < y0) y0 = py
            if (py > y1) y1 = py
          }
        }
        if (x1 < x0) return resolve(null)
        x.putImageData(d, 0, 0)
        const out = document.createElement('canvas')
        out.width = x1 - x0 + 1
        out.height = y1 - y0 + 1
        out.getContext('2d')!.drawImage(c, -x0, -y0)
        resolve(out)
      }
      img.onerror = () => resolve(null)
      img.src = url
    })
    markCache.set(url, p)
  }
  return p
}

function createEngine(canvas: HTMLCanvasElement, N: number, heightRatio: number): Engine {
  const ctx = canvas.getContext('2d')!
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  let W = 0
  let H = 0
  let gap = 4
  let word = ''
  let inset = 0
  let accent = ''
  let markUrl = ''
  let mark: HTMLCanvasElement | null = null
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
  // 1 for dots that belong to the accent dot after the word.
  const isAccent = new Uint8Array(N)
  let accentCount = 0

  const col = [236, 235, 230]
  let targetCol = [236, 235, 230]
  const accCol = [236, 235, 230]
  let accTarget = [236, 235, 230]

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
    const areaH = H * heightRatio
    const off = document.createElement('canvas')
    off.width = ow
    off.height = oh
    const o = off.getContext('2d', { willReadFrequently: true })!

    // Narrow (phone) layouts let the word use more of the width.
    const fit = heightRatio < 1 ? 0.92 : 0.84
    // Accent dot: radius and gap scale with the font size.
    const dotR = (f: number) => (accent ? f * 0.1 : 0)
    const dotGap = (f: number) => (accent ? f * 0.05 : 0)
    let fs = areaH * (heightRatio < 1 ? 0.62 : 0.55)
    o.font = `800 ${fs}px ${FONT_FAMILY}`
    // Logo before the word: about as tall as the word's capitals, with a gap.
    const markH = (f: number) => (mark ? f * 1.1 : 0)
    const markW = (f: number) => (mark ? (markH(f) * mark.width) / mark.height : 0)
    const markGap = (f: number) => (mark ? f * 0.2 : 0)
    const total = (f: number, w: number) => markW(f) + markGap(f) + w + dotGap(f) + dotR(f) * 2
    const measured = total(fs, o.measureText(word).width)
    if (measured > areaW * fit) {
      fs *= (areaW * fit) / measured
      o.font = `800 ${fs}px ${FONT_FAMILY}`
    }
    const m = o.measureText(word)
    const asc = m.actualBoundingBoxAscent || fs * 0.72
    const desc = m.actualBoundingBoxDescent || 0
    const baseline = areaH / 2 + (asc - desc) / 2
    const groupX = (ow - total(fs, m.width)) / 2
    const startX = groupX + markW(fs) + markGap(fs)
    o.textAlign = 'left'
    o.textBaseline = 'alphabetic'
    o.fillStyle = '#fff'
    o.fillText(word, startX, baseline)
    // Logo: centered on the word's x-height band.
    let markBox: [number, number, number, number] | null = null
    if (mark) {
      const mh = markH(fs)
      const mw = markW(fs)
      const my = baseline - fs * 0.36 - mh / 2
      o.imageSmoothingEnabled = true
      o.drawImage(mark, groupX, my, mw, mh)
      markBox = [Math.floor(groupX), Math.floor(my), Math.ceil(groupX + mw), Math.ceil(my + mh)]
    }

    const data = o.getImageData(0, 0, ow, oh).data
    // The dot is sampled from its own layer so its dots can be colored apart.
    let dotData: Uint8ClampedArray | null = null
    if (accent) {
      o.clearRect(0, 0, ow, oh)
      const r = dotR(fs)
      o.beginPath()
      o.arc(startX + m.width + dotGap(fs) + r, baseline - r, r, 0, Math.PI * 2)
      o.fill()
      dotData = o.getImageData(0, 0, ow, oh).data
    }
    let filled = 0
    for (let y = 0; y < oh; y += 2)
      for (let x = 0; x < ow; x += 2) if (data[(y * ow + x) * 4 + 3] > 128) filled++
    gap = Math.max(2, Math.sqrt((filled * 4) / N))

    const pts: number[] = []
    const flags: number[] = []
    for (let y = gap / 2; y < oh; y += gap)
      for (let x = gap / 2; x < ow; x += gap) {
        const idx = ((y | 0) * ow + (x | 0)) * 4 + 3
        if (markBox && x >= markBox[0] && x <= markBox[2] && y >= markBox[1] && y <= markBox[3]) {
          if (cellFilled(data, ow, oh, x, y, gap)) {
            pts.push(x, y)
            flags.push(0)
          }
        } else if (data[idx] > 128) {
          pts.push(x, y)
          flags.push(0)
        } else if (dotData && dotData[idx] > 128) {
          pts.push(x, y)
          flags.push(1)
        }
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
    accentCount = 0
    for (let i = 0; i < N; i++) {
      const k = order[i % len]
      txs[i] = pts[k * 2]
      tys[i] = pts[k * 2 + 1]
      isAccent[i] = flags[k]
      accentCount += flags[k]
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
        accCol.splice(0, 3, ...accTarget)
        draw(true)
      }
    } else {
      for (let i = 0; i < N; i++) {
        vxs[i] += (Math.random() - 0.5) * 16
        vys[i] += (Math.random() - 0.5) * 16
      }
    }
  }

  // True if any pixel in the grid cell around (x, y) is filled.
  function cellFilled(data: Uint8ClampedArray, ow: number, oh: number, x: number, y: number, g: number) {
    const r = Math.max(1, (g / 2) | 0)
    const xa = Math.max(0, (x - r) | 0)
    const xb = Math.min(ow - 1, (x + r) | 0)
    const ya = Math.max(0, (y - r) | 0)
    const yb = Math.min(oh - 1, (y + r) | 0)
    for (let yy = ya; yy <= yb; yy++)
      for (let xx = xa; xx <= xb; xx++) if (data[(yy * ow + xx) * 4 + 3] > 128) return true
    return false
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
    for (let i = 0; i < N; i++) if (!isAccent[i]) ctx.fillRect(xs[i] - h, ys[i] - h, s, s)
    if (accentCount) {
      ctx.fillStyle = `rgb(${accCol[0] | 0},${accCol[1] | 0},${accCol[2] | 0})`
      for (let i = 0; i < N; i++) if (isAccent[i]) ctx.fillRect(xs[i] - h, ys[i] - h, s, s)
    }
  }

  function step() {
    for (let c = 0; c < 3; c++) {
      col[c] += (targetCol[c] - col[c]) * 0.08
      accCol[c] += (accTarget[c] - accCol[c]) * 0.08
    }
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
    setTarget(nextWord, color, nextInset, nextAccent = '', nextMark = '') {
      if (nextMark !== markUrl) {
        markUrl = nextMark
        mark = null
        if (nextMark)
          loadMark(nextMark).then((c) => {
            if (markUrl !== nextMark) return
            mark = c
            sample()
          })
      }
      targetCol = hexToRgb(color)
      // Accent dots start from the word color so the red fades in.
      if (nextAccent && !accent) accCol.splice(0, 3, ...col)
      accTarget = nextAccent ? hexToRgb(nextAccent) : targetCol
      const changed = nextWord !== word || nextInset !== inset || nextAccent !== accent
      word = nextWord
      inset = nextInset
      accent = nextAccent
      if (changed) sample()
      else if (reduced) {
        col.splice(0, 3, ...targetCol)
        accCol.splice(0, 3, ...accTarget)
        draw(true)
      }
    },
    disturb(dy) {
      if (reduced || !ready) return
      // Dots stream with the scroll: up when scrolling down, plus some spread.
      const d = Math.max(-40, Math.min(40, dy))
      const spread = Math.abs(d) * 0.35
      for (let i = 0; i < N; i++) {
        vys[i] -= d * (0.15 + Math.random() * 0.45)
        vxs[i] += (Math.random() - 0.5) * spread
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

export type ParticleWordHandle = {
  /** Push the dots along with a scroll movement of `dy` pixels. */
  disturb: (dy: number) => void
}

const ParticleWord = forwardRef<ParticleWordHandle, ParticleWordProps>(function ParticleWord(
  { word, color, rightInset = 0, heightRatio = 1, count = 2400, accent, mark },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)

  useEffect(() => {
    const engine = createEngine(canvasRef.current!, count, heightRatio)
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [count, heightRatio])

  useEffect(() => {
    engineRef.current?.setTarget(word, color, rightInset, accent, mark)
  }, [word, color, rightInset, accent, mark, count, heightRatio])

  useImperativeHandle(ref, () => ({
    disturb: (dy) => engineRef.current?.disturb(dy),
  }))

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 block h-full w-full"
      style={{ touchAction: 'pan-y' }}
    />
  )
})

export default ParticleWord
