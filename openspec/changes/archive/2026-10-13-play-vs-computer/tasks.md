# Tasks

## 1. Test setup

- [x] 1.1 Install dev dependencies `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom` and `vite-tsconfig-paths`. Verify `npm ls vitest` lists the package.
- [x] 1.2 Add `vitest.config.mts` (jsdom, React plugin, tsconfig paths) as described in `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`, and a `"test": "vitest run"` script. Verify with a throwaway smoke test that `npm test` runs and exits 0, then delete the smoke test.

## 2. Game rules (`lib/tic-tac-toe/game.ts`)

- [x] 2.1 Implement the `Board` type, an empty board, `applyMove` (returns the board unchanged for an occupied or out-of-range cell), `getWinner` (mark and winning-line indices) and `isDraw`. Verify `lib/tic-tac-toe/game.test.ts` passes. It must cover all 8 winning lines, a win on the final cell counting as a win and not a draw, a full board with no line counting as a draw, and an occupied-cell move leaving the board unchanged.

## 3. Computer opponent (`lib/tic-tac-toe/ai.ts`)

- [x] 3.1 Implement `chooseMove(board)` using minimax with depth-weighted scores (`10 − depth` / `depth − 10` / 0), breaking ties by lowest index. Verify `lib/tic-tac-toe/ai.test.ts` passes, covering: it always returns an empty cell; it takes an immediate win; it blocks a single two-X threat when it can't win.
- [x] 3.2 Add the exhaustive test. It recursively plays every legal human (X-first) move sequence against `chooseMove` to the end of each game and asserts that no game ends with an X win and that every AI move is on an empty cell. Verify it passes in under 5 seconds with `npm test`.

## 4. Game component (`app/tic-tac-toe.tsx`)

- [x] 4.1 Create the `'use client'` component with a `useReducer` state `{ board, phase }` (`human` / `computer` / `won` / `draw`) and actions `humanMove` and `computerMove`, which ignore illegal moves. Render a status `<p role="status" aria-live="polite">` and a 3×3 `role="grid"` of `<button>` cells. Verify with `app/tic-tac-toe.test.tsx`: initial render shows 9 empty cells and "your turn as X"; clicking an empty cell places X; clicking an occupied cell does nothing.
- [x] 4.2 Add the computer turn. After a human move that doesn't end the game, enter the `computer` phase and schedule `chooseMove` with `setTimeout` (`COMPUTER_DELAY_MS ≈ 300`), clearing it on unmount. Verify component tests with fake timers: input is ignored during the computer phase; an O appears in an empty cell by 1000 ms; the status returns to the player's turn; no O is placed after a human move that ends the game.
- [x] 4.3 Add game-over handling. The win and draw status text names the result, the board locks, and the winning cells get a non-color highlight (ring plus background) and a ", winning line" label suffix. Verify with component tests driving a computer win and a draw: the status text, exactly 3 cells labelled as the winning line, and that further clicks change nothing.
- [x] 4.4 Add accessibility. Each cell's `aria-label` reads "Row R, column C, empty|X|O". Occupied cells and finished games use `aria-disabled`. The board is one Tab stop with a roving `tabIndex`, and arrow keys move focus. `focus-visible` rings have at least 3:1 contrast. Verify with component tests: arrow keys move focus between cells; Enter or Space on a focused empty cell places X; labels match the board contents.

## 5. Page integration

- [x] 5.1 Replace the starter `app/page.tsx` with a Server Component that renders an `<h1>` and `<TicTacToe />`, and update the `metadata` title and description in `app/layout.tsx`. Verify `npm run lint` and `npm run build` both succeed, and a page test renders the heading and the grid.
- [x] 5.2 Style the board as a responsive square grid (`min(90vw, 24rem)`) with large X/O glyphs that work in light and dark mode. Verify manually in the browser: at a 375×812 viewport each cell is at least 44×44px and `document.documentElement.scrollWidth <= innerWidth`; the winning-line highlight and focus ring are visible in both color schemes.

## 6. Integration check

- [x] 6.1 Play complete games in `npm run dev`: lose to the computer, reach a draw, play a full game by keyboard only, and reload mid-game to confirm an empty board. Check a screen reader announces the cell labels and the result. Verify every scenario in `specs/tic-tac-toe-game/spec.md` and `specs/computer-opponent/spec.md` is observed, and `npm test` passes.

## Workflow follow-up

- Open a PR that references issue #1; the `main` branch requires one approval.
- Archive the change after the PR is merged.
