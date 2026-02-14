import type { BoardState, CastleState, Direction } from './types.js';

export function createEmptyCastle(): CastleState {
  return { owner: null, contagion: {} };
}

export function createBoard(size: number): BoardState {
  if (size < 4 || size > 8) {
    throw new Error('Board size must be between 4 and 8');
  }

  return {
    size,
    cells: Array.from({ length: size * size }, createEmptyCastle),
  };
}

export function toIndex(size: number, row: number, col: number): number {
  return row * size + col;
}

export function toCoord(size: number, index: number): { row: number; col: number } {
  return { row: Math.floor(index / size), col: index % size };
}

export function nextIndexInDirection(
  size: number,
  index: number,
  direction: Direction,
  wrapAround: boolean,
): number | null {
  // Guard against out-of-range indices to avoid surprising wrap-around behavior.
  if (index < 0 || index >= size * size) {
    return null;
  }
  const { row, col } = toCoord(size, index);

  const delta =
    direction === 'up'
      ? { dr: -1, dc: 0 }
      : direction === 'down'
      ? { dr: 1, dc: 0 }
      : direction === 'left'
      ? { dr: 0, dc: -1 }
      : { dr: 0, dc: 1 };

  let nr = row + delta.dr;
  let nc = col + delta.dc;

  if (wrapAround) {
    nr = (nr + size) % size;
    nc = (nc + size) % size;
    return toIndex(size, nr, nc);
  }

  if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
    return null;
  }

  return toIndex(size, nr, nc);
}

export function orthogonalNeighborIndices(size: number, index: number, wrapAround: boolean): number[] {
  const neighbors: number[] = [];

  for (const dir of ['up', 'down', 'left', 'right'] as const) {
    const next = nextIndexInDirection(size, index, dir, wrapAround);
    if (next !== null) {
      neighbors.push(next);
    }
  }

  return neighbors;
}
