import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Home from './page'

test('home page renders the heading and the board', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1, name: 'Tic-tac-toe' })).toBeTruthy()
  expect(screen.getByRole('grid', { name: 'Tic-tac-toe board' })).toBeTruthy()
})
