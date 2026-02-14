export type PlayerId = string;

export type Direction = 'up' | 'down' | 'left' | 'right';

export type ScoringMode = 'basic' | 'onlyCastles';

export interface CastleState {
  owner: PlayerId | null;
  contagion: Record<PlayerId, number>;
}

export interface BoardState {
  size: number;
  cells: CastleState[];
}

export interface PlayerState {
  id: PlayerId;
  name: string;
  color: string;
  isCpu: boolean;
  score: number;
  castlesOwned: number;
  actionsStarted: number;
}

export interface GameConfig {
  captureContagion: number;
  scoringMode: ScoringMode;
  wrapAround: boolean;
  maxCastles?: number;
  maxActions?: number;
}

export interface MatchState {
  board: BoardState;
  players: Record<PlayerId, PlayerState>;
  config: GameConfig;
}
