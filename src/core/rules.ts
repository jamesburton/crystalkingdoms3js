import { nextIndexInDirection } from './board.js';
import { captureCastlePoints, contagionGainPoints, contagionLossPoints, countAdjacentOwnedCastles } from './scoring.js';
import type { Direction, MatchState, PlayerId } from './types.js';

export interface RuleEvent {
  type:
    | 'capture_empty'
    | 'increment_contagion'
    | 'capture_contagion'
    | 'destroy_own_castle'
    | 'chain_ended';
  index?: number;
  actorId?: PlayerId;
  pointsDelta?: number;
}

export interface ResolveResult {
  state: MatchState;
  events: RuleEvent[];
}

export function cloneState(state: MatchState): MatchState {
  return {
    ...state,
    board: {
      ...state.board,
      cells: state.board.cells.map((cell) => ({ owner: cell.owner, contagion: { ...cell.contagion } })),
    },
    players: Object.fromEntries(
      Object.entries(state.players).map(([id, p]) => [id, { ...p }]),
    ),
  };
}

export function resolveAction(
  state: MatchState,
  actorId: PlayerId,
  startCell: number,
  direction: Direction | null,
): ResolveResult {
  const next = cloneState(state);
  const actor = next.players[actorId];
  const events: RuleEvent[] = [];

  let index = startCell;

  while (true) {
    const castle = next.board.cells[index];

    if (castle.owner === null) {
      castle.owner = actorId;
      actor.castlesOwned += 1;

      const adjacency = countAdjacentOwnedCastles(next, index, actorId);
      const gained = captureCastlePoints(adjacency);
      actor.score += gained;

      events.push({ type: 'capture_empty', index, actorId, pointsDelta: gained });
      break;
    }

    if (castle.owner === actorId) {
      castle.owner = null;
      actor.castlesOwned = Math.max(0, actor.castlesOwned - 1);

      events.push({ type: 'destroy_own_castle', index, actorId, pointsDelta: 0 });
      break;
    }

    const priorOwnerId = castle.owner;
    const currentLevel = castle.contagion[actorId] ?? 0;
    const nextLevel = currentLevel + 1;
    castle.contagion[actorId] = nextLevel;

    const contagionPoints = contagionGainPoints(nextLevel, next.config.scoringMode);
    actor.score += contagionPoints;

    events.push({ type: 'increment_contagion', index, actorId, pointsDelta: contagionPoints });

    if (nextLevel >= next.config.captureContagion) {
      const previousLevel = castle.contagion[priorOwnerId] ?? 0;
      const priorOwner = next.players[priorOwnerId];
      priorOwner.score -= contagionLossPoints(previousLevel);
      priorOwner.castlesOwned = Math.max(0, priorOwner.castlesOwned - 1);

      const adjacency = countAdjacentOwnedCastles(next, index, actorId);
      const capturePoints = captureCastlePoints(adjacency);
      actor.score += capturePoints;
      actor.castlesOwned += 1;

      castle.owner = actorId;
      castle.contagion = { [actorId]: nextLevel };

      events.push({ type: 'capture_contagion', index, actorId, pointsDelta: capturePoints });
      break;
    }

    if (!direction) {
      events.push({ type: 'chain_ended', index, actorId });
      break;
    }

    const nextIndex = nextIndexInDirection(next.board.size, index, direction, next.config.wrapAround);
    if (nextIndex === null) {
      events.push({ type: 'chain_ended', index, actorId });
      break;
    }

    index = nextIndex;
  }

  return { state: next, events };
}
