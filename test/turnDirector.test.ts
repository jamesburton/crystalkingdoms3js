import { describe, expect, it } from 'vitest';
import {
  advanceTurnDirector,
  clearOpportunityAfterResolution,
  createTurnDirectorState,
  tryClaimOpportunity,
} from '../src/core/turnDirector.js';

function fixedRandom(value: number): () => number {
  return () => value;
}

describe('turnDirector', () => {
  it('spawns cursor opportunity on an empty cell once spawn delay is reached', () => {
    const state = createTurnDirectorState(100, { minSpawnDelayMs: 50, maxSpawnDelayMs: 50 }, fixedRandom(0));

    const advanced = advanceTurnDirector(
      state,
      150,
      [2, 4, 6],
      { minSpawnDelayMs: 50, maxSpawnDelayMs: 50, cursorLifetimeMs: 300 },
      fixedRandom(0.5),
    );

    expect(advanced.opportunity.isActive).toBe(true);
    expect(advanced.opportunity.cellIndex).toBe(4);
    expect(advanced.opportunity.expiresAtMs).toBe(450);
  });

  it('allows first actor to claim and rejects later claims', () => {
    const base = createTurnDirectorState(0, { minSpawnDelayMs: 0, maxSpawnDelayMs: 0 }, fixedRandom(0));
    const active = advanceTurnDirector(
      base,
      0,
      [1],
      { minSpawnDelayMs: 0, maxSpawnDelayMs: 0, cursorLifetimeMs: 200 },
      fixedRandom(0),
    );

    const first = tryClaimOpportunity(active, 'p1', 10);
    const second = tryClaimOpportunity(first.state, 'p2', 12);

    expect(first.success).toBe(true);
    expect(first.state.opportunity.claimedBy).toBe('p1');
    expect(second.success).toBe(false);
    expect(second.state.opportunity.claimedBy).toBe('p1');
  });

  it('expires unclaimed opportunity and schedules the next spawn', () => {
    const base = createTurnDirectorState(0, { minSpawnDelayMs: 0, maxSpawnDelayMs: 0 }, fixedRandom(0));
    const active = advanceTurnDirector(
      base,
      0,
      [1],
      { minSpawnDelayMs: 10, maxSpawnDelayMs: 10, cursorLifetimeMs: 50 },
      fixedRandom(0),
    );

    const expired = advanceTurnDirector(
      active,
      55,
      [1, 2],
      { minSpawnDelayMs: 10, maxSpawnDelayMs: 10, cursorLifetimeMs: 50 },
      fixedRandom(0),
    );

    expect(expired.opportunity.isActive).toBe(false);
    expect(expired.nextSpawnAtMs).toBe(65);
  });

  it('clears opportunity after action resolution and schedules future spawn', () => {
    const base = createTurnDirectorState(0, { minSpawnDelayMs: 0, maxSpawnDelayMs: 0 }, fixedRandom(0));
    const active = advanceTurnDirector(
      base,
      0,
      [1],
      { minSpawnDelayMs: 5, maxSpawnDelayMs: 5, cursorLifetimeMs: 50 },
      fixedRandom(0),
    );
    const claimed = tryClaimOpportunity(active, 'p1', 2).state;

    const cleared = clearOpportunityAfterResolution(
      claimed,
      20,
      { minSpawnDelayMs: 5, maxSpawnDelayMs: 5 },
      fixedRandom(0),
    );

    expect(cleared.opportunity.isActive).toBe(false);
    expect(cleared.nextSpawnAtMs).toBe(25);
  });
});
