import { orthogonalNeighborIndices } from './board.js';
import type { MatchState, PlayerId, ScoringMode } from './types.js';

const BASIC_CAPTURE_POINTS: Record<number, number> = {
  0: 1,
  1: 2,
  2: 4,
  3: 7,
  4: 10,
};

export function countAdjacentOwnedCastles(state: MatchState, cellIndex: number, playerId: PlayerId): number {
  return orthogonalNeighborIndices(state.board.size, cellIndex, state.config.wrapAround).filter(
    (idx) => state.board.cells[idx].owner === playerId,
  ).length;
}

export function captureCastlePoints(adjacencyOwned: number): number {
  return BASIC_CAPTURE_POINTS[adjacencyOwned] ?? 10;
}

export function contagionGainPoints(levelReached: number, scoringMode: ScoringMode): number {
  return scoringMode === 'basic' ? levelReached : 0;
}

export function contagionLossPoints(levelAtCapture: number): number {
  return levelAtCapture;
}
