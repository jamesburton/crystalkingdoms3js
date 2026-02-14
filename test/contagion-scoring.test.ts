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

describe('contagion capture scoring', () => {
  it('should not double-count contagion points when capturing', () => {
    const state = baseState();
    
    // Set up p2 owning a castle
    state.board.cells[0].owner = 'p2';
    state.board.cells[0].contagion.p2 = 3;
    state.players.p2.castlesOwned = 1;
    state.players.p2.score = 10; // Give p2 some initial score
    
    // Set up contagion at level 2 (next increment will be 3, which captures)
    state.board.cells[0].contagion.p1 = 2;
    
    // P1 acts on the castle - this should increment contagion to 3 and capture
    const result = resolveAction(state, 'p1', 0, null);
    
    // Expected: 
    // - contagionGainPoints(3, 'basic') = 3
    // - captureCastlePoints(0) = 1 (no adjacent owned castles)
    // - Total should be 3 + 1 = 4
    
    expect(result.state.players.p1.score).toBe(4);
    expect(result.state.board.cells[0].owner).toBe('p1');
    
    // Check events
    const incrementEvent = result.events.find(e => e.type === 'increment_contagion');
    const captureEvent = result.events.find(e => e.type === 'capture_contagion');
    
    expect(incrementEvent?.pointsDelta).toBe(3);
    expect(captureEvent?.pointsDelta).toBe(1); // Only the capture bonus, not contagion points again
  });
});
