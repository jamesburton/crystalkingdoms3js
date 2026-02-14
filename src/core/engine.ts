import { resolveAction, type ResolveResult } from './rules.js';
import type { Direction, MatchState, PlayerId } from './types.js';

export interface ActionAttemptResult extends ResolveResult {
  blocked: 'maxActions' | 'maxCastles' | null;
}

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

  if (state.config.maxActions !== undefined && actor.actionsStarted >= state.config.maxActions) {
    return { state, events: [], blocked: 'maxActions' };
  }

  if (state.config.maxCastles !== undefined && actor.castlesOwned >= state.config.maxCastles) {
    return { state, events: [], blocked: 'maxCastles' };
  }

  const resolved = resolveAction(state, actorId, startCell, direction);
  resolved.state.players[actorId].actionsStarted += 1;

  return { ...resolved, blocked: null };
}
