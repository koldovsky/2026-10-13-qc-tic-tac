# tic-tac-toe-game Specification

## Purpose

Lets a single person play a complete game of tic-tac-toe in the browser: a 3×3 board with turn order, move validation, win and draw detection, and a clear result. It works with mouse, touch, keyboard and screen readers.

## Requirements

### Requirement: Game starts ready to play
When the game page is opened or reloaded, the system SHALL show an empty 3×3 board. The status SHALL say it's the human's turn as X. No game state is kept across page loads.

#### Scenario: Opening the page
- **WHEN** the player opens the game page
- **THEN** an empty 3×3 board is displayed
- **AND** the status says it's the player's turn as X

#### Scenario: Reloading mid-game
- **WHEN** the player reloads the page while a game is in progress
- **THEN** an empty board is displayed and it's the player's turn as X

### Requirement: Human places X on an empty cell
On the human's turn, selecting an empty cell SHALL place an X in it and pass the turn to the computer. While it's the computer's turn, the board SHALL ignore human input.

#### Scenario: Placing a mark
- **WHEN** it's the player's turn and they select an empty cell
- **THEN** an X appears in that cell
- **AND** the status says the computer is moving

#### Scenario: Input during the computer's turn
- **WHEN** it's the computer's turn and the player selects an empty cell
- **THEN** the board doesn't change

### Requirement: Occupied cells reject moves
Selecting a cell that already contains X or O SHALL leave the board and the turn unchanged.

#### Scenario: Selecting an occupied cell
- **WHEN** it's the player's turn and they select a cell that contains X or O
- **THEN** the board doesn't change
- **AND** it's still the player's turn

### Requirement: Win is detected
The game SHALL end as soon as one mark fills a full row, column or diagonal. The status SHALL name the winner.

#### Scenario: Computer completes a line
- **WHEN** the computer places an O that completes three in a row
- **THEN** the game ends and the status says the computer won

#### Scenario: Win on the final cell
- **WHEN** the last empty cell is filled and that move completes a line
- **THEN** the result is a win, not a draw

### Requirement: Winning line is highlighted
When a game is won, the three winning cells SHALL be visually distinguished from the other cells by more than color alone. Their contrast SHALL meet WCAG 2.1 AA.

#### Scenario: Highlight after a win
- **WHEN** a game ends in a win
- **THEN** exactly the three cells of the winning line are highlighted
- **AND** the highlight doesn't rely on color alone and meets WCAG 2.1 AA contrast

### Requirement: Draw is detected
When all nine cells are filled and no line is complete, the game SHALL end in a draw, and the status SHALL say so.

#### Scenario: Board fills with no winner
- **WHEN** the last empty cell is filled and no row, column or diagonal is complete
- **THEN** the game ends and the status says it's a draw

### Requirement: Finished game locks the board
After a win or draw, the board SHALL accept no further moves.

#### Scenario: Selecting a cell after the game ends
- **WHEN** the game has ended and the player selects an empty cell
- **THEN** the board doesn't change and the result stays displayed

### Requirement: Keyboard play
Every cell SHALL be reachable and playable from the keyboard. The focused cell SHALL have a clearly visible focus indicator.

#### Scenario: Playing with the keyboard
- **WHEN** the player moves focus to an empty cell using the keyboard and presses Enter or Space on their turn
- **THEN** an X is placed in that cell

#### Scenario: Focus is visible
- **WHEN** a cell has keyboard focus
- **THEN** a visible focus indicator is shown on that cell with at least 3:1 contrast against its surroundings

### Requirement: Screen reader support
Each cell SHALL expose its position and contents to assistive technology. Status changes (whose turn, result) SHALL be announced without moving focus.

#### Scenario: Cell is described
- **WHEN** a screen reader focuses a cell
- **THEN** it announces the cell's row and column and whether it's empty, X or O

#### Scenario: Result is announced
- **WHEN** the game ends in a win or draw
- **THEN** the result is announced by the screen reader without the player moving focus

### Requirement: Mobile and touch layout
The game SHALL be fully playable on a 375px-wide touch screen. Each cell SHALL be at least 44×44 CSS pixels, and the page SHALL not scroll horizontally.

#### Scenario: Narrow touch screen
- **WHEN** the page is shown in a 375px-wide viewport and the player taps an empty cell on their turn
- **THEN** an X is placed in that cell
- **AND** every cell is at least 44×44 CSS pixels and the page has no horizontal scroll
