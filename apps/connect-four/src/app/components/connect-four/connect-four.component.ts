import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConnectFourGameState } from './+state/connect-four.state';
import { Cell, FinishedState, GridCells, Players, WinnerState } from './+state/connect-four.models';
import { PlayerInsertCoinAction, ResetGameAction } from './+state/connect-four.actions';
import { MatDialog } from '@angular/material/dialog';
import { WinPopupComponent } from '../popups/win-popup/win-popup.component';

/**
 * Main component used to play a "connect-four" game
 */
@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.scss']
})
export class ConnectFourComponent implements OnInit {

  // DEBUG
  // @Select(ConnectFourGameState) connectFourGame$: Observable<ConnectFourGame>;

  @Select(ConnectFourGameState.cells) cells$: Observable<GridCells>;

  @Select(ConnectFourGameState.currentPlayer) currentPlayer$: Observable<Players>;
  @Select(ConnectFourGameState.isFinished) isFinished$: Observable<boolean>;
  @Select(ConnectFourGameState.winner) winner$: Observable<WinnerState>;

  constructor(
    private dialog: MatDialog,
    private store: Store
  ) {
    // DEBUG
    // this.connectFourGame$.subscribe((...args: any[]) => {
    //   console.log(args);
    // });
  }

  ngOnInit(): void {
    this.subscribeToWinner();
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

  private subscribeToWinner(): void {
    this.winner$.subscribe((winner: WinnerState) => {
      if (winner !== null) {
        this.openWinPopup(winner);
      }
    });
  }

  private openWinPopup(winner: FinishedState) {
    return this.dialog.open(WinPopupComponent, {
      data: {
        winner
      }
    });
  }
}
