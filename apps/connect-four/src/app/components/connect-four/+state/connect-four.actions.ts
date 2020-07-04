import { CellState } from './connect-four.models';


export class ChangeCellStateAction {
  static readonly type = '[Cell] Change state';

  constructor(
    public row: number,
    public column: number,
    public state: CellState,
  ) {
  }
}


