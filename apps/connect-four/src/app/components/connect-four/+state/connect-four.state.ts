import { Injectable } from '@angular/core';
import { ConnectFourGame, GridCells, Players, WinnerState } from './connect-four.models';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  changeConnectFourGameCellState, createInitialConnectFourGame, getFirstEmptyRowInGridFromBottom
} from './connect-four.functions';
import { PlayerInsertCoinAction, ResetGameAction } from './connect-four.actions';

@State<ConnectFourGame>({
  name: 'connectFourGame',
  defaults: createInitialConnectFourGame()
})
@Injectable()
export class ConnectFourGameState {
  @Selector()
  static cells(state: ConnectFourGame): GridCells {
    return state.grid.cells;
  }

  @Selector()
  static currentPlayer(state: ConnectFourGame): Players {
    return state.currentPlayer;
  }

  @Selector()
  static isFinished(state: ConnectFourGame): boolean {
    return state.winner !== null;
  }

  @Selector()
  static winner(state: ConnectFourGame): WinnerState {
    return state.winner;
  }

  constructor() {
  }


  @Action(PlayerInsertCoinAction)
  playerInsertCoin(ctx: StateContext<ConnectFourGame>, action: PlayerInsertCoinAction) {
    const state = ctx.getState();

    if (state.winner === null) {
      const firstEmptyRow = getFirstEmptyRowInGridFromBottom(state.grid, action.column);

      if (firstEmptyRow !== -1) {
        ctx.setState(changeConnectFourGameCellState(state, firstEmptyRow, action.column, state.currentPlayer));
      }
    }
  }

  @Action(ResetGameAction)
  resetGame(ctx: StateContext<ConnectFourGame>) {
    ctx.setState(createInitialConnectFourGame());
  }


}
