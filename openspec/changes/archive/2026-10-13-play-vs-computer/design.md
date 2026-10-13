# Design

## Context

- The app is a fresh `create-next-app` project: Next.js 16.4 with the App Router, React 19.3, Tailwind CSS v4 and TypeScript strict mode. The only page is the starter `app/page.tsx`, and there's no test setup.
- `AGENTS.md` warns that this Next.js version differs from older versions. The relevant local docs (`node_modules/next/dist/docs/`) are "Server and Client Components" and the Vitest testing guide.
- Everything runs in the browser, with no backend, persistence or routing. See proposal.md for scope and the specs for the behavior required.

## Goals / Non-Goals

**Goals:**
- Keep the game rules and the AI as pure, framework-free TypeScript, so the exhaustive "never loses" check is a fast unit test.
- Keep the client bundle small: only the interactive game is a Client Component, and the page shell stays a Server Component.
- Shape the state so issue #3 (Start a new game) can add a reset without restructuring.

**Non-Goals:**
- No end-to-end browser tests (for example, Playwright) in this change. Component tests in jsdom cover the interaction specs. Layout checks (44px cells, no horizontal scroll at 375px, contrast) are verified manually in the browser and listed as tasks.
- No difficulty levels, and no opponent interface designed for them.

## Decisions

### 1. Module layout
- `lib/tic-tac-toe/game.ts` holds pure rules: the `Board` type (9 cells of `'X' | 'O' | null`), `applyMove`, `getWinner` (returns the mark and the winning line's indices), `isDraw`, and `getStatus`.
- `lib/tic-tac-toe/ai.ts` holds `chooseMove(board): number`, the computer's move for O.
- `app/tic-tac-toe.tsx` is the `'use client'` component that owns the state and renders the board and status.
- `app/page.tsx` is a Server Component that renders a heading and `<TicTacToe />`.

*Alternative:* put everything in `page.tsx` with `'use client'`. Rejected because it ships the whole page to the client and mixes logic into the UI, which makes it hard to test.

### 2. AI: minimax with depth-weighted scores
The AI uses full minimax over the game tree. A win scores `10 − depth`, a loss scores `depth − 10`, and a draw scores 0. Weighting by depth makes the computer take an immediate win and put off a loss. That satisfies the "takes an immediate win" scenario without special-case code. When moves tie, it picks the lowest cell index, so the AI is deterministic and tests are reproducible.

The game tree has at most 9! leaves (in practice about 255k games), and the AI only ever searches after the human's first move (≤ 8! positions). That's a few milliseconds in a browser, so it needs no memoization or alpha-beta pruning. A memo keyed by board string is a cheap fallback if profiling shows otherwise.

*Alternatives:* hard-coded rule strategies (win, block, fork, center, corner) are fast but easy to get subtly wrong, and a perfect-play rule set is long. A precomputed lookup table is fast but opaque and adds build steps. Minimax is short and obviously correct.

### 3. Computer turn timing
After the human's move, the component goes into a `computer-thinking` state and schedules the AI move with `setTimeout`. The delay is short (≈ 300 ms) so the reply feels natural but stays well within the 1-second requirement. The board ignores input during that state. The pending timeout is cleared on unmount, so issue #3 can also cancel it on reset; issue #3 has a scenario that the pending O must never appear on a new board.

*Alternative:* apply the AI move synchronously in the same state update. It's simpler, but the O appears instantly, the screen reader announces nothing between the two moves, and the "board ignores input during the computer's turn" requirement can't be observed. The delay is a constant, so it can be set to 0 if the product owner prefers instant replies.

### 4. State model
- Use `useReducer` with `{ board, phase }`, where `phase` is `'human' | 'computer' | 'won' | 'draw'`, plus a derived `winningLine`.
- The reducer actions are `humanMove(index)` and `computerMove(index)`. Both reject illegal moves, which covers occupied cells, the wrong phase and a finished game, by returning the state unchanged.
- Issue #3 will add a `reset` action.
- Nothing is stored in `localStorage`, so a reload naturally resets the game (spec: "Reloading mid-game").

### 5. Accessible markup
- The board is a `role="grid"` with three `role="row"` elements of `role="gridcell"` cells. Each cell is a native `<button>`, giving free Enter/Space activation and focusability.
- Each button's `aria-label` reads like "Row 1, column 2, empty", or "…, X". Occupied cells and finished games use `aria-disabled="true"` instead of `disabled`, so the buttons stay focusable and a screen reader can still read the board.
- **Arrow keys** move focus between cells using a roving `tabIndex`, so the board is a single Tab stop. This is better than nine Tab stops and matches the APG grid pattern.
- **Status** is shown in a `<p role="status" aria-live="polite">`.
- **Winning cells** get a thicker ring, a background change and `aria-label` "…, winning line", so the highlight doesn't rely on color alone.
- **Focus** uses a Tailwind `focus-visible:ring-*` with at least 3:1 contrast in both light and dark mode.

*Alternative:* nine plain buttons in a CSS grid with no grid roles. It's simpler but doesn't support arrow keys, and screen readers announce it less well. Implementing the roving tabindex is about 20 lines.

### 6. Layout
- The board is a CSS grid sized `min(90vw, 24rem)` square. At 375px that makes each cell about 108px, well above 44px, and the page never scrolls sideways.
- It uses the existing `--background` and `--foreground` tokens plus Tailwind zinc colors, so dark mode follows the starter's `prefers-color-scheme` setup.
- X and O are rendered as text glyphs in large type.

### 7. Testing: Vitest + React Testing Library
- Set Vitest up as described in the local Next.js guide (`vitest.config.mts`, jsdom, `@vitejs/plugin-react`) and add a `"test": "vitest run"` script. Use Vite's native `resolve.tsconfigPaths` instead of the `vite-tsconfig-paths` plugin, which Vite now flags as redundant. Use `@testing-library/user-event` for keyboard tests, because jsdom doesn't turn Enter or Space into button clicks. Those tests run on real timers, since user-event stalls under Vitest fake timers.
- **Unit tests** cover the rules (each of the 8 lines, a win on the last cell, a draw, illegal moves) and the AI (immediate win, block).
- **The exhaustive test** recursively plays every legal human move at every human turn, and the AI's reply, to the end of each game. It asserts that no game ends in a human win. It also asserts that every AI move is on an empty cell.
- **Component tests** use fake timers and cover: initial render; placing X; the occupied-cell no-op; input ignored during the computer's turn; the O appearing after the delay and within 1 s; result text and the winning-line labels; arrow-key and Enter navigation; and `role="status"` text updates.

*Alternatives:* Jest needs more configuration for ESM and TypeScript in Next 16. `node:test` has no jsdom or React Testing Library integration. Vitest is the option the bundled Next.js docs recommend.

## Risks / Trade-offs

- **[Perfect AI is frustrating: players can never win]** → This was confirmed as intended for issue #1. Difficulty levels are a candidate follow-up story.
- **[jsdom can't check layout or contrast]** → Tasks include manual checks at 375px and with keyboard and a screen reader. Contrast is checked against the chosen Tailwind colors.
- **[Exhaustive test runtime]** → The game tree is small (hundreds of thousands of positions), so it should run in well under a few seconds. If it becomes slow, memoize `chooseMove`.
- **[The reply delay is a product guess (open question on #1)]** → It's a single constant. Tests assert the reply arrives within 1 s, not the exact delay.
- **[`aria-disabled` buttons are still clickable]** → The click handler checks the reducer, which ignores illegal moves, so this is safe.

## Open Questions

- The exact status wording ("Your turn (X)", "Computer is thinking…", "Computer wins", "It's a draw") can be settled during implementation or review. The specs only require what the status communicates, not its exact text.
