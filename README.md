# Crystal Kingdoms 3JS

A strategic turn-based grid game built with TypeScript. Compete to capture castles through quick reflexes and tactical decisions in a dynamic contagion-based combat system.

## Overview

Crystal Kingdoms 3JS is a multiplayer game where players race to capture castles on a grid board. The game combines reaction speed with strategy, featuring:

- **Cursor-based action system**: A cursor spawns randomly on the board, and the first player to act gains control
- **Contagion mechanics**: Repeatedly attack enemy castles to build up contagion and eventually capture them
- **Castle ownership**: Captured castles score points and can be destroyed by their owners
- **Chain actions**: Actions can chain across the board in a direction, affecting multiple castles
- **Configurable gameplay**: Adjust board size, scoring modes, capture thresholds, and more

## Installation

```bash
npm install
```

## Usage

### Building the Project

```bash
npm run build
```

This compiles TypeScript source files from `src/` to JavaScript in the `dist/` directory.

### Running Tests

```bash
npm test
```

The project uses [Vitest](https://vitest.dev/) for testing. All test files are located in the `test/` directory.

## Project Architecture

The codebase follows a clean architecture with separation between game logic and presentation:

### Core Modules (`src/core/`)

- **`types.ts`**: Core type definitions for the game state, players, board, and configuration
- **`board.ts`**: Board creation, coordinate utilities, and navigation logic
- **`rules.ts`**: Deterministic game rules engine that resolves actions and produces events
- **`engine.ts`**: Higher-level action orchestration with constraint checks (max actions, max castles)
- **`scoring.ts`**: Scoring calculation functions for different game modes
- **`match.ts`**: Match-level utilities for player management

### Key Design Patterns

#### Immutable State Updates

All game state modifications produce new state objects rather than mutating existing ones:

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

#### Event-Driven Resolution

The rules engine produces deterministic event logs alongside state changes:

```typescript
export interface RuleEvent {
  type: 'capture_empty' | 'increment_contagion' | 'capture_contagion' | 'destroy_own_castle' | 'chain_ended';
  index?: number;
  actorId?: PlayerId;
  pointsDelta?: number;
}
```

This enables:
- Predictable testing and debugging
- Replay and undo functionality
- Animation and visual effects tied to events
- Separation of game logic from presentation

#### Pure Functions

Core game logic is implemented as pure functions that depend only on their inputs:

```typescript
export function resolveAction(
  state: MatchState,
  actorId: PlayerId,
  startCell: number,
  direction: Direction | null,
): ResolveResult {
  // Deterministic logic only
}
```

## Game Mechanics

### Board

- Grid sizes from 4×4 to 8×8
- Each cell is a castle that can be owned by a player or remain empty
- Optional wrap-around at board edges

### Actions

1. **Cursor Spawn**: A cursor appears on a random empty castle
2. **Player Action**: The first player to act gains control of the cursor
3. **Action Types**:
   - **Tap/Fire**: Act on the current castle only
   - **Swipe/Direction**: Chain action in a direction (up, down, left, right)

### Resolution Rules

When an action targets a castle:

- **Empty Castle**: Captured by the acting player
- **Enemy Castle**: Increment contagion counter for the acting player
  - When contagion reaches the capture threshold, the castle is captured
- **Own Castle**: Destroyed (ownership cleared)

### Chain Actions

When a direction is provided:
1. Start at the cursor castle
2. Apply action to current castle
3. If the action doesn't end the chain (empty capture or own castle destruction), move to the next castle in the direction
4. Repeat until chain ends

### Scoring Modes

#### Basic Mode
- Points for capturing empty castles (based on adjacent owned castles)
- Points for contagion gain
- Points lost when losing a castle

#### Only Castles Mode
- Points only for castle captures
- No points for contagion gain

### Constraints

- **Max Actions**: Limit on total actions per player
- **Max Castles**: Limit on simultaneously owned castles

## Testing

The project includes comprehensive unit tests covering:

- Board creation and navigation
- Action resolution logic
- Contagion mechanics
- Scoring calculations
- Constraint enforcement

### Test Structure

Tests are organized by module:
- `board.test.ts`: Board utilities and coordinate math
- `rules.test.ts`: Core game rules and action resolution
- `engine.test.ts`: Higher-level engine constraints
- `contagion-scoring.test.ts`: Contagion-based scoring
- `match.test.ts`: Match state management

### Running Specific Tests

```bash
npm test -- board.test.ts
```

## Development

### Code Style

- TypeScript with strict mode enabled
- ES2022 target with ESNext modules
- Functional programming patterns preferred
- Immutable data structures
- Pure functions for game logic

### Adding Features

When adding new features:
1. Define types in `types.ts` if needed
2. Implement pure logic in appropriate core modules
3. Add corresponding tests
4. Ensure all tests pass: `npm test`
5. Build to verify: `npm run build`

## Documentation

Additional documentation can be found in the `docs/` directory:
- `mvp-plan.md`: Detailed MVP implementation plan and game mechanics

## Future Plans

- Three.js rendering for visual representation
- CPU AI with configurable difficulty
- Match timer and win conditions
- Options menu for game configuration
- Controller and input remapping
- Online multiplayer support

## License

Private project.
