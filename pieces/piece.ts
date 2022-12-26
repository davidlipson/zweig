import { Board, Square } from '../board';

export type Colour = 'White' | 'Black';
export class Piece {
  alive: boolean = true;
  moved: boolean = false;
  colour: Colour;
  symbol: string;

  constructor(colour: Colour, symbol: string) {
    this.colour = colour;
    this.symbol = colour === 'Black' ? symbol.toUpperCase() : symbol;
  }

  duplicate() {
    const dup = new Piece(this.colour, this.symbol);
    dup.alive = this.alive;
    dup.moved = this.moved;
    return dup;
  }

  validSquaresIterator(
    f: number,
    r: number,
    board: Board,
    itFile: number,
    itRank: number,
    limit = 8
  ) {
    let possible = [];
    let count = 0;
    const fInit = f;
    const rInit = r;
    f += itFile;
    r += itRank;
    while (f >= 0 && f < 8 && r < 8 && r >= 0 && count < limit) {
      const state = board.state(f, r);
      /*const checkBoard = new Board();
      checkBoard.setState(board);
      const checkS0 = checkBoard.find(fInit, rInit);
      const checkS1 = checkBoard.find(f, r);
      checkS1.capture(checkS0.piece);
      checkS0.clear();*/
      if (
        /*!checkBoard.hasCheck(
          checkBoard.currentMove === 'White' ? 'Black' : 'White'
        ) &&*/
        state !== this.colour
      ) {
        possible.push(board.find(f, r));
        if (state) {
          break;
        }
      } else {
        break;
      }

      f += itFile;
      r += itRank;
      count++;
    }
    return possible;
  }

  validSquares(square: Square, board: Board) {
    return [];
  }

  print(showAsValid?: boolean) {
    return showAsValid ? '*' : this.symbol;
    // make this clearer
  }
}
