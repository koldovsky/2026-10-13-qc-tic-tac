import { describe, expect, test } from 'vitest'
import { chooseMove } from './ai'
import { applyMove, Board, Cell, createEmptyBoard, emptyCells, getWinner } from './game'

function board(s: string): Board {
  return [...s].map((c): Cell => (c === '.' ? null : (c as 'X' | 'O')))
}

describe('chooseMove', () => {
  test('returns an empty cell', () => {
    const b = board('X...O...X')
    expect(b[chooseMove(b)]).toBeNull()
  })

  test('takes an immediate win', () => {
    // O can win on 5 (middle row); X also threatens on 2.
    const b = board('XX.OO.X..')
    expect(chooseMove(b)).toBe(5)
  })

  test('blocks a single two-X threat when it cannot win', () => {
    // X threatens the top row on 2; O has no winning move.
    const b = board('XX..O....')
    expect(chooseMove(b)).toBe(2)
  })

  test('throws on a full board', () => {
    expect(() => chooseMove(board('XOXXOOOXX'))).toThrow()
  })
})

describe('computer never loses (exhaustive)', () => {
  test('every human move sequence ends in a draw or a computer win', () => {
    const results = { O: 0, draw: 0, X: 0 }
    let games = 0

    // Human (X) to move: try every empty cell, then let the computer reply.
    function humanTurn(b: Board): void {
      for (const i of emptyCells(b)) {
        const afterHuman = applyMove(b, i, 'X')
        if (finish(afterHuman)) continue

        const reply = chooseMove(afterHuman)
        expect(afterHuman[reply]).toBeNull()
        const afterComputer = applyMove(afterHuman, reply, 'O')
        if (finish(afterComputer)) continue

        humanTurn(afterComputer)
      }
    }

    // Records the result if the game is over and reports whether it is.
    function finish(b: Board): boolean {
      const win = getWinner(b)
      if (win) {
        results[win.mark]++
      } else if (emptyCells(b).length === 0) {
        results.draw++
      } else {
        return false
      }
      games++
      return true
    }

    humanTurn(createEmptyBoard())

    expect(results.X).toBe(0)
    expect(games).toBe(results.O + results.draw)
    expect(games).toBeGreaterThan(0)
  })
})
