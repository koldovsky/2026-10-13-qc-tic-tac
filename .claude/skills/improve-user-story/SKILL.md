---
name: improve-user-story
description: Review and rewrite user stories so they follow INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable) and have clear, testable acceptance criteria. Use when the user shares a user story, backlog item, ticket, or feature request and wants it improved, refined, groomed, split, or checked, or says "improve this story", "refine this ticket", "add acceptance criteria", "is this story INVEST?", or "/improve-user-story".
---

# Improve User Story

Turn rough backlog items into well-formed user stories: a clear story statement, INVEST compliance, and testable acceptance criteria (ACs).

## Input

The user provides one or more stories: free text, a ticket, a file path, or a link. If it's a file, read it. If the input is only a vague idea, still produce a best-effort draft and list your assumptions. Don't block on questions you can answer with a reasonable assumption.

Look at the project context (README, `openspec/` specs, the app code) when it helps you name real personas, screens, and rules. Don't invent product facts; mark them as assumptions instead.

## Process

### 1. Assess the original

Score the story against each INVEST criterion: ✅ pass, ⚠️ partial, ❌ fail. Give a one-line reason for each.

| Criterion | Ask |
|---|---|
| **I**ndependent | Can it be built, tested, and released without waiting on another story? Are there hidden ordering dependencies? |
| **N**egotiable | Does it describe the need and the outcome, not lock in a UI or implementation? |
| **V**aluable | Does a real user or stakeholder get observable value? (A technical task alone is not a story.) |
| **E**stimable | Is there enough information for the team to size it? What's unknown? |
| **S**mall | Does it fit in one sprint, ideally a few days? Does it have one main goal? |
| **T**estable | Can someone objectively verify it's done? Are vague words like "fast", "easy", or "user-friendly" quantified? |

Also flag common smells:
- No persona ("as a user") or a system as the persona
- Missing "so that" or a benefit that restates the feature
- Several goals joined by "and" or "or"
- Solution prescribed in the story ("add a dropdown…")
- Unbounded scope ("all", "any", "etc.")
- Missing error, empty, or edge states
- Non-functional needs (performance, accessibility, security) implied but unstated

### 2. Rewrite the story

Use the Connextra format:

> **As a** \<specific persona\>, **I want** \<goal / capability\>, **so that** \<benefit / outcome\>.

- Name a concrete persona (e.g. "first-time player", "returning player", "admin"), not just "user".
- State the goal in user terms, with no UI or tech prescriptions.
- The benefit should explain *why* and be distinct from the goal.

### 3. Write acceptance criteria

Use Given/When/Then (Gherkin-style). Write one scenario per rule or behavior:

```
Scenario: <short name>
  Given <precondition / context>
  When <action / event>
  Then <observable outcome>
  [And <additional outcome>]
```

Rules for good ACs:
- Cover the **happy path**, **alternative paths**, **errors and validation**, and **edge or boundary cases** (empty, max, concurrent, offline, and so on, when relevant).
- Each AC is **observable and binary**: a tester can say pass or fail with no judgment call.
- Quantify anything vague: "within 1 second", "max 50 characters", "WCAG 2.1 AA contrast".
- Describe behavior, not implementation. "Then the move is rejected and an error is shown" beats "Then validateMove() returns false".
- Typically 3–8 ACs. If you need many more, the story is probably too big (see step 4).
- Add **non-functional ACs** only when they genuinely apply (accessibility, performance, security, i18n).

### 4. Split if it's too big

If the story fails **Small** or **Independent**, propose a split into smaller stories, each one INVEST on its own and each with its own ACs. Choose a splitting pattern and name it:
- Workflow steps
- Business rule variations
- Happy path first, then edge or error cases
- Data variations or input types
- Platforms or interfaces
- CRUD operations
- Simple first, then complex (e.g. hard-coded first, then configurable)
- Spike (only to resolve an unknown blocking estimation; time-boxed, with a clear question to answer)

Prefer **vertical slices**, where each split delivers end-to-end user value. Never split into horizontal layers like "UI story" plus "backend story".

### 5. Add supporting notes

Add these only when they're useful:
- **Assumptions**: what you inferred that the PO should confirm
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

## Improved story
**Title:** <short, verb-first, e.g. "Undo last move">

**As a** …, **I want** …, **so that** ….

### Acceptance criteria
**AC1 – <name>**
- Given …
- When …
- Then …

**AC2 – …**

### Notes
- **Assumptions:** …
- **Open questions:** …
- **Out of scope:** …

## Suggested split  ← only if needed
Pattern: <pattern name>
1. <Story title>: As a … I want … so that …  (ACs: …)
2. …
```

Keep it concise. Write the result to a file (e.g. `stories/<slug>.md`) only if the user asks or provided a file. Otherwise, reply in chat. If the user gives several stories, process each one, then point out any cross-story dependencies or overlaps at the end.

## Example

**Input:** "As a user I want the game to be better with AI and undo and score tracking."

**Assessment highlights:** ❌ Small (three features), ❌ Testable ("better"), ⚠️ Valuable (benefit missing), ❌ Independent (bundled).

**Split (pattern: separate features / business capabilities):**
1. **Play against the computer.** As a solo player, I want to play against a computer opponent so that I can play without a second person.
2. **Undo last move.** As a player, I want to undo my last move so that I can recover from an accidental click.
3. **Track scores across rounds.** As two players sharing a device, we want wins and draws tallied across rounds so that we can see who's ahead.

Story 2's ACs:
- **AC1 – Undo restores the board.** Given at least one move has been made, when the player selects Undo, then the most recent move is removed and the turn passes back to that player.
- **AC2 – Nothing to undo.** Given no moves have been made, then the Undo control is disabled.
- **AC3 – Game over.** Given the game has ended in a win or draw, when the player selects Undo, then the final move is removed and the game resumes as in progress.
- **AC4 – Keyboard accessible.** Given focus is on the Undo control, when the player presses Enter or Space, then the undo is performed.
