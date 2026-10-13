export type Mark = 'X' | 'O'
export type Cell = Mark | null
/** Nine cells in row-major order: index = row * 3 + column. */
export type Board = readonly Cell[]

export const HUMAN: Mark = 'X'
export const COMPUTER: Mark = 'O'

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function createEmptyBoard(): Board {
  return Array<Cell>(9).fill(null)
}

/** Returns a new board with `mark` at `index`, or the same board if the move is illegal. */
export function applyMove(board: Board, index: number, mark: Mark): Board {
  if (!Number.isInteger(index) || index < 0 || index > 8 || board[index] !== null) {
    return board
  }
  const next = board.slice()
  next[index] = mark
  return next
}

export interface Win {
  mark: Mark
  line: readonly [number, number, number]
}

export function getWinner(board: Board): Win | null {
  for (const line of LINES) {
    const [a, b, c] = line
    const mark = board[a]
    if (mark && mark === board[b] && mark === board[c]) {
      return { mark, line }
    }
  }
  return null
}

/** A draw is a full board with no completed line. */
export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && getWinner(board) === null
}

export function emptyCells(board: Board): number[] {
  const cells: number[] = []
  board.forEach((cell, i) => {
    if (cell === null) cells.push(i)
  })
  return cells
}
