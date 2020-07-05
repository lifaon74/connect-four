import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConnectFourGameState } from './+state/connect-four.state';
import { Cell, ConnectFourGame, Grid, GridCells, Players, WinnerState } from './+state/connect-four.models';
import { PlayerInsertCoinAction, ResetGameAction } from './+state/connect-four.actions';

@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.scss']
})
export class ConnectFourComponent implements OnInit {

  // TODO DEBUG
  @Select(ConnectFourGameState) connectFourGame$: Observable<ConnectFourGame>;

  @Select(ConnectFourGameState.cells) cells$: Observable<GridCells>;

  @Select(ConnectFourGameState.currentPlayer) currentPlayer$: Observable<Players>;
  @Select(ConnectFourGameState.isFinished) isFinished$: Observable<boolean>;
  @Select(ConnectFourGameState.winner) winner$: Observable<WinnerState>;

  constructor(
    private store: Store,
  ) {
    // TODO DEBUG
    this.connectFourGame$.subscribe((...args: any[]) => {
      console.log(args);
    });
  }

  ngOnInit(): void {
  }

  onClickCell(cell: Cell): void {
    this.store.dispatch(new PlayerInsertCoinAction(cell.column));
  }

  onClickResetGame(): void {
    this.store.dispatch(new ResetGameAction());
  }

  trackByRow(index: number): number {
    return index;
  }

  trackByCell(index: number, cell: Cell): string {
    return `${ cell.row }x${ cell.column }`;
  }

  // TODO null match
}
