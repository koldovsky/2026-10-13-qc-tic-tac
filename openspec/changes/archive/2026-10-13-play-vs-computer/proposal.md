# Proposal

## Why

The app is still the default Next.js starter page, so there's nothing to play yet. Issue #1 asks for the first playable slice: one person playing a full game of tic-tac-toe against a computer opponent, on desktop or mobile, with mouse, touch or keyboard.

## What Changes

- Replace the starter home page (`/`) with a tic-tac-toe game.
- Add a 3×3 board. The human always plays X and moves first, and the computer plays O. Occupied cells and finished games ignore input.
- Add an unbeatable computer opponent (perfect play) that replies within 1 second.
- Detect wins and draws. Show the result in a status message, highlight the winning line, and lock the board.
- Make the game accessible and responsive: keyboard navigation, a visible focus indicator, screen-reader announcements of status changes, touch targets of at least 44×44px, no horizontal scrolling at 375px width, and WCAG 2.1 AA contrast.
- Add a unit-test setup (Vitest) so the game rules and the unbeatable opponent can be verified automatically, including an exhaustive test over every possible sequence of human moves.
- Out of scope: starting a new game or restarting (issue #3), two-player mode, difficulty levels, choosing X or O, scores, undo, and saving the game across reloads. A page reload simply starts a fresh game.

## Capabilities

### New Capabilities
- `tic-tac-toe-game`: The playable game: the board, turn order, move validation, win and draw detection, the result display with the winning-line highlight, and accessibility and responsive behavior.
- `computer-opponent`: How the computer chooses and plays its moves: legal moves only, perfect play that never loses, and the response time.

### Modified Capabilities
- None. There are no existing specs.

## Impact

- **Code:** `app/page.tsx` is replaced. New game components go under `app/` and pure game logic under `lib/`. `app/layout.tsx` metadata gets a real title and description.
- **Dependencies (dev only):** `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`. It also bumps `@types/node` from `^20` to `^24` to match the Node 24 runtime, which Vitest 5 requires, and adds a `test` script to `package.json`.
- **Runtime:** client-side only, with no server, API or storage changes.
- **Issue #3** (Start a new game) builds on this change.
