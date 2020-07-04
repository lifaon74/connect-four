import { Cell, CellState, ConnectFourGame, Grid, WinnerState } from './connect-four.models';
import { ALIGNED_CELLS_TO_WIN, GRID_COLUMNS, GRID_ROWS } from '../../../config/config';

export function createEmptyCell(): Cell {
  return {
    state: null
  };
}

export function createEmptyGrid(rows: number, columns: number): Grid {
  return {
    rows,
    columns,
    cells: Array.from({ length: rows }, () => {
      return Array.from({ length: columns }, () => createEmptyCell());
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
    alignedCellsToWin: ALIGNED_CELLS_TO_WIN,
    winner: getGridWinner(grid, ALIGNED_CELLS_TO_WIN)
  };
}

export function changeGridCellState(grid: Grid, row: number, column: number, state: CellState): Grid {
  const newGrid = cloneGrid(grid);
  newGrid.cells[row][column].state = state;
  return newGrid;
}

export function changeConnectFourGameCellState(connectFour: ConnectFourGame, row: number, column: number, state: CellState): ConnectFourGame {
  const grid = changeGridCellState(connectFour.grid, row, column, state);
  return {
    ...connectFour,
    grid,
    winner: getGridWinner(grid, connectFour.alignedCellsToWin)
  };
}

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
          ((column - 3) < grid.columns)
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
  return null;
}

