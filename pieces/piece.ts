import { Board, Square } from '../board';

export type Colour = 'White' | 'Black';
export class Piece {
  alive: boolean = true;
  moved: boolean = false;
  colour: Colour;
  symbol: string;
  score: number;

  constructor(colour: Colour, symbol: string, score: number) {
    this.colour = colour;
    this.symbol = symbol;
    this.score = score
  }

  duplicate() {
    const dup = new Piece(this.colour, this.symbol, this.score);
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

      if (state !== this.colour) {
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

  validSquares(square: Square, board: Board): Square[] {
    return [];
  }

  print(showAsValid?: boolean) {
    const col = this.colour === 'White' ? '\x1b[33m' : '\x1b[34m';
    return showAsValid ? '*' : `${col}${this.symbol}\x1b[0m`;
    // make this clearer
  }
}
