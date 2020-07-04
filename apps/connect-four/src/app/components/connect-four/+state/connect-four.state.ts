import { Injectable } from '@angular/core';
import { Cell, ConnectFourGame, GridCells } from './connect-four.models';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ChangeCellStateAction } from './connect-four.actions';
import { changeConnectFourGameCellState, createInitialConnectFourGame } from './functions';

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

  constructor() {
  }

  @Action(ChangeCellStateAction)
  changeCellState(ctx: StateContext<ConnectFourGame>, action: ChangeCellStateAction) {
    ctx.setState(changeConnectFourGameCellState(ctx.getState(), action.row, action.column, action.state));
  }


}
