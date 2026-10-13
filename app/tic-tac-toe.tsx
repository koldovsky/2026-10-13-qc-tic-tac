'use client'

import { KeyboardEvent, useEffect, useReducer, useRef, useState } from 'react'
import { chooseMove } from '@/lib/tic-tac-toe/ai'
import {
  applyMove,
  Board,
  COMPUTER,
  createEmptyBoard,
  getWinner,
  HUMAN,
  isDraw,
} from '@/lib/tic-tac-toe/game'

/** Pause before the computer moves so its reply is noticeable; must stay under 1 s. */
export const COMPUTER_DELAY_MS = 300

type Phase = 'human' | 'computer' | 'won' | 'draw'

interface State {
  board: Board
  phase: Phase
}

type Action = { type: 'humanMove'; index: number } | { type: 'computerMove'; index: number }

const initialState: State = { board: createEmptyBoard(), phase: 'human' }

function reducer(state: State, action: Action): State {
  const [expectedPhase, mark, nextPhase]: [Phase, typeof HUMAN, Phase] =
    action.type === 'humanMove' ? ['human', HUMAN, 'computer'] : ['computer', COMPUTER, 'human']
  if (state.phase !== expectedPhase) return state

  const board = applyMove(state.board, action.index, mark)
  if (board === state.board) return state

  if (getWinner(board)) return { board, phase: 'won' }
  if (isDraw(board)) return { board, phase: 'draw' }
  return { board, phase: nextPhase }
}

function statusText(state: State): string {
  switch (state.phase) {
    case 'human':
      return 'Your turn — you are X'
    case 'computer':
      return 'Computer is thinking…'
    case 'won':
      return getWinner(state.board)?.mark === HUMAN ? 'You win!' : 'Computer wins!'
    case 'draw':
      return "It's a draw."
  }
}

const ARROW_STEPS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
}

export default function TicTacToe() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [focusIndex, setFocusIndex] = useState(0)
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (state.phase !== 'computer') return
    const timer = setTimeout(() => {
      dispatch({ type: 'computerMove', index: chooseMove(state.board) })
    }, COMPUTER_DELAY_MS)
    return () => clearTimeout(timer)
  }, [state])

  const winningLine: readonly number[] = getWinner(state.board)?.line ?? []

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = ARROW_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    const row = Math.min(2, Math.max(0, Math.floor(focusIndex / 3) + step[0]))
    const col = Math.min(2, Math.max(0, (focusIndex % 3) + step[1]))
    const next = row * 3 + col
    setFocusIndex(next)
    cellRefs.current[next]?.focus()
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p role="status" aria-live="polite" className="min-h-8 text-xl font-medium">
        {statusText(state)}
      </p>

      <div
        role="grid"
        aria-label="Tic-tac-toe board"
        onKeyDown={handleKeyDown}
        className="flex aspect-square w-[min(90vw,24rem)] flex-col gap-2"
      >
        {[0, 1, 2].map((row) => (
          <div role="row" key={row} className="flex flex-1 gap-2">
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col
              const cell = state.board[index]
              const isWinning = winningLine.includes(index)
              const unavailable = cell !== null || state.phase !== 'human'
              const label = `Row ${row + 1}, column ${col + 1}, ${cell ?? 'empty'}${
                isWinning ? ', winning line' : ''
              }`

              return (
                <div role="gridcell" key={col} className="flex flex-1">
                  <button
                    ref={(el) => {
                      cellRefs.current[index] = el
                    }}
                    type="button"
                    tabIndex={index === focusIndex ? 0 : -1}
                    aria-label={label}
                    aria-disabled={unavailable}
                    onFocus={() => setFocusIndex(index)}
                    onClick={() => dispatch({ type: 'humanMove', index })}
                    className={`flex size-full items-center justify-center rounded-lg text-5xl font-bold sm:text-6xl
                      focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-sky-300
                      ${
                        isWinning
                          ? 'border-4 border-amber-700 bg-amber-100 text-amber-950 dark:border-amber-300 dark:bg-amber-950 dark:text-amber-50'
                          : 'border border-zinc-500 bg-white dark:bg-zinc-900'
                      }
                      ${unavailable ? 'cursor-default' : 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                  >
                    <span aria-hidden="true">{cell}</span>
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
