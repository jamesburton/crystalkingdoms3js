import type { PlayerId } from './types.js';

export interface CursorOpportunity {
  isActive: boolean;
  cellIndex: number | null;
  spawnedAtMs: number | null;
  expiresAtMs: number | null;
  claimedBy: PlayerId | null;
  claimedAtMs: number | null;
}

export interface TurnDirectorState {
  nextSpawnAtMs: number;
  opportunity: CursorOpportunity;
}

export interface TurnDirectorConfig {
  minSpawnDelayMs: number;
  maxSpawnDelayMs: number;
  cursorLifetimeMs: number;
}

export type RandomFn = () => number;

export function randomDelay(minMs: number, maxMs: number, random: RandomFn): number {
  if (maxMs < minMs) {
    throw new Error('maxMs must be greater than or equal to minMs');
  }

  const range = maxMs - minMs;
  return minMs + Math.floor(random() * (range + 1));
}

export function createTurnDirectorState(
  nowMs: number,
  config: Pick<TurnDirectorConfig, 'minSpawnDelayMs' | 'maxSpawnDelayMs'>,
  random: RandomFn,
): TurnDirectorState {
  return {
    nextSpawnAtMs: nowMs + randomDelay(config.minSpawnDelayMs, config.maxSpawnDelayMs, random),
    opportunity: {
      isActive: false,
      cellIndex: null,
      spawnedAtMs: null,
      expiresAtMs: null,
      claimedBy: null,
      claimedAtMs: null,
    },
  };
}

export function advanceTurnDirector(
  state: TurnDirectorState,
  nowMs: number,
  emptyCells: number[],
  config: TurnDirectorConfig,
  random: RandomFn,
): TurnDirectorState {
  const next: TurnDirectorState = {
    nextSpawnAtMs: state.nextSpawnAtMs,
    opportunity: { ...state.opportunity },
  };

  if (
    next.opportunity.isActive &&
    next.opportunity.claimedBy === null &&
    next.opportunity.expiresAtMs !== null &&
    nowMs >= next.opportunity.expiresAtMs
  ) {
    next.opportunity = {
      isActive: false,
      cellIndex: null,
      spawnedAtMs: null,
      expiresAtMs: null,
      claimedBy: null,
      claimedAtMs: null,
    };

    next.nextSpawnAtMs = nowMs + randomDelay(config.minSpawnDelayMs, config.maxSpawnDelayMs, random);
  }

  if (!next.opportunity.isActive && nowMs >= next.nextSpawnAtMs && emptyCells.length > 0) {
    const picked = emptyCells[Math.floor(random() * emptyCells.length)];
    next.opportunity = {
      isActive: true,
      cellIndex: picked,
      spawnedAtMs: nowMs,
      expiresAtMs: nowMs + config.cursorLifetimeMs,
      claimedBy: null,
      claimedAtMs: null,
    };
  }

  return next;
}

export function tryClaimOpportunity(
  state: TurnDirectorState,
  actorId: PlayerId,
  nowMs: number,
): { state: TurnDirectorState; success: boolean } {
  if (!state.opportunity.isActive || state.opportunity.cellIndex === null) {
    return { state, success: false };
  }

  if (state.opportunity.claimedBy !== null) {
    return { state, success: false };
  }

  if (state.opportunity.expiresAtMs !== null && nowMs >= state.opportunity.expiresAtMs) {
    return { state, success: false };
  }

  const next: TurnDirectorState = {
    nextSpawnAtMs: state.nextSpawnAtMs,
    opportunity: {
      ...state.opportunity,
      claimedBy: actorId,
      claimedAtMs: nowMs,
    },
  };

  return { state: next, success: true };
}

export function clearOpportunityAfterResolution(
  state: TurnDirectorState,
  nowMs: number,
  config: Pick<TurnDirectorConfig, 'minSpawnDelayMs' | 'maxSpawnDelayMs'>,
  random: RandomFn,
): TurnDirectorState {
  return {
    nextSpawnAtMs: nowMs + randomDelay(config.minSpawnDelayMs, config.maxSpawnDelayMs, random),
    opportunity: {
      isActive: false,
      cellIndex: null,
      spawnedAtMs: null,
      expiresAtMs: null,
      claimedBy: null,
      claimedAtMs: null,
    },
  };
}
