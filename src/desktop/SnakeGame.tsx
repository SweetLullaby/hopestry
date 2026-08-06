import { useEffect, useRef, useState } from 'react'

const COLS = 16
const ROWS = 12
const CELL = 16

type Point = { x: number; y: number }

function randomFood(snake: Point[]): Point {
  while (true) {
    const p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    }
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p
  }
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 4, y: 6 },
    { x: 3, y: 6 },
    { x: 2, y: 6 },
  ])
  const [food, setFood] = useState<Point>({ x: 10, y: 6 })
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 })
  const [alive, setAlive] = useState(true)
  const [score, setScore] = useState(0)
  const dirRef = useRef(dir)
  const pendingRef = useRef<Point | null>(null)

  useEffect(() => {
    dirRef.current = dir
  }, [dir])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      }
      const next = map[e.key]
      if (!next) return
      e.preventDefault()
      const cur = dirRef.current
      if (next.x === -cur.x && next.y === -cur.y) return
      pendingRef.current = next
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!alive) return
    const id = window.setInterval(() => {
      if (pendingRef.current) {
        setDir(pendingRef.current)
        dirRef.current = pendingRef.current
        pendingRef.current = null
      }
      setSnake((prev) => {
        const d = dirRef.current
        const head = { x: prev[0].x + d.x, y: prev[0].y + d.y }
        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= COLS ||
          head.y >= ROWS ||
          prev.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setAlive(false)
          return prev
        }
        const next = [head, ...prev]
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1)
          setFood(randomFood(next))
          return next
        }
        next.pop()
        return next
      })
    }, 140)
    return () => window.clearInterval(id)
  }, [alive, food])

  const restart = () => {
    const start = [
      { x: 4, y: 6 },
      { x: 3, y: 6 },
      { x: 2, y: 6 },
    ]
    setSnake(start)
    setFood(randomFood(start))
    setDir({ x: 1, y: 0 })
    dirRef.current = { x: 1, y: 0 }
    pendingRef.current = null
    setScore(0)
    setAlive(true)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between text-[12px] text-[var(--panel-ink)]">
        <span>Score: {score}</span>
        <span className="text-[var(--panel-muted)]">Arrow keys / WASD</span>
      </div>
      <div
        className="relative rounded-md border border-[var(--panel-edge)] bg-[#1c1d1a]"
        style={{ width: COLS * CELL, height: ROWS * CELL }}
      >
        {snake.map((s, i) => (
          <div
            key={`${s.x}-${s.y}-${i}`}
            className="absolute rounded-[2px]"
            style={{
              left: s.x * CELL,
              top: s.y * CELL,
              width: CELL - 1,
              height: CELL - 1,
              background: i === 0 ? '#9fbfa8' : '#5f8a6d',
            }}
          />
        ))}
        <div
          className="absolute rounded-full bg-[#e8c46a]"
          style={{
            left: food.x * CELL + 3,
            top: food.y * CELL + 3,
            width: CELL - 7,
            height: CELL - 7,
          }}
        />
        {!alive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 text-[var(--panel)]">
            <p className="text-[13px]">Game over</p>
            <button
              type="button"
              onClick={restart}
              className="rounded-full bg-[var(--panel)] px-3 py-1 text-[12px] text-[var(--ink)]"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
