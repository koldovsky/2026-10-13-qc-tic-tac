import { describe, expect, test } from 'vitest'
import { applyMove, Board, Cell, createEmptyBoard, getWinner, isDraw, LINES } from './game'

/** Builds a board from a 9-char string: 'X', 'O', or '.' for empty. */
function board(s: string): Board {
  return [...s].map((c): Cell => (c === '.' ? null : (c as 'X' | 'O')))
}

describe('createEmptyBoard', () => {
  test('has nine empty cells', () => {
    expect(createEmptyBoard()).toEqual(Array(9).fill(null))
  })
})

describe('applyMove', () => {
  test('places a mark on an empty cell without mutating the input', () => {
    const empty = createEmptyBoard()
    const next = applyMove(empty, 4, 'X')
    expect(next[4]).toBe('X')
    expect(empty[4]).toBeNull()
  })

  test('leaves the board unchanged for an occupied cell', () => {
    const b = board('X........')
    expect(applyMove(b, 0, 'O')).toBe(b)
  })

  test.each([-1, 9, 1.5])('leaves the board unchanged for out-of-range index %s', (i) => {
    const b = createEmptyBoard()
    expect(applyMove(b, i, 'X')).toBe(b)
  })
})

describe('getWinner', () => {
  test.each(LINES.map((line) => [line]))('detects a win on line %j', (line) => {
    for (const mark of ['X', 'O'] as const) {
      const cells: Cell[] = Array(9).fill(null)
      line.forEach((i) => (cells[i] = mark))
      expect(getWinner(cells)).toEqual({ mark, line })
    }
  })

  test('returns null when no line is complete', () => {
    expect(getWinner(board('XO.OX....'))).toBeNull()
  })

  test('a win on the final cell is a win, not a draw', () => {
    // X completes the left column with the ninth mark.
    const full = board('XOXXOOXXO')
    expect(getWinner(full)).toEqual({ mark: 'X', line: [0, 3, 6] })
    expect(isDraw(full)).toBe(false)
  })
})

describe('isDraw', () => {
  test('a full board with no line is a draw', () => {
    const full = board('XOXXOOOXX')
    expect(getWinner(full)).toBeNull()
    expect(isDraw(full)).toBe(true)
  })

  test('a board with empty cells is not a draw', () => {
    expect(isDraw(board('XOXXOOOX.'))).toBe(false)
  })
})
