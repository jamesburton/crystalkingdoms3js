# GitHub Copilot Instructions for Crystal Kingdoms 3JS

## Project Overview
Crystal Kingdoms 3JS is a TypeScript-based game engine for a strategic board game. The project implements core game logic including board management, match state, rules engine, and scoring systems.

## Tech Stack
- **Language**: TypeScript 5.6.3
- **Runtime**: Node.js with ES2022 target
- **Module System**: ESNext with Bundler module resolution
- **Testing Framework**: Vitest 2.1.4
- **Build Tool**: TypeScript Compiler (tsc)

## Commands

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist/` directory.

### Test
```bash
npm test
```
Runs all tests using Vitest.

## Project Structure

```
src/
  core/           # Core game logic
    board.ts      # Board state management
    engine.ts     # Game engine logic
    match.ts      # Match state management
    rules.ts      # Game rules implementation
    scoring.ts    # Scoring system
    types.ts      # TypeScript type definitions
test/             # Test files (*.test.ts)
dist/             # Compiled output (generated, do not modify)
node_modules/     # Dependencies (do not modify)
```

## Coding Standards

### TypeScript
- **Strict Mode**: Always enabled. All code must pass strict type checking.
- **Type Safety**: Never use `any` type. Use `unknown` if type is truly unknown, then narrow with type guards.
- **Explicit Types**: Export all interfaces and types in `types.ts` for reusability.
- **Null Handling**: Use `| null` for nullable types, never `undefined` unless necessary.

### Naming Conventions
- **Types/Interfaces**: PascalCase (e.g., `BoardState`, `PlayerId`)
- **Functions/Variables**: camelCase (e.g., `getCastleOwner`, `boardState`)
- **Constants**: UPPER_SNAKE_CASE for global constants (if any)
- **Files**: lowercase with hyphens for test files (e.g., `board.test.ts`), lowercase for source files (e.g., `board.ts`, `scoring.ts`)

### Code Style
- Use ES6+ features (arrow functions, destructuring, template literals)
- Prefer `const` over `let`, never use `var`
- Use explicit return types on exported functions
- Keep functions focused and single-purpose
- Prefer pure functions where possible

### Module Organization
- Import order: external libraries first, then internal modules
- Use named exports, avoid default exports
- Keep `types.ts` as the central type definition file
- Each module should have a clear, single responsibility

## Testing Guidelines

### Test Structure
- Test files must be colocated with source files or in the `test/` directory
- Use `.test.ts` suffix for test files
- Follow the pattern: describe -> it/test -> arrange/act/assert

### Test Coverage
- Write tests for all public functions and exported interfaces
- Focus on behavior, not implementation details
- Test edge cases and error conditions
- Use descriptive test names that explain what is being tested

### Example Test Pattern
```typescript
import { describe, it, expect } from 'vitest';

describe('FeatureName', () => {
  it('should handle expected behavior', () => {
    // Arrange
    const input = setupInput();
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

## Architecture Patterns

### State Management
- Immutable state updates: never mutate state directly
- Use spread operators or object/array methods that return new instances
- State interfaces defined in `types.ts`

### Game Logic
- Core game logic is pure and deterministic
- Side effects isolated to engine layer
- Rules engine validates all game actions
- Scoring is calculated based on current board state

## Prohibited Actions
- **Never modify**: `package-lock.json` directly (use npm commands)
- **Never commit**: `node_modules/`, `dist/`, or other build artifacts
- **Never use**: `any` type in TypeScript
- **Never mutate**: state objects directly; always create new instances
- **Never skip**: type definitions for exported functions

## Git Workflow
- Keep commits focused and atomic
- Write clear, descriptive commit messages
- Run tests before committing (`npm test`)
- Ensure code builds successfully (`npm run build`)

## Dependencies
- Minimize external dependencies
- Only add dependencies if absolutely necessary
- Use dev dependencies for build/test tools
- Always specify exact versions for reproducibility

## Performance Considerations
- Game logic should be efficient (O(n) or better where possible)
- Avoid unnecessary object allocations in hot paths
- Keep board operations optimized for frequent access

## When Making Changes
1. Understand the existing code structure before making changes
2. Run tests to ensure current functionality works
3. Make minimal, targeted changes
4. Add/update tests for new functionality
5. Verify all tests pass
6. Ensure TypeScript compilation succeeds with no errors
7. Review changes for type safety and adherence to conventions
