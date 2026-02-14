import { describe, expect, it } from 'vitest';
import { createBoard } from '../src/core/board.js';
import { resolveAction } from '../src/core/rules.js';
import type { MatchState } from '../src/core/types.js';

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
      p2: { id: 'p2', name: 'P2', color: 'blue', isCpu: false, score: 0, castlesOwned: 0, actionsStarted: 0 },
    },
  };
}

describe('resolveAction', () => {
  it('captures empty castle and awards base points', () => {
    const state = baseState();
    const result = resolveAction(state, 'p1', 0, null);

    expect(result.state.board.cells[0].owner).toBe('p1');
    expect(result.state.players.p1.score).toBe(1);
    expect(result.state.players.p1.castlesOwned).toBe(1);
  });

  it('destroys own castle when acting on own castle', () => {
    const state = baseState();
    state.board.cells[0].owner = 'p1';
    state.players.p1.castlesOwned = 1;

    const result = resolveAction(state, 'p1', 0, null);

    expect(result.state.board.cells[0].owner).toBeNull();
    expect(result.state.players.p1.castlesOwned).toBe(0);
  });

  it('increments contagion on enemy castle and chains to next index', () => {
    const state = baseState();
    state.board.cells[0].owner = 'p2';
    const result = resolveAction(state, 'p1', 0, 'right');

    expect(result.state.board.cells[0].contagion.p1).toBe(1);
    expect(result.state.board.cells[1].owner).toBe('p1');
    expect(result.events.some((e) => e.type === 'increment_contagion')).toBe(true);
  });

  it('captures enemy castle at contagion threshold', () => {
    const state = baseState();
    state.config.captureContagion = 2;
    state.board.cells[0].owner = 'p2';
    state.board.cells[0].contagion.p1 = 1;
    state.board.cells[0].contagion.p2 = 2;
    state.players.p2.castlesOwned = 1;

    const result = resolveAction(state, 'p1', 0, null);

    expect(result.state.board.cells[0].owner).toBe('p1');
    expect(result.state.players.p1.castlesOwned).toBe(1);
    expect(result.state.players.p2.castlesOwned).toBe(0);
    expect(result.state.players.p2.score).toBe(-2);
  });

  it('onlyCastles mode does not score contagion increment points', () => {
    const state = baseState();
    state.config.scoringMode = 'onlyCastles';
    state.board.cells[0].owner = 'p2';

    const result = resolveAction(state, 'p1', 0, null);

    expect(result.state.players.p1.score).toBe(0);
    expect(result.state.board.cells[0].contagion.p1).toBe(1);
  });
});
