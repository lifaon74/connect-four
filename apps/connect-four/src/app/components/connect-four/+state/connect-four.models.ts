
export type Players = 'player1' | 'player2';
export type CellState = Players | null;
export type WinnerState = Players | null | 'draw';


export interface Cell {
  state: CellState;
  row: number;
  column: number;
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
  currentPlayer: Players;
}
