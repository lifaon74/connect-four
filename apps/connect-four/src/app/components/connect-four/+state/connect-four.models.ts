
export type Players = 'player1' | 'player2';
export type CellState = Players | null;
export type WinnerState = Players | null;


export interface Cell {
  state: CellState;
}

export type GridCells = Cell[][];

export interface Grid {
  cells: GridCells; // row, column
  rows: number;
  columns: number;
}

export interface ConnectFourGame {
  grid: Grid;
  alignedCellsToWin: number;
  winner: WinnerState;
}
