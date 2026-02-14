# Design Decisions

This document captures key design decisions made during the development of Crystal Kingdoms 3JS. These decisions should be maintained and respected in future development.

## Architecture Decisions

### Decision: Headless-First Game Engine

**Date**: Initial implementation  
**Status**: Active

**Context**: The game needs to support multiple potential frontends (Three.js, 2D canvas, CLI) and enable thorough testing without requiring rendering infrastructure.

**Decision**: Implement the core game logic as a headless engine that operates independently of any rendering system.

**Consequences**:
- ✅ Core logic can be tested without graphics dependencies
- ✅ Multiple frontends can share the same game engine
- ✅ Game simulation and AI development is simplified
- ⚠️ Requires well-defined interface between engine and rendering layers

**Implementation**:
- All game state in `src/core/`
- Pure functions for game logic
- Event-driven architecture for rendering hooks

---

### Decision: Immutable State Pattern

**Date**: Initial implementation  
**Status**: Active

**Context**: Managing game state mutations is complex and error-prone. We need predictable state updates and the ability to implement undo/replay features.

**Decision**: Use immutable data structures throughout the codebase. All state modifications create new objects.

**Consequences**:
- ✅ Predictable state updates
- ✅ Easy to implement undo/replay
- ✅ Simplifies debugging and testing
- ✅ Prevents accidental mutations
- ⚠️ Slight performance overhead from object cloning

**Implementation**:
```typescript
export function cloneState(state: MatchState): MatchState {
  return {
    ...state,
    board: {
      ...state.board,
      cells: state.board.cells.map((cell) => ({ 
        owner: cell.owner, 
        contagion: { ...cell.contagion } 
      })),
    },
    players: Object.fromEntries(
      Object.entries(state.players).map(([id, p]) => [id, { ...p }]),
    ),
  };
}
```

---

### Decision: Event-Driven Resolution

**Date**: Initial implementation  
**Status**: Active

**Context**: The rendering layer needs to know what happened during action resolution to show animations, effects, and score updates.

**Decision**: The rules engine produces a deterministic event log alongside state changes.

**Consequences**:
- ✅ Separates game logic from presentation
- ✅ Enables step-by-step animations
- ✅ Facilitates testing and debugging
- ✅ Supports multiple rendering implementations
- ⚠️ Event processing must be handled by consumers

**Implementation**:
```typescript
export interface RuleEvent {
  type: 'capture_empty' | 'increment_contagion' | 'capture_contagion' | 'destroy_own_castle' | 'chain_ended';
  index?: number;
  actorId?: PlayerId;
  pointsDelta?: number;
}

export interface ResolveResult {
  state: MatchState;
  events: RuleEvent[];
}
```

---

## Game Mechanics Decisions

### Decision: Orthogonal-Only Adjacency

**Date**: Per MVP plan  
**Status**: Locked

**Context**: The game could use 4-directional or 8-directional adjacency for scoring and movement.

**Decision**: Use orthogonal (4-directional) adjacency only. No diagonal connections.

**Consequences**:
- ✅ Simpler mental model for players
- ✅ More predictable chain behavior
- ✅ Clearer visual representation
- ❌ Less strategic depth than 8-directional

**Rationale**: Keeps the game accessible and reduces visual complexity on the grid.

---

### Decision: Wrap-Around as Configurable Option

**Date**: Per MVP plan  
**Status**: Active

**Context**: Chain actions need to handle board edges.

**Decision**: Make wrap-around configurable. When enabled, chains wrap around edges. When disabled, chains stop at edges.

**Consequences**:
- ✅ Accommodates different play styles
- ✅ Affects strategic depth
- ⚠️ Must be clearly communicated to players

**Implementation**:
```typescript
export interface GameConfig {
  wrapAround: boolean;
  // ... other options
}
```

---

### Decision: Step-by-Step Chain Scoring

**Date**: Per MVP plan  
**Status**: Locked

**Context**: During chain actions, multiple castles are affected. The timing of score updates affects gameplay feel.

**Decision**: Score changes are calculated and displayed step-by-step as the chain progresses, with cursor movement at fast/moderate speed.

**Consequences**:
- ✅ Immediate feedback for each action
- ✅ Players can follow the chain visually
- ✅ More satisfying gameplay experience
- ⚠️ Requires event-driven architecture

**Implementation**: Events are produced per step, consumed by rendering layer for timed display.

---

### Decision: Chain Completion After Time Expiry

**Date**: Per MVP plan  
**Status**: Locked

**Context**: What happens if time runs out mid-chain?

**Decision**: If time expires during chain processing, the current chain completes before the match ends.

**Consequences**:
- ✅ Prevents frustrating mid-action termination
- ✅ Fair to all players
- ⚠️ Match can run slightly over time limit

---

### Decision: Two Scoring Modes

**Date**: Per MVP plan  
**Status**: Active

**Context**: Different scoring systems appeal to different player preferences.

**Decision**: Support two modes:
1. **Basic**: Points for captures, contagion gain, and contagion loss
2. **Only Castles**: Points only for castle captures (no contagion gain points)

**Consequences**:
- ✅ Accommodates different play styles
- ✅ "Only Castles" is simpler for new players
- ⚠️ Must be balanced separately

**Implementation**:
```typescript
export type ScoringMode = 'basic' | 'onlyCastles';

export function contagionGainPoints(level: number, mode: ScoringMode): number {
  return mode === 'onlyCastles' ? 0 : level;
}
```

---

## Technical Decisions

### Decision: TypeScript with Strict Mode

**Date**: Initial implementation  
**Status**: Active

**Context**: Need strong type safety for complex game state.

**Decision**: Use TypeScript with strict mode enabled.

**Consequences**:
- ✅ Catches errors at compile time
- ✅ Better IDE support
- ✅ Self-documenting code
- ⚠️ Slightly more verbose

---

### Decision: Vitest for Testing

**Date**: Initial implementation  
**Status**: Active

**Context**: Need a modern, fast testing framework compatible with ESM and TypeScript.

**Decision**: Use Vitest as the testing framework.

**Consequences**:
- ✅ Fast test execution
- ✅ Great TypeScript support
- ✅ Jest-compatible API
- ✅ Built-in ESM support

---

### Decision: ESM Module System

**Date**: Initial implementation  
**Status**: Active

**Context**: Modern JavaScript ecosystem is moving to ESM.

**Decision**: Use ESM modules with `.js` extensions in imports.

**Consequences**:
- ✅ Future-proof
- ✅ Better tree-shaking
- ✅ Native browser support
- ⚠️ Requires `.js` extension in imports despite TypeScript source

---

## Constraints and Limits

### Decision: Board Size Range (4×4 to 8×8)

**Date**: Per MVP plan  
**Status**: Active

**Context**: Very small boards lack strategic depth; very large boards become overwhelming.

**Decision**: Support board sizes from 4×4 to 8×8.

**Consequences**:
- ✅ Covers casual to complex gameplay
- ✅ Reasonable for rendering performance
- ⚠️ Must validate input

**Implementation**:
```typescript
export function createBoard(size: number): BoardState {
  if (size < 4 || size > 8) {
    throw new Error('Board size must be between 4 and 8');
  }
  // ...
}
```

---

## Maintenance Guidelines

When adding new features:

1. **Document the Decision**: Add an entry to this file with context, decision, and consequences
2. **Maintain Patterns**: Follow established patterns (immutability, pure functions, events)
3. **Update Tests**: Ensure test coverage for new functionality
4. **Update README**: Reflect changes in user-facing documentation
5. **Consider Impact**: Evaluate how changes affect existing decisions

When modifying existing features:

1. **Review This Document**: Understand the original decision and rationale
2. **Assess Trade-offs**: Consider why the original decision was made
3. **Document Changes**: Update this file if the decision changes
4. **Migration Path**: If changing patterns, ensure existing code is updated consistently
