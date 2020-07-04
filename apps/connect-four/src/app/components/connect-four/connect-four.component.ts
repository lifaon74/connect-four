import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConnectFourGameState } from './+state/connect-four.state';
import { Cell, ConnectFourGame, Grid, GridCells } from './+state/connect-four.models';

@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.scss']
})
export class ConnectFourComponent implements OnInit {

  @Select(ConnectFourGameState) connectFourGame$: Observable<ConnectFourGame>;

  @Select(ConnectFourGameState.cells) cells$: Observable<GridCells>;

  constructor(private store: Store) {
    this.connectFourGame$.subscribe((...args: any[]) => {
      console.log(args);
    });
  }

  ngOnInit(): void {
  }

  onClickCell(row: number, column: number): void {

  }

}
