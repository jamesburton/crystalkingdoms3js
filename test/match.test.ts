import { describe, expect, it } from 'vitest';
import { createBoard } from '../src/core/board.js';
import { processActionAndMatchEnd } from '../src/core/match.js';
import type { MatchState } from '../src/core/types.js';

function baseState(): MatchState {
  return {
    board: createBoard(4),
    config: {
      captureContagion: 3,
      scoringMode: 'basic',
      wrapAround: true,
      maxActions: 10,
      maxCastles: 10,
    },
    players: {
      p1: { id: 'p1', name: 'P1', color: 'red', isCpu: false, score: 0, castlesOwned: 0, actionsStarted: 0 },
      p2: { id: 'p2', name: 'P2', color: 'blue', isCpu: false, score: 0, castlesOwned: 0, actionsStarted: 0 },
    },
  };
}

describe('processActionAndMatchEnd', () => {
  it('completes current chain even when time has expired', () => {
    const state = baseState();

    const progress = processActionAndMatchEnd(state, 'p1', 0, null, { timeExpired: true });

    expect(progress.state.board.cells[0].owner).toBe('p1');
    expect(progress.isComplete).toBe(true);
  });

  it('ends immediately if winning score is reached after action resolution', () => {
    const state = baseState();

    const progress = processActionAndMatchEnd(state, 'p1', 0, null, {
      timeExpired: false,
      winningScore: 1,
    });

    expect(progress.isComplete).toBe(true);
    expect(progress.winnerId).toBe('p1');
  });
});
