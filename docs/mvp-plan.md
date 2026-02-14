# Crystal Kingdoms 3JS — MVP Plan

## Is this enough to start?

Yes — this outline is strong enough to begin MVP development. The key mechanics, options, and scoring logic are already defined at a level that can be implemented in vertical slices.

## MVP Goal

Deliver a playable single-match prototype that validates:

- Core turn/action loop (cursor spawn, player action, chain resolution)
- Castle ownership and contagion mechanics
- Basic scoring and win conditions
- Local human + CPU participation
- Configurable grid size and a small subset of options

## Suggested MVP Scope (Phase 1)

### In scope

1. **Board + State Model**
   - Grid sizes: 4x4 to 8x8
   - Castle ownership (`none | playerId`)
   - Per-castle contagion map by player
   - Cursor position + active flag

2. **Action System**
   - Spawn cursor on random empty castle after random delay
   - First actor wins the action opportunity
   - Tap/fire = act on current castle
   - Swipe/direction = chain action in direction
   - Wrap around board edges (option toggle can come in Phase 2)

3. **Resolution Rules**
   - Empty castle => capture by actor
   - Enemy castle => increment actor contagion and continue
   - Own castle => destroy castle (ownership cleared)
   - If contagion reaches capture threshold => capture and reset others' contagion on that castle

4. **Scoring**
   - Implement **Basic** scoring first
   - Add **Only Castles** as second mode if schedule allows

5. **Match End Conditions**
   - Time limit
   - Winning score
   - End match when either condition is met

6. **CPU (Simple)**
   - Reaction delay window based on difficulty
   - Random directional choice with mild bias toward nearby enemy/empty castles

### Out of scope for first MVP cut

- Advanced AI strategies
- Full polish/FX pass
- Full controller remapping UX
- Large options menu UX polish
- Networking/online play

## Architecture Proposal

## 1) Core Domains

- **GameConfig**: options and tunables
- **MatchState**: current board, players, score, timer, action counts
- **RulesEngine**: deterministic action/capture/scoring logic
- **TurnDirector**: cursor timing, input race, action execution lifecycle
- **CPUController**: AI decision + timing
- **Renderer/UI**: Three.js visuals + HUD

## 2) Data Structures

```ts
export type PlayerId = string;

export interface CastleState {
  owner: PlayerId | null;
  contagion: Record<PlayerId, number>; // missing key = 0
}

export interface BoardState {
  size: number; // 4..8
  cells: CastleState[]; // length = size * size
}

export interface PlayerState {
  id: PlayerId;
  name: string;
  color: string;
  isCpu: boolean;
  difficulty?: "easy" | "medium" | "hard";
  score: number;
  castlesOwned: number;
  actionsStarted: number;
}
```

## 3) Deterministic Rules Contract

Every action should run through a pure function:

```ts
resolveAction(state, actorId, startCell, direction | null) => nextState + eventLog
```

This makes balancing and testing much easier.

## Implementation Plan (Milestones)

### Milestone 1 — Playable Core Loop

- Build board state + rendering placeholders
- Spawn cursor + accept first input
- Implement action resolution chain
- Show ownership colors and contagion values

### Milestone 2 — Scoring + Match Flow

- Add basic scoring table
- Add timer + win-score checks
- Add end-of-match summary

### Milestone 3 — Options + CPU

- Configurable options subset:
  - grid size
  - time limit
  - winning score
  - capture contagion
  - speed preset
- Add simple CPU actors and difficulties

### Milestone 4 — MVP Hardening

- Add tests for rules engine
- Tune delays and values
- Improve readability (HUD, score panel, current actor indicators)

## Rules Clarifications To Lock Early

Before coding too far, decide these precisely:

1. **Adjacency** = orthogonal only, or include diagonals?
2. On swipe chain, does **every step** apply scoring/contagion instantly, or on chain end only?
3. If a player at **maximum castles** starts an action and would capture mid-chain, does chain stop immediately (as you suggested) or skip capture and continue?
4. In **Only Castles** mode, confirm capture/loss contagion score adjustments still apply exactly as described.
5. If timer expires mid-chain, does current chain complete or terminate immediately?

## Test Plan (MVP)

- Unit tests for `resolveAction` covering:
  - Empty capture
  - Enemy contagion increments and capture threshold conversion
  - Own-castle destroy case
  - Score gain/loss table
  - Max-castles and max-actions constraints
- Simulation test: run 1,000 CPU-only matches to catch deadlocks or invalid states.
- Snapshot/integration test: board serialization remains valid across turns.

## Immediate Next Step

Start with a **headless rules-engine prototype** (no graphics), then connect it to Three.js rendering. This reduces rework and lets balancing happen early.
