/**
 * Player inserts a coin at a specific position (column)
 */
export class PlayerInsertCoinAction {
  static readonly type = '[Player] Insert coin';

  constructor(
    public column: number
  ) {
  }
}

/**
 * Resets the game
 */
export class ResetGameAction {
  static readonly type = '[Game] Reset';

  constructor() {
  }
}
