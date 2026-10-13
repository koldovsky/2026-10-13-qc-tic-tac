---
name: improve-user-story
description: Review and rewrite user stories so they follow INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable) and have clear, testable acceptance criteria. Use when the user shares a user story, backlog item, ticket, or feature request and wants it improved, refined, groomed, split, or checked, or says "improve this story", "refine this ticket", "add acceptance criteria", "is this story INVEST?", or "/improve-user-story".
---

# Improve User Story

Turn rough backlog items into well-formed user stories: a clear story statement, INVEST compliance, and testable acceptance criteria (ACs).

## Input

The user provides one or more stories: free text, a ticket, a file path, or a link. If it's a file, read it. If the input is only a vague idea, still produce a best-effort draft and list your assumptions. Don't block on questions you can answer with a reasonable assumption.

Look at the project context (README, `openspec/` specs, the app code) when it helps you name real personas, screens, and rules. Don't invent product facts. When an AC depends on a rule nobody confirmed, tag it with an assumption ID (e.g. `(A1)`) and list that assumption under Notes.

## Process

### 1. Assess the original

Score the story against each INVEST criterion: ✅ pass, ⚠️ partial, ❌ fail. Give a one-line reason for each.

| Criterion | Ask |
|---|---|
| **I**ndependent | Does it depend on, or overlap with, *other stories*: ordering, shared behavior, or one being unusable without the other? Name the specific dependency. Bundling several goals into one story is **not** an Independent problem; score that under Small. |
| **N**egotiable | Does it describe the need and the outcome, not lock in a UI or implementation? |
| **V**aluable | Does a real user or stakeholder get observable value? (A technical task alone is not a story.) |
| **E**stimable | Is there enough information for the team to size it? What's unknown? |
| **S**mall | Does it fit in one sprint, ideally a few days? Does it have one main goal? |
| **T**estable | Can someone objectively verify it's done? Are vague words like "fast", "easy", or "user-friendly" quantified? |

Also flag common smells:
- No persona ("as a user"), a generic role (e.g. just "player" in a game), or a system as the persona
- Missing "so that" or a benefit that restates the feature
- Several goals joined by "and" or "or"
- Solution prescribed in the story ("add a dropdown…")
- Unbounded scope ("all", "any", "etc.")
- Missing error, empty, or edge states
- Non-functional needs (performance, accessibility, security) implied but unstated

### 2. Rewrite the story

Use the Connextra format with a **single** persona:

> **As a** \<specific persona\>, **I want** \<goal / capability\>, **so that** \<benefit / outcome\>.

- Name a concrete persona that captures who they are or the situation they're in (e.g. "first-time player", "player who misclicked", "player sharing a device with a friend"), not just the generic role.
- State the goal in user terms, with no UI or tech prescriptions.
- The benefit should explain *why* and be distinct from the goal.

### 3. Write acceptance criteria

Write every AC in this exact format, with a numbered, named title and all three of Given, When, and Then:

```markdown
**AC1 – <short name>**
- Given <precondition / context>
- When <action / event>
- Then <observable outcome>
- And <additional outcome>   ← optional
```

Rules for good ACs:
- Every AC has a **When**. For state-only checks, use the event that displays the state (e.g. "When the board is shown").
- Cover the **happy path**, **alternative paths**, **errors and validation**, and **edge or boundary cases** (empty, max, concurrent, offline, and so on, when relevant).
- Each AC is **observable and binary**: a tester can say pass or fail with no judgment call.
- Quantify anything vague: "within 1 second", "max 50 characters", "WCAG 2.1 AA contrast".
- Describe behavior, not implementation. "Then the move is rejected and an error is shown" beats "Then validateMove() returns false".
- Tag any AC that rests on an unconfirmed product rule with its assumption ID, e.g. `(A1)`.
- Typically 3–8 ACs. If you need many more, the story is probably too big (see step 4).
- Add **non-functional ACs** only when they genuinely apply (accessibility, performance, security, i18n).

### 4. Split if it's too big

If the story fails **Small**, propose a split into smaller stories. Each split story must pass INVEST on its own and gets its **own story statement and ACs**. Choose one of these patterns and name it exactly:
- **Separate capabilities**: the story bundles unrelated features (split along "and" / "or")
- **Workflow steps**
- **Business rule variations**
- **Happy path first, then edge or error cases**
- **Data variations or input types**
- **Platforms or interfaces**
- **CRUD operations**
- **Simple first, then complex** (e.g. hard-coded first, then configurable)

Prefer **vertical slices**, where each split delivers end-to-end user value. Never split into horizontal layers like "UI story" plus "backend story".

**Spikes are not a split.** If the story fails **Estimable** because of a technical or product unknown, recommend a time-boxed spike as a separate research task that comes *before* the story. Give it a clear question to answer and a time-box. Don't write it as a user story, and don't score it against INVEST.

If the story fails **Independent**, don't split it. Name the dependency, and suggest reordering, merging the overlapping behavior into one story, or an AC or open question that settles how the stories interact.

### 5. Add supporting notes

Always include **Assumptions** and **Open questions** (write "none" if empty). Add the rest only when useful:
- **Assumptions**: numbered (`A1`, `A2`, …); what you inferred that the PO should confirm
- **Open questions**: things that block estimation or acceptance
- **Out of scope**: what's explicitly excluded, to keep the story small
- **Dependencies**: other stories or systems, ideally none
- **Definition-of-Done reminders**: only if story-specific (e.g. "update the rules page")

## Output format

For each story, produce:

```markdown
## Original
> <original text>

### INVEST assessment
| Criterion | Result | Notes |
|---|---|---|
| Independent | ✅/⚠️/❌ | … |
| Negotiable | … | … |
| Valuable | … | … |
| Estimable | … | … |
| Small | … | … |
| Testable | … | … |

**Smells:** <bullet list, or "none">

## Improved story            ← when no split is needed
**Title:** <short, verb-first, e.g. "Undo last move">

**As a** …, **I want** …, **so that** ….

### Acceptance criteria
**AC1 – <name>**
- Given …
- When …
- Then …

### Notes
- **Assumptions:** A1 – … (or "none")
- **Open questions:** … (or "none")

## Suggested split           ← replaces "Improved story" when a split is needed
**Pattern:** <pattern name from step 4>

### 1. <Title>
**As a** …, **I want** …, **so that** ….
<ACs in the format above>

### 2. <Title>
…

### Notes
<assumptions, open questions, and cross-story dependencies>
```

**Where output goes:** reply in chat by default. Write a file only when the user asks or gave a file as input. **Never overwrite the input file.** Write to the path the user names, or to `stories/<slug>.md` if they don't name one.

If the user gives several stories, process each one, then point out any cross-story dependencies or overlaps at the end.

## Example

### Original
> As a user I want the game to be better with AI and undo and score tracking.

#### INVEST assessment
| Criterion | Result | Notes |
|---|---|---|
| Independent | ⚠️ | No dependency on other backlog stories, but within it Undo and the AI opponent interact (what does Undo revert against the computer?). |
| Negotiable | ✅ | Names outcomes, not a UI or implementation. |
| Valuable | ⚠️ | No "so that"; the benefit of each feature is unstated. |
| Estimable | ❌ | "AI" is undefined (difficulty? strategy?), so it can't be sized. |
| Small | ❌ | Three separate capabilities joined by "and". |
| Testable | ❌ | "Better" has no measurable outcome. |

**Smells:** generic persona ("user"); missing benefit; several goals joined by "and"; vague wording ("better").

### Suggested split
**Pattern:** Separate capabilities

#### 1. Play against the computer
**As a** solo player with no one to play with, **I want** to play against a computer opponent **so that** I can enjoy a game on my own.

**AC1 – Start a solo game**
- Given the player is on the start screen
- When they choose to play against the computer
- Then a new game starts with the player as X, moving first (A1)

**AC2 – Computer replies**
- Given it is the computer's turn
- When the player's move has been placed
- Then the computer places a legal move within 1 second

**AC3 – Computer never plays illegally**
- Given any board state with an empty cell
- When the computer moves
- Then it only places its mark on an empty cell

#### 2. Undo last move
**As a** player who misclicked, **I want** to undo my last move **so that** an accidental click doesn't cost me the game.

**AC1 – Undo in a two-player game**
- Given a two-player game with at least one move made
- When the player selects Undo
- Then the most recent move is removed
- And the turn passes back to the player who made it

**AC2 – Undo against the computer**
- Given a game against the computer where the player has made at least one move
- When the player selects Undo
- Then the computer's last reply and the player's last move are both removed
- And it is the player's turn again (A2)

**AC3 – Nothing to undo**
- Given no moves have been made
- When the board is shown
- Then the Undo control is disabled

**AC4 – Undo after the game ends**
- Given the game has ended in a win or draw
- When the player selects Undo
- Then the final move is removed and the game resumes as in progress (A3)

**AC5 – Keyboard accessible**
- Given focus is on the Undo control
- When the player presses Enter or Space
- Then the undo is performed

#### 3. Track scores across rounds
**As a** player sharing a device with a friend, **I want** wins and draws tallied across rounds **so that** I can see who's ahead.

**AC1 – Win is counted**
- Given a round ends with a win
- When the result is shown
- Then the winner's tally increases by 1

**AC2 – Draw is counted**
- Given a round ends in a draw
- When the result is shown
- Then the draw tally increases by 1

**AC3 – Tally persists between rounds**
- Given a tally of at least one result
- When the players start a new round
- Then the tally is unchanged

### Notes
- **Assumptions:** A1 – the human always plays X and moves first against the computer. A2 – against the computer, Undo reverts a full exchange (the AI reply plus the player's move); otherwise the AI would immediately replay. A3 – Undo is allowed after a game ends; many games disable it, so the PO must confirm.
- **Open questions:** What difficulty should the computer play at? Do scores reset on page reload? Does undoing a finished game also reverse its score tally (story 2 vs. story 3)?
- **Dependencies:** Story 2's AC2 needs story 1. Build story 1 first, or ship AC2 with story 1.
- **Spike (before story 1):** If the team can't size the computer opponent, time-box 1 day to answer: "Can a simple rule-based opponent be good enough, or do we need minimax?"
