import { Cell, CellState, ConnectFourGame, Grid, WinnerState } from './connect-four.models';
import { ALIGNED_CELLS_TO_WIN, GRID_COLUMNS, GRID_ROWS } from '../../../config/config';

/** CREATE **/

export function createEmptyCell(row: number, column: number): Cell {
  return {
    state: null,
    row,
    column,
  };
}

export function createEmptyGrid(rows: number, columns: number): Grid {
  return {
    rows,
    columns,
    cells: Array.from({ length: rows }, (v1: any, row: number) => {
      return Array.from({ length: columns }, (v2: any, column: number) => createEmptyCell(row, column));
    })
  };
}

export function cloneGrid(grid: Grid): Grid {
  return {
    ...grid,
    cells: grid.cells.map((rowCells: Cell[]) => {
      return rowCells.map((cell: Cell) => {
        return {
          ...cell
        };
      });
    })
  };
}

export function createInitialConnectFourGame(): ConnectFourGame {
  const grid = createEmptyGrid(GRID_ROWS, GRID_COLUMNS);
  return {
    grid,
    currentPlayer: 'player1',
    alignedCellsToWin: ALIGNED_CELLS_TO_WIN,
    winner: getGridWinner(grid, ALIGNED_CELLS_TO_WIN)
  };
}


/** UPDATE **/

/**
 * Updates the state of the cell at [row, column] in the 'grid'.
 * Returns a new object
 */
export function changeGridCellState(grid: Grid, row: number, column: number, state: CellState): Grid {
  const newGrid = cloneGrid(grid);
  newGrid.cells[row][column].state = state;
  return newGrid;
}

/**
 * Same as 'changeGridCellState' but applies to a ConnectFourGame
 */
export function changeConnectFourGameCellState(
  connectFour: ConnectFourGame,
  row: number,
  column: number,
  state: CellState,
): ConnectFourGame {
  const grid = changeGridCellState(connectFour.grid, row, column, state);
  const currentPlayer = (connectFour.currentPlayer === 'player1')
    ? 'player2'
    : 'player1';
  return {
    ...connectFour,
    grid,
    currentPlayer,
    winner: getGridWinner(grid, connectFour.alignedCellsToWin)
  };
}



/** READ **/

/**
 * Returns the first occupied row for a specific 'column' into 'grid'
 * Returns -1 if all rows are empty
 */
export function getFirstOccupiedRowInGrid(grid: Grid, column: number): number {
  for (let row = 0; row < grid.rows; row++) {
    if (grid.cells[row][column].state !== null) {
      return row;
    }
  }
  return -1;
}

/**
 * Returns the first empty row for a specific 'column' into 'grid' from the bottom
 * Returns -1 if all rows are occupied
 */
export function getFirstEmptyRowInGridFromBottom(grid: Grid, column: number): number {
  for (let row = grid.rows - 1; row >= 0; row--) {
    if (grid.cells[row][column].state === null) {
      return row;
    }
  }
  return -1;
}

/**
 * Checks into 'grid' if N (alignedCellsToWin) coins are aligned.
 * If yes, returns the winner
 * If no, returns null
 */
export function getGridWinner(grid: Grid, alignedCellsToWin: number): WinnerState {
  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      const cellState = grid.cells[row][column].state;
      if (cellState !== null) {

        // left to right
        if ((column + 3) < grid.columns) {
          let aligned = 1;
          for (; aligned < alignedCellsToWin; aligned++) {
            if (grid.cells[row][column + aligned].state !== cellState) {
              break;
            }
          }
          if (aligned === alignedCellsToWin) {
            return cellState;
          }
        }

        // top to bottom
        if ((row + 3) < grid.rows) {
          let aligned = 1;
          for (; aligned < alignedCellsToWin; aligned++) {
            if (grid.cells[row + aligned][column].state !== cellState) {
              break;
            }
          }
          if (aligned === alignedCellsToWin) {
            return cellState;
          }
        }

        // top left to bottom right
        if (
          ((column + 3) < grid.columns)
          && ((row + 3) < grid.rows)
        ) {
          let aligned = 1;
          for (; aligned < alignedCellsToWin; aligned++) {
            if (grid.cells[row + aligned][column + aligned].state !== cellState) {
              break;
            }
          }
          if (aligned === alignedCellsToWin) {
            return cellState;
          }
        }

        // top right to bottom left
        if (
          ((column - 3) >= 0)
          && ((row + 3) < grid.rows)
        ) {
          let aligned = 1;
          for (; aligned < alignedCellsToWin; aligned++) {
            if (grid.cells[row + aligned][column - aligned].state !== cellState) {
              break;
            }
          }
          if (aligned === alignedCellsToWin) {
            return cellState;
          }
        }
      }
    }
  }

  return isGridFull(grid)
    ? 'draw'
    : null;
}

/**
 * Returns true if the grid has no more empty cells
 */
export function isGridFull(grid: Grid): boolean {
  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      if (grid.cells[row][column].state === null) {
        return false;
      }
    }
  }
  return true;
}

