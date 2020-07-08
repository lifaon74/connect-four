export type Players = 'player1' | 'player2'; // list of players
export type CellState = Players | null; // state of a cell. if null => empty
export type FinishedState = Players | 'draw'; // state of the game when it is finished
export type WinnerState = FinishedState | null; // current state of the game. if null => still playing

/**
 * Represents a Cell of the connect four grid
 */
export interface Cell {
  state: CellState;
  row: number;
  column: number;
}

/**
 * Two dimensional array to represent the cells
 */
export type GridCells = Cell[][];

/**
 * Represents the gris of the connect four game
 */
export interface Grid {
  cells: GridCells; // row, column
  rows: number;
  columns: number;
}

/**
 * Represents the connect four game and it's state
 */
export interface ConnectFourGame {
  grid: Grid;
  alignedCellsToWin: number;
  winner: WinnerState;
  currentPlayer: Players;
}
