## Purpose

Defines how the computer opponent plays O against the human: it only makes legal moves, plays perfectly so it never loses, and replies promptly.

## ADDED Requirements

### Requirement: Computer replies after each human move
After the human places an X and the game isn't over, the computer SHALL place an O. Its O SHALL appear within 1 second of the human's move, and then it's the human's turn again.

#### Scenario: Computer takes its turn
- **WHEN** the player places an X and the game isn't over
- **THEN** an O appears in an empty cell within 1 second
- **AND** the status says it's the player's turn

#### Scenario: No reply after the game ends
- **WHEN** the player's X ends the game in a win or draw
- **THEN** the computer doesn't place an O

### Requirement: Computer plays only legal moves
The computer SHALL only place its O on an empty cell, and SHALL place exactly one O per turn.

#### Scenario: Computer chooses an empty cell
- **WHEN** it's the computer's turn and the board has at least one empty cell
- **THEN** the computer places exactly one O, in a cell that was empty

### Requirement: Computer never loses
The computer SHALL play perfectly. For every possible sequence of human moves, the game SHALL end in a draw or a computer win, never a human win. This SHALL be verified by an automated test that plays every possible sequence of human moves to completion.

#### Scenario: Exhaustive play
- **WHEN** every possible sequence of human moves is played against the computer until each game ends
- **THEN** no game ends with a human win

#### Scenario: Computer takes an immediate win
- **WHEN** it's the computer's turn and it can complete a line of O this move
- **THEN** it completes that line and wins

#### Scenario: Computer blocks an immediate threat
- **WHEN** it's the computer's turn, it can't win this move, and the human has exactly one line with two X and the third cell empty
- **THEN** the computer places its O in that third cell
