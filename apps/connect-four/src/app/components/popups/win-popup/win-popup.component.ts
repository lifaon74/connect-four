import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinishedState } from '../../connect-four/+state/connect-four.models';

/**
 * Popup component used to display the winner's name
 */
@Component({
  selector: 'app-win-popup',
  templateUrl: './win-popup.component.html',
  styleUrls: ['./win-popup.component.scss']
})
export class WinPopupComponent {

  public winner: FinishedState;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WinPopupComponent>
  ) {
    this.winner = data.winner;
  }

  onClickCloseButton(): void {
    this.dialogRef.close();
  }
}
