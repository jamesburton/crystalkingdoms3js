# Code Patterns and Conventions

This document outlines the coding patterns and conventions used in the Crystal Kingdoms 3JS project. All code changes should adhere to these patterns.

## TypeScript Configuration

- **Strict Mode**: Always enabled
- **Target**: ES2022
- **Module System**: ESNext with Bundler resolution
- **File Extensions**: Use `.js` extension in imports (ESM compatibility)

## Design Principles

### 1. Immutability

All state modifications must create new objects rather than mutating existing ones.

**Example:**
```typescript
// ✅ CORRECT
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

// ❌ INCORRECT
function mutateState(state: MatchState) {
  state.board.cells[0].owner = 'p1'; // Direct mutation
  return state;
}
```

### 2. Pure Functions

Core game logic functions must be pure (no side effects, deterministic output):

```typescript
// ✅ CORRECT - Pure function
export function resolveAction(
  state: MatchState,
  actorId: PlayerId,
  startCell: number,
  direction: Direction | null,
): ResolveResult {
  const next = cloneState(state);
  // ... deterministic logic
  return { state: next, events };
}

// ❌ INCORRECT - Side effects
function resolveAction(state: MatchState) {
  console.log('Resolving...'); // Side effect
  Math.random(); // Non-deterministic
}
```

### 3. Event-Driven Architecture

State changes must produce event logs for observability and testing:

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

## File Organization

### Module Structure

- **`src/core/types.ts`**: All TypeScript type definitions
- **`src/core/board.ts`**: Board-related utilities and navigation
- **`src/core/rules.ts`**: Core game rules engine
- **`src/core/engine.ts`**: High-level action orchestration
- **`src/core/scoring.ts`**: Scoring calculation functions
- **`src/core/match.ts`**: Match state management

### Import Conventions

- Always use `.js` extension in imports (ESM requirement)
- Use type-only imports where appropriate

```typescript
import type { Direction, MatchState, PlayerId } from './types.js';
import { nextIndexInDirection } from './board.js';
```

## Naming Conventions

- **Types**: PascalCase (e.g., `PlayerId`, `MatchState`)
- **Interfaces**: PascalCase (e.g., `CastleState`, `BoardState`)
- **Functions**: camelCase (e.g., `resolveAction`, `createBoard`)
- **Constants**: camelCase (e.g., `captureContagion`)
- **Type Aliases**: PascalCase (e.g., `type PlayerId = string`)

## Error Handling

- Validate inputs early and throw descriptive errors
- Use TypeScript's type system to prevent errors at compile time

```typescript
export function attemptAction(
  state: MatchState,
  actorId: PlayerId,
  startCell: number,
  direction: Direction | null,
): ActionAttemptResult {
  const actor = state.players[actorId];
  if (!actor) {
    throw new Error(`Unknown actor '${actorId}'`);
  }

  if (startCell < 0 || startCell >= state.board.cells.length) {
    throw new Error(`Invalid startCell index ${startCell}`);
  }
  // ... rest of logic
}
```

## Testing Patterns

- One test file per source module
- Use Vitest's `describe` and `it` blocks
- Create helper functions for common test setup
- Test both happy paths and edge cases

```typescript
import { describe, expect, it } from 'vitest';

function baseState(): MatchState {
  return {
    board: createBoard(4),
    config: {
      captureContagion: 3,
      scoringMode: 'basic',
      wrapAround: true,
    },
    players: {
      p1: { id: 'p1', name: 'P1', color: 'red', isCpu: false, score: 0, castlesOwned: 0, actionsStarted: 0 },
    },
  };
}

describe('feature name', () => {
  it('describes expected behavior', () => {
    const state = baseState();
    const result = someFunction(state);
    expect(result).toBe(expectedValue);
  });
});
```

## Documentation

- Add JSDoc comments for exported functions with complex behavior
- Keep comments concise and focused on "why" not "what"
- Update README.md when adding new features or changing architecture
- Maintain design decision documentation in `docs/` directory

## Code Review Checklist

Before submitting code:
- [ ] All functions are pure where appropriate
- [ ] State is immutable
- [ ] Tests are added for new functionality
- [ ] All tests pass (`npm test`)
- [ ] Code builds successfully (`npm run build`)
- [ ] Type safety is maintained (no `any` types without justification)
- [ ] Imports use `.js` extension
- [ ] Error cases are handled appropriately
