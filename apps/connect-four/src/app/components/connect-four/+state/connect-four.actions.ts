import { CellState, Players } from './connect-four.models';


export class PlayerInsertCoinAction {
  static readonly type = '[Player] Insert coin';

  constructor(
    public column: number,
  ) {
  }
}

export class ResetGameAction {
  static readonly type = '[Game] Reset';

  constructor() {
  }
}
