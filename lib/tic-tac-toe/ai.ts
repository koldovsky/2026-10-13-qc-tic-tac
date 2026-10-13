import { applyMove, Board, COMPUTER, emptyCells, getWinner, HUMAN, Mark } from './game'

/**
 * Minimax score from the computer's point of view. Wins score higher the sooner
 * they happen and losses score higher the later they happen, so the computer
 * takes an immediate win and delays any loss.
 */
function score(board: Board, toMove: Mark, depth: number): number {
  const win = getWinner(board)
  if (win) return win.mark === COMPUTER ? 10 - depth : depth - 10
  const moves = emptyCells(board)
  if (moves.length === 0) return 0

  const next = toMove === COMPUTER ? HUMAN : COMPUTER
  const scores = moves.map((i) => score(applyMove(board, i, toMove), next, depth + 1))
  return toMove === COMPUTER ? Math.max(...scores) : Math.min(...scores)
}

/**
 * Returns the cell index of the computer's best move (perfect play).
 * Ties go to the lowest index, so the choice is deterministic.
 * Throws if the board has no empty cell.
 */
export function chooseMove(board: Board): number {
  const moves = emptyCells(board)
  if (moves.length === 0) throw new Error('chooseMove called on a full board')

  let best = moves[0]
  let bestScore = -Infinity
  for (const i of moves) {
    const s = score(applyMove(board, i, COMPUTER), HUMAN, 1)
    if (s > bestScore) {
      best = i
      bestScore = s
    }
  }
  return best
}
