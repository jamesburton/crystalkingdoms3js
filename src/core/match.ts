import type { MatchState, PlayerId } from './types.js';
import type { ActionAttemptResult } from './engine.js';
import { attemptAction } from './engine.js';
import type { Direction } from './types.js';

export interface MatchProgress {
  state: MatchState;
  result: ActionAttemptResult;
  isComplete: boolean;
  winnerId: PlayerId | null;
}

export function determineWinnerByScore(state: MatchState, winningScore?: number): PlayerId | null {
  if (winningScore === undefined) {
    return null;
  }

  const met = Object.values(state.players).find((player) => player.score >= winningScore);
  return met?.id ?? null;
}

export function determineWinnerByTimeout(state: MatchState): PlayerId | null {
  const players = Object.values(state.players);
  if (players.length === 0) {
    return null;
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);
  if (sorted.length > 1 && sorted[0].score === sorted[1].score) {
    return null;
  }

  return sorted[0].id;
}

export function processActionAndMatchEnd(
  state: MatchState,
  actorId: PlayerId,
  startCell: number,
  direction: Direction | null,
  context: { winningScore?: number; timeExpired: boolean },
): MatchProgress {
  // Important clarified rule: if time expires while a chain is processing,
  // this action chain still completes before ending the match.
  const result = attemptAction(state, actorId, startCell, direction);
  const nextState = result.state;

  const winnerByScore = determineWinnerByScore(nextState, context.winningScore);
  if (winnerByScore) {
    return { state: nextState, result, isComplete: true, winnerId: winnerByScore };
  }

  if (context.timeExpired) {
    return { state: nextState, result, isComplete: true, winnerId: determineWinnerByTimeout(nextState) };
  }

  return { state: nextState, result, isComplete: false, winnerId: null };
}
