import { describe, expect, it } from 'vitest';
import { createBoard, nextIndexInDirection, orthogonalNeighborIndices, toCoord, toIndex } from '../src/core/board.js';

describe('board helpers', () => {
  it('creates board with expected number of empty cells', () => {
    const board = createBoard(4);
    expect(board.cells).toHaveLength(16);
    expect(board.cells.every((cell) => cell.owner === null)).toBe(true);
  });

  it('converts between index and coordinates', () => {
    const idx = toIndex(5, 3, 2);
    expect(idx).toBe(17);
    expect(toCoord(5, idx)).toEqual({ row: 3, col: 2 });
  });

  it('returns null at boundaries without wrapping', () => {
    expect(nextIndexInDirection(4, 0, 'up', false)).toBeNull();
    expect(nextIndexInDirection(4, 0, 'left', false)).toBeNull();
    expect(nextIndexInDirection(4, 15, 'down', false)).toBeNull();
  });

  it('wraps at boundaries when enabled', () => {
    expect(nextIndexInDirection(4, 0, 'up', true)).toBe(12);
    expect(nextIndexInDirection(4, 0, 'left', true)).toBe(3);
  });

  it('returns orthogonal neighbors only', () => {
    expect(orthogonalNeighborIndices(4, 5, false).sort((a, b) => a - b)).toEqual([1, 4, 6, 9]);
  });
});
