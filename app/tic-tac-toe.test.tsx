import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import TicTacToe, { COMPUTER_DELAY_MS } from './tic-tac-toe'

function cells() {
  return screen.getAllByRole('button')
}

function status() {
  return screen.getByRole('status').textContent
}

/** Clicks cell `index` and lets the computer reply. */
function playHuman(index: number) {
  fireEvent.click(cells()[index])
  act(() => {
    vi.advanceTimersByTime(COMPUTER_DELAY_MS)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('initial state', () => {
  test('shows nine empty cells and the human turn', () => {
    render(<TicTacToe />)
    expect(screen.getByRole('grid', { name: 'Tic-tac-toe board' })).toBeTruthy()
    expect(cells()).toHaveLength(9)
    cells().forEach((cell) => expect(cell.getAttribute('aria-label')).toMatch(/, empty$/))
    expect(status()).toMatch(/your turn.*X/i)
  })
})

describe('human moves', () => {
  test('clicking an empty cell places X and hands the turn to the computer', () => {
    render(<TicTacToe />)
    fireEvent.click(cells()[4])
    expect(cells()[4].getAttribute('aria-label')).toBe('Row 2, column 2, X')
    expect(status()).toMatch(/computer/i)
  })

  test('clicking an occupied cell does nothing', () => {
    render(<TicTacToe />)
    playHuman(0)
    const before = cells().map((c) => c.getAttribute('aria-label'))
    const occupied = cells().findIndex((c) => c.getAttribute('aria-label')?.endsWith(', O'))

    fireEvent.click(cells()[occupied])
    fireEvent.click(cells()[0])

    expect(cells().map((c) => c.getAttribute('aria-label'))).toEqual(before)
    expect(status()).toMatch(/your turn/i)
  })
})

describe('computer turn', () => {
  test('input is ignored while the computer is thinking', () => {
    render(<TicTacToe />)
    fireEvent.click(cells()[0])
    fireEvent.click(cells()[8])
    expect(cells()[8].getAttribute('aria-label')).toMatch(/, empty$/)
    expect(cells().every((c) => c.getAttribute('aria-disabled') === 'true')).toBe(true)
  })

  test('the computer places an O in an empty cell within 1 second', () => {
    expect(COMPUTER_DELAY_MS).toBeLessThan(1000)
    render(<TicTacToe />)
    fireEvent.click(cells()[0])
    act(() => {
      vi.advanceTimersByTime(999)
    })
    const os = cells().filter((c) => c.getAttribute('aria-label')?.endsWith(', O'))
    expect(os).toHaveLength(1)
    expect(cells()[0].getAttribute('aria-label')).toMatch(/, X$/)
    expect(status()).toMatch(/your turn/i)
  })

  test('the computer does not move after a game-ending human move', () => {
    render(<TicTacToe />)
    for (const i of [0, 1, 6, 5, 8]) playHuman(i)
    const marks = cells().filter((c) => /, [XO]$/.test(c.getAttribute('aria-label') ?? ''))
    expect(marks).toHaveLength(9)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(status()).toMatch(/draw/i)
  })
})

describe('game over', () => {
  test('computer win: status, highlighted line, and locked board', () => {
    render(<TicTacToe />)
    for (const i of [0, 1, 3]) playHuman(i)

    expect(status()).toMatch(/computer wins/i)
    const winning = cells().filter((c) => c.getAttribute('aria-label')?.endsWith('winning line'))
    expect(winning.map((c) => cells().indexOf(c))).toEqual([2, 4, 6])

    const before = cells().map((c) => c.getAttribute('aria-label'))
    fireEvent.click(cells()[8])
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(cells().map((c) => c.getAttribute('aria-label'))).toEqual(before)
    expect(cells().every((c) => c.getAttribute('aria-disabled') === 'true')).toBe(true)
  })

  test('draw: status and locked board with no highlight', () => {
    render(<TicTacToe />)
    for (const i of [0, 1, 6, 5, 8]) playHuman(i)

    expect(status()).toMatch(/draw/i)
    expect(cells().some((c) => c.getAttribute('aria-label')?.endsWith('winning line'))).toBe(false)
    expect(cells().every((c) => c.getAttribute('aria-disabled') === 'true')).toBe(true)
  })
})

describe('screen reader', () => {
  test('cell labels describe position and contents', () => {
    render(<TicTacToe />)
    playHuman(5)
    expect(cells()[5].getAttribute('aria-label')).toBe('Row 2, column 3, X')
    expect(cells()[0].getAttribute('aria-label')).toBe('Row 1, column 1, empty')
  })

  test('status is a polite live region', () => {
    render(<TicTacToe />)
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite')
  })
})

describe('keyboard', () => {
  // user-event awaits real timers internally, so these tests run without fake timers.
  beforeEach(() => {
    vi.useRealTimers()
  })

  test('the board is a single tab stop and arrow keys move focus', async () => {
    const user = userEvent.setup()
    render(<TicTacToe />)

    expect(cells().filter((c) => c.tabIndex === 0)).toHaveLength(1)
    await user.tab()
    expect(document.activeElement).toBe(cells()[0])

    await user.keyboard('{ArrowRight}{ArrowDown}')
    expect(document.activeElement).toBe(cells()[4])
    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowUp}{ArrowUp}')
    expect(document.activeElement).toBe(cells()[0])
    expect(cells()[0].tabIndex).toBe(0)
  })

  test('Enter and Space place X on the focused empty cell', async () => {
    const user = userEvent.setup()
    render(<TicTacToe />)

    await user.tab()
    await user.keyboard('{Enter}')
    expect(cells()[0].getAttribute('aria-label')).toBe('Row 1, column 1, X')
    await waitFor(() => expect(status()).toMatch(/your turn/i))

    const empty = cells().findIndex((c) => c.getAttribute('aria-label')?.endsWith('empty'))
    cells()[empty].focus()
    await user.keyboard(' ')
    expect(cells()[empty].getAttribute('aria-label')).toMatch(/, X$/)
  })
})
