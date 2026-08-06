import { useCallback, useEffect, useRef, useState } from 'react'

const COLS = 10
const ROWS = 16
const CELL = 18

const COLORS = [
  '#000000',
  '#5ec8e8', // I
  '#e8c45e', // O
  '#a78bfa', // T
  '#5ee89a', // S
  '#e86b6b', // Z
  '#6b8ae8', // J
  '#e89a5e', // L
]

const SHAPES: number[][][] = [
  [[1, 1, 1, 1]],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
  ],
  [
    [5, 5, 0],
    [0, 5, 5],
  ],
  [
    [6, 0, 0],
    [6, 6, 6],
  ],
  [
    [0, 0, 7],
    [7, 7, 7],
  ],
]

type Piece = { shape: number[][]; x: number; y: number }

function emptyBoard(): number[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
}

function rotate(shape: number[][]): number[][] {
  const h = shape.length
  const w = shape[0].length
  const next = Array.from({ length: w }, () => Array(h).fill(0))
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      next[x][h - 1 - y] = shape[y][x]
    }
  }
  return next
}

function collides(board: number[][], piece: Piece): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (!piece.shape[y][x]) continue
      const nx = piece.x + x
      const ny = piece.y + y
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true
      if (ny >= 0 && board[ny][nx]) return true
    }
  }
  return false
}

function merge(board: number[][], piece: Piece): number[][] {
  const next = board.map((row) => [...row])
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      const v = piece.shape[y][x]
      if (!v) continue
      const ny = piece.y + y
      const nx = piece.x + x
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) next[ny][nx] = v
    }
  }
  return next
}

function clearLines(board: number[][]): { board: number[][]; cleared: number } {
  const kept = board.filter((row) => row.some((c) => c === 0))
  const cleared = ROWS - kept.length
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(0))
  return { board: kept, cleared }
}

function spawn(): Piece {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)].map((r) => [
    ...r,
  ])
  return {
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  }
}

export default function TetrisGame() {
  const [board, setBoard] = useState(emptyBoard)
  const [piece, setPiece] = useState<Piece>(() => spawn())
  const [score, setScore] = useState(0)
  const [alive, setAlive] = useState(true)
  const pieceRef = useRef(piece)
  const boardRef = useRef(board)
  const aliveRef = useRef(alive)

  useEffect(() => {
    pieceRef.current = piece
  }, [piece])
  useEffect(() => {
    boardRef.current = board
  }, [board])
  useEffect(() => {
    aliveRef.current = alive
  }, [alive])

  const lockPiece = useCallback((p: Piece) => {
    let nextBoard = merge(boardRef.current, p)
    const { board: clearedBoard, cleared } = clearLines(nextBoard)
    if (cleared) setScore((s) => s + cleared * 100)
    const next = spawn()
    if (collides(clearedBoard, next)) {
      setAlive(false)
      setBoard(clearedBoard)
      return
    }
    boardRef.current = clearedBoard
    setBoard(clearedBoard)
    pieceRef.current = next
    setPiece(next)
  }, [])

  const tryMove = useCallback(
    (dx: number, dy: number, rot = false) => {
      if (!aliveRef.current) return
      const cur = pieceRef.current
      const shape = rot ? rotate(cur.shape) : cur.shape
      const next = { shape, x: cur.x + dx, y: cur.y + dy }
      if (!collides(boardRef.current, next)) {
        pieceRef.current = next
        setPiece(next)
        return true
      }
      if (dy > 0 && !rot) lockPiece(cur)
      return false
    },
    [lockPiece],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!aliveRef.current) return
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'w', 'a', 's', 'd']
      if (!keys.includes(e.key)) return
      e.preventDefault()
      if (e.key === 'ArrowLeft' || e.key === 'a') tryMove(-1, 0)
      if (e.key === 'ArrowRight' || e.key === 'd') tryMove(1, 0)
      if (e.key === 'ArrowDown' || e.key === 's') tryMove(0, 1)
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') tryMove(0, 0, true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tryMove])

  useEffect(() => {
    if (!alive) return
    const id = window.setInterval(() => tryMove(0, 1), 520)
    return () => window.clearInterval(id)
  }, [alive, tryMove])

  const restart = () => {
    const b = emptyBoard()
    const p = spawn()
    boardRef.current = b
    pieceRef.current = p
    aliveRef.current = true
    setBoard(b)
    setPiece(p)
    setScore(0)
    setAlive(true)
  }

  const view = merge(board, piece)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between text-[12px] text-[var(--panel-ink)]">
        <span>Score: {score}</span>
        <span className="text-[var(--panel-muted)]">← → ↓ · ↑ rotate</span>
      </div>
      <div
        className="relative rounded-md border border-black/10 bg-[#12141a] p-1"
        style={{ width: COLS * CELL + 8, height: ROWS * CELL + 8 }}
      >
        <div className="relative" style={{ width: COLS * CELL, height: ROWS * CELL }}>
          {view.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="absolute rounded-[2px]"
                style={{
                  left: x * CELL,
                  top: y * CELL,
                  width: CELL - 1,
                  height: CELL - 1,
                  background: cell ? COLORS[cell] : 'rgba(255,255,255,0.04)',
                }}
              />
            )),
          )}
        </div>
        {!alive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-black/60 text-white">
            <p className="text-[13px]">Game over</p>
            <button
              type="button"
              onClick={restart}
              className="rounded-full bg-white px-3 py-1 text-[12px] text-[var(--panel-ink)]"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
