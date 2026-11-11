import { useEffect, useRef, useState } from 'react'
import { translations, type Lang } from './i18n'

const STORAGE_KEY = 'hopestry-baby'
const HOURS_TO_EMPTY = 36
const HOURS_TO_BORED = 24
const FEED_AMOUNT = 25
const GAME_ROUNDS = 3
const GAME_WIN_JOY = 35
const GAME_LOSE_JOY = 15
const MISSED_AFTER_MS = 6 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const GROW_UP_FEEDS = 15
const GROW_UP_DAYS = 4
const BABY_PX = 4
const KID_PX = 5
const EDGE = 12

type PetSave = {
  born: number
  fullness: number
  updatedAt: number
  feeds: number
  lastVisit: number
  hatched: boolean
  joy: number
  joyAt: number
}

type Mood = 'happy' | 'ok' | 'hungry' | 'bored'

type Game = {
  round: number
  wins: number
  result: 'win' | 'lose' | null
  done: boolean
}
type Stage = 'egg' | 'baby' | 'kid'
type Pixel = [number, number, string]

const COLORS: Record<string, string> = {
  k: '#6b4636',
  b: '#ffe6d2',
  s: '#f7caa9',
  e: '#3d2a24',
  w: '#ffffff',
  c: '#ff9faa',
  m: '#d9636d',
  t: '#9fd3ff',
  g: '#9edb73',
  G: '#5fae45',
  y: '#fff6e8',
  p: '#ffc2cf',
  d: '#b8e2ff',
}

const EGG = [
  '....kkkk....',
  '...kyyyyk...',
  '..kyyppyyk..',
  '.kyyyppyyyk.',
  '.kyyyyyyyyk.',
  'kyyddyyyyyyk',
  'kyyddyyyppyk',
  'kyyyyyyyppyk',
  'kyyyyyyyyyyk',
  '.kyyppyyyyk.',
  '..kyyyyyyk..',
  '...kkkkkk...',
]

const BODY = [
  '.kbbbbbbbbbbbbk.',
  '.kbbbbbbbbbbbbk.',
  'kbbbbbbbbbbbbbbk',
  'kbbbbbbbbbbbbbbk',
  'kbbbbbbbbbbbbbbk',
  'kbbbbbbbbbbbbbbk',
  'kbbbbbbbbbbbbbbk',
  '.kbbbbbbbbbbbbk.',
  '.ksbbbbbbbbbbsk.',
  '..kssssssssssk..',
  '...kkkkkkkkkk...',
]
const BABY_TOP = ['.......ggg......', '......gGgg......', '....kkkGkkkk....', '..kkbbbbbbbbkk..']
const KID_TOP = ['.....gg...gg....', '......gGgGg.....', '....kkkkGkkk....', '..kkbbbbbbbbkk..']
const FEET = ['...kbk....kbk...', '....kbk..kbk....']

// Face pixels, drawn one pixel towards the way the pet is facing.
// `look` nudges the eyes (by up to a pixel) towards the mouse.
function face(mood: Mood, mouthOpen: boolean, squint: boolean, look: [number, number]): Pixel[] {
  const sad = mood === 'hungry' || mood === 'bored'
  const eye = (x: number): Pixel[] =>
    sad
      ? [[x, 8, 'e'], [x + 1, 8, 'w'], [x, 9, 'e'], [x + 1, 9, 'e']]
      : [[x, 7, 'e'], [x + 1, 7, 'w'], [x, 8, 'e'], [x + 1, 8, 'e'], [x, 9, 'e'], [x + 1, 9, 'e']]
  const eyes: Pixel[] = squint
    ? [[4, 8, 'e'], [5, 7, 'e'], [6, 8, 'e'], [10, 8, 'e'], [11, 7, 'e'], [12, 8, 'e']]
    : [...eye(4), ...eye(10)].map(([x, y, c]): Pixel => [x + look[0], y + look[1], c])
  const cheeks: Pixel[] = sad
    ? [[3, 11, 't']]
    : [[2, 10, 'c'], [3, 10, 'c'], [12, 10, 'c'], [13, 10, 'c']]
  const mouth: Pixel[] = mouthOpen
    ? [[7, 10, 'm'], [8, 10, 'm'], [7, 11, 'm'], [8, 11, 'm']]
    : sad
      ? [[6, 11, 'e'], [7, 10, 'e'], [8, 10, 'e'], [9, 11, 'e']]
      : mood === 'happy'
        ? [[6, 10, 'e'], [7, 11, 'e'], [8, 11, 'e'], [9, 10, 'e']]
        : [[7, 11, 'e'], [8, 11, 'e']]
  return [...cheeks, ...eyes, ...mouth]
}

function Sprite({ rows, px, extra = [] }: { rows: string[]; px: number; extra?: Pixel[] }) {
  const pixels: Pixel[] = []
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '.') pixels.push([x, y, ch])
    }),
  )
  return (
    <svg
      width={rows[0].length * px}
      height={rows.length * px}
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {[...pixels, ...extra].map(([x, y, ch], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={COLORS[ch]} />
      ))}
    </svg>
  )
}

function loadSave(): PetSave | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (typeof s?.born !== 'number' || typeof s?.fullness !== 'number') return null
    return {
      ...s,
      hatched: s.hatched ?? true,
      joy: s.joy ?? 50,
      joyAt: s.joyAt ?? Date.now(),
    }
  } catch {
    return null
  }
}

function writeSave(s: PetSave) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    // Storage unavailable (private mode etc.): the pet just won't be remembered.
  }
}

function fullnessAt(s: PetSave, now: number) {
  const hours = (now - s.updatedAt) / 3_600_000
  return Math.max(0, s.fullness - (hours * 100) / HOURS_TO_EMPTY)
}

function joyAt(s: PetSave, now: number) {
  const hours = (now - s.joyAt) / 3_600_000
  return Math.max(0, s.joy - (hours * 100) / HOURS_TO_BORED)
}

function moodFor(fullness: number, joy: number): Mood {
  if (fullness < 25) return 'hungry'
  if (joy < 25) return 'bored'
  if (fullness >= 60 && joy >= 60) return 'happy'
  return 'ok'
}

export default function DesktopPet({ lang }: { lang: Lang }) {
  const t = translations[lang].baby
  const [initial] = useState(() => {
    const now = Date.now()
    const existing = loadSave()
    if (!existing) {
      const fresh: PetSave = {
        born: now,
        fullness: 50,
        updatedAt: now,
        feeds: 0,
        lastVisit: now,
        hatched: false,
        joy: 50,
        joyAt: now,
      }
      return { missed: false, save: fresh }
    }
    return { missed: now - existing.lastVisit > MISSED_AFTER_MS, save: existing }
  })
  const [save, setSave] = useState<PetSave>(initial.save)
  const [now, setNow] = useState(() => Date.now())
  const [x, setX] = useState(() => window.innerWidth * (0.3 + Math.random() * 0.4))
  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [frame, setFrame] = useState(0)
  const [open, setOpen] = useState(false)
  const [tooFull, setTooFull] = useState(false)
  const [say, setSay] = useState<string | null>(null)
  const [eating, setEating] = useState(false)
  const [hatching, setHatching] = useState(false)
  const [heartBurst, setHeartBurst] = useState(0)
  const [game, setGame] = useState<Game | null>(null)
  const [cheer, setCheer] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const petRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(x)
  const targetRef = useRef<number | null>(null)
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const [look, setLook] = useState<[number, number]>([0, 0])

  const fullness = fullnessAt(save, now)
  const joy = joyAt(save, now)
  const mood = moodFor(fullness, joy)
  const ageDays = Math.floor((now - save.born) / DAY_MS) + 1
  const stage: Stage = !save.hatched
    ? 'egg'
    : save.feeds >= GROW_UP_FEEDS || ageDays >= GROW_UP_DAYS
      ? 'kid'
      : 'baby'

  useEffect(() => {
    const updated = { ...initial.save, lastVisit: Date.now() }
    setSave(updated)
    writeSave(updated)
    if (initial.missed) {
      const id = window.setTimeout(() => setSay(translations[lang].baby.missed), 900)
      return () => window.clearTimeout(id)
    }
    // Only greet once per page load, in whatever language was active then.
  }, [initial])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!say) return
    const id = window.setTimeout(() => setSay(null), 4000)
    return () => window.clearTimeout(id)
  }, [say])

  // A new visitor's egg wobbles for a moment, then hatches.
  useEffect(() => {
    if (stage !== 'egg') return
    const crack = window.setTimeout(() => setHatching(true), 3500)
    const hatch = window.setTimeout(() => {
      setHatching(false)
      setSave((s) => {
        const updated = { ...s, hatched: true }
        writeSave(updated)
        return updated
      })
      setSay(t.born)
    }, 5200)
    return () => {
      window.clearTimeout(crack)
      window.clearTimeout(hatch)
    }
  }, [stage, t.born])

  const slow = mood === 'hungry' || mood === 'bored'
  const speedRef = useRef(130)
  speedRef.current = slow ? 35 : 70

  const clampX = (value: number) => {
    const width = petRef.current?.offsetWidth ?? 64
    const max = Math.max(EDGE, window.innerWidth - width - EDGE)
    return Math.min(max, Math.max(EDGE, value))
  }

  // Eyes follow the mouse (or the last tap on touch screens).
  const facingRef = useRef(facing)
  facingRef.current = facing
  const updateLook = () => {
    const pointer = pointerRef.current
    const rect = petRef.current?.getBoundingClientRect()
    if (!pointer || !rect) return
    const dx = pointer.x - (rect.left + rect.width / 2)
    const dy = pointer.y - (rect.top + rect.height * 0.45)
    const dist = Math.hypot(dx, dy) || 1
    const reach = Math.min(1, dist / 120)
    const snap = (v: number) => Math.round(v * 2) / 2
    const lx = snap((dx / dist) * reach * facingRef.current)
    const ly = snap((dy / dist) * reach * 0.8)
    setLook((cur) => (cur[0] === lx && cur[1] === ly ? cur : [lx, ly]))
  }
  const updateLookRef = useRef(updateLook)
  updateLookRef.current = updateLook

  useEffect(() => {
    let raf = 0
    const onPointer = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => updateLookRef.current())
    }
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  useEffect(() => {
    updateLookRef.current()
  }, [x, facing])

  // When nobody is pointing anywhere, stroll to a random spot now and then.
  useEffect(() => {
    if (stage === 'egg') return
    const id = window.setInterval(() => {
      if (targetRef.current !== null) return
      if (Math.random() < (slow ? 0.15 : 0.35)) {
        targetRef.current = clampX(EDGE + Math.random() * window.innerWidth)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [stage, slow])

  useEffect(() => {
    if (stage === 'egg' || open || eating) {
      targetRef.current = null
      setWalking(false)
      return
    }
    let raf = 0
    let last = performance.now()
    const step = (time: number) => {
      const dt = Math.min(50, time - last) / 1000
      last = time
      const target = targetRef.current
      if (target !== null) {
        const dx = target - xRef.current
        if (Math.abs(dx) < 2) {
          targetRef.current = null
          setWalking(false)
        } else {
          xRef.current += Math.sign(dx) * Math.min(Math.abs(dx), speedRef.current * dt)
          setX(xRef.current)
          setFacing(dx > 0 ? 1 : -1)
          setWalking(true)
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [stage, open, eating])

  useEffect(() => {
    if (!walking && !eating) return
    const id = window.setInterval(() => setFrame((f) => 1 - f), eating ? 160 : 220)
    return () => window.clearInterval(id)
  }, [walking, eating])

  useEffect(() => {
    if (!eating) return
    const id = window.setTimeout(() => setEating(false), 1200)
    return () => window.clearTimeout(id)
  }, [eating])

  useEffect(() => {
    if (heartBurst === 0) return
    setCheer(true)
    const id = window.setTimeout(() => setCheer(false), 1300)
    return () => window.clearTimeout(id)
  }, [heartBurst])

  useEffect(() => {
    const onResize = () => {
      const width = petRef.current?.offsetWidth ?? 56
      xRef.current = Math.min(xRef.current, Math.max(EDGE, window.innerWidth - width - EDGE))
      setX(xRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!petRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const onPetClick = () => {
    if (stage === 'egg') {
      setSay(t.egg)
      return
    }
    setSay(null)
    setTooFull(false)
    setGame(null)
    setOpen((o) => !o)
  }

  // Tamagotchi-style guessing game: guess which way the pet will look.
  const guess = (dir: 1 | -1) => {
    if (!game || game.done) return
    const look: 1 | -1 = Math.random() < 0.5 ? 1 : -1
    setFacing(look)
    const wins = game.wins + (look === dir ? 1 : 0)
    const done = game.round >= GAME_ROUNDS
    setGame({ round: game.round + (done ? 0 : 1), wins, result: look === dir ? 'win' : 'lose', done })
    if (!done) return
    const at = Date.now()
    const won = wins * 2 > GAME_ROUNDS
    const updated = {
      ...save,
      joy: Math.min(100, joyAt(save, at) + (won ? GAME_WIN_JOY : GAME_LOSE_JOY)),
      joyAt: at,
      lastVisit: at,
    }
    setSave(updated)
    writeSave(updated)
    setNow(at)
    if (won) setHeartBurst((n) => n + 1)
  }

  const feed = () => {
    const at = Date.now()
    const current = fullnessAt(save, at)
    if (current >= 95) {
      setTooFull(true)
      return
    }
    const updated = {
      ...save,
      fullness: Math.min(100, current + FEED_AMOUNT),
      updatedAt: at,
      feeds: save.feeds + 1,
      lastVisit: at,
    }
    setSave(updated)
    writeSave(updated)
    setNow(at)
    setTooFull(false)
    setEating(true)
    setHeartBurst((n) => n + 1)
  }

  const moving = walking || eating
  const mouthOpen = eating && frame === 1
  const sprite =
    stage === 'egg' ? (
      <Sprite rows={EGG} px={BABY_PX + 1} />
    ) : (
      <Sprite
        rows={[...(stage === 'kid' ? KID_TOP : BABY_TOP), ...BODY, FEET[moving ? frame : 0]]}
        px={stage === 'kid' ? KID_PX : BABY_PX}
        extra={face(eating ? 'happy' : mood, mouthOpen, eating || cheer, look).map(
          ([px, py, c]): Pixel => [px + 1, py, c],
        )}
      />
    )

  const alignRight = x > window.innerWidth / 2
  const bubbleSide = alignRight ? 'right-0' : 'left-0'
  const message = eating ? t.eating : tooFull ? t.full : t[mood]
  const looked = game?.result ? (facing === 1 ? t.lookedRight : t.lookedLeft) : ''
  const gameMessage = !game?.result
    ? t.gamePrompt
    : game.done
      ? `${looked} ${game.wins * 2 > GAME_ROUNDS ? t.gameWin : t.gameLose}`
      : `${looked} ${game.result === 'win' ? t.gameRight : t.gameWrong}`

  const meter = (label: string, value: number, color: string) => (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <span>{label}</span>
      <span className="flex gap-0.5 text-[14px] leading-none" aria-label={`${Math.round(value)}%`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ color: i < Math.ceil(value / 25) ? color : 'rgba(255,255,255,0.15)' }}>
            ♥
          </span>
        ))}
      </span>
    </div>
  )

  const pillButton =
    'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition hover:opacity-85 active:scale-95'

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-[50]">
      <div
        ref={petRef}
        className="pointer-events-auto absolute bottom-4 sm:bottom-6"
        style={{ left: x }}
      >
        {open && (
          <div
            className={`absolute bottom-full mb-3 w-[220px] rounded-2xl border border-[var(--panel-edge)] bg-[var(--panel)] p-4 text-center text-[13px] text-[var(--panel-muted)] shadow-[0_16px_50px_rgba(0,0,0,0.45)] ${bubbleSide}`}
          >
            {game ? (
              <>
                <p className="mb-1 min-h-[2.6em] text-[var(--panel-ink)]">{gameMessage}</p>
                <p className="mb-3 text-[11px]">{t.gameRound(game.round, GAME_ROUNDS, game.wins)}</p>
                {game.done ? (
                  <button
                    type="button"
                    onClick={() => setGame(null)}
                    className={`${pillButton} bg-[var(--panel-ink)] text-[var(--panel)]`}
                  >
                    {t.back}
                  </button>
                ) : (
                  <div className="flex justify-center gap-3">
                    {([-1, 1] as const).map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => guess(dir)}
                        aria-label={dir === -1 ? t.left : t.right}
                        className={`${pillButton} w-16 bg-[var(--panel-ink)] text-[18px] text-[var(--panel)]`}
                      >
                        {dir === -1 ? '←' : '→'}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="mb-3 min-h-[2.6em] text-[var(--panel-ink)]">{message}</p>
                <div className="mb-3 space-y-1">
                  {meter(t.fullness, fullness, '#f08f86')}
                  {meter(t.joy, joy, '#e8c06f')}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={feed}
                    className={`${pillButton} bg-[var(--panel-ink)] text-[var(--panel)]`}
                  >
                    <span aria-hidden>🍼</span>
                    {t.feed}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGame({ round: 1, wins: 0, result: null, done: false })}
                    className={`${pillButton} border border-white/20 text-[var(--panel-ink)]`}
                  >
                    <span aria-hidden>🎮</span>
                    {t.play}
                  </button>
                </div>
                <p className="mt-3 text-[11px]">{t.stats(ageDays, save.feeds)}</p>
              </>
            )}
          </div>
        )}

        {!open && say && (
          <div
            className={`absolute bottom-full mb-3 w-max max-w-[200px] rounded-xl bg-[var(--panel-ink)] px-3 py-2 text-[12px] leading-snug text-[var(--panel)] shadow-lg ${bubbleSide}`}
          >
            {say}
          </div>
        )}

        {!open && !say && stage !== 'egg' && mood === 'hungry' && (
          <div className="pet-alert absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-full bg-[#e8836f] px-2 text-[12px] font-bold text-white">
            !
          </div>
        )}

        {cheer && (
          <div key={heartBurst} className="pointer-events-none absolute bottom-full left-1/2" aria-hidden>
            {[-14, 0, 14].map((dx, i) => (
              <span
                key={dx}
                className="heart-float absolute text-[14px] text-[#f08f86]"
                style={{ left: dx, animationDelay: `${i * 120}ms` }}
              >
                ♥
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onPetClick}
          aria-label={t.petLabel}
          className="relative block cursor-pointer"
        >
          <div
            className={
              stage === 'egg'
                ? hatching
                  ? 'pet-wobble-fast'
                  : 'pet-wobble'
                : moving
                  ? ''
                  : 'pet-idle'
            }
            style={{ transformOrigin: '50% 100%' }}
          >
            <div style={{ transform: `scaleX(${facing})` }}>{sprite}</div>
          </div>
          <div className="mx-auto mt-0.5 h-1.5 w-3/4 rounded-full bg-black/30 blur-[1px]" />
        </button>
      </div>
    </div>
  )
}
