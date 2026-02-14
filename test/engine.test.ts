import { describe, expect, it } from 'vitest';
import { createBoard } from '../src/core/board.js';
import { attemptAction } from '../src/core/engine.js';
import type { MatchState } from '../src/core/types.js';

function baseState(): MatchState {
  return {
    board: createBoard(4),
    config: {
      captureContagion: 3,
      scoringMode: 'basic',
      wrapAround: true,
      maxActions: 1,
      maxCastles: 1,
    },
    players: {
      p1: { id: 'p1', name: 'P1', color: 'red', isCpu: false, score: 0, castlesOwned: 0, actionsStarted: 0 },
      p2: { id: 'p2', name: 'P2', color: 'blue', isCpu: false, score: 0, castlesOwned: 0, actionsStarted: 0 },
    },
  };
}

describe('attemptAction constraints', () => {
  it('blocks when actor exceeded max actions', () => {
    const state = baseState();
    state.players.p1.actionsStarted = 1;

    const result = attemptAction(state, 'p1', 0, null);

    expect(result.blocked).toBe('maxActions');
    expect(result.events).toHaveLength(0);
    expect(result.state).toBe(state);
  });

  it('blocks when actor reached max castles', () => {
    const state = baseState();
    state.players.p1.castlesOwned = 1;

    const result = attemptAction(state, 'p1', 0, null);

    expect(result.blocked).toBe('maxCastles');
    expect(result.events).toHaveLength(0);
  });

  it('allows action and increments actionsStarted when not blocked', () => {
    const state = baseState();
    state.config.maxActions = 2;
    state.config.maxCastles = 2;

    const result = attemptAction(state, 'p1', 0, null);

    expect(result.blocked).toBeNull();
    expect(result.state.players.p1.actionsStarted).toBe(1);
    expect(result.state.board.cells[0].owner).toBe('p1');
  });
});
