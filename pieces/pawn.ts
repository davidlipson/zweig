import { Square, Board } from '../board';
import { Colour, Piece } from './piece';

export class Pawn extends Piece {
  canEnPassent: boolean = false;

  constructor(colour: Colour) {
    super(colour, '\u2659', 10);
  }

  duplicate() {
    const dup = new Pawn(this.colour);
    dup.alive = this.alive;
    dup.moved = this.moved;
    dup.canEnPassent = this.canEnPassent;
    return dup;
  }

  move(square: Square) {
    this.canEnPassent = !this.moved && (square.rank === 4 || square.rank === 5);
    this.moved = true;
  }

  validSquares(square: Square, board: Board) {
    const direction = this.colour === 'White' ? -1 : 1;
    let possible: Square[] = [];
    if (!board.state(square.file, square.rank + direction)) {
      possible.push(board.find(square.file, square.rank + direction));
      if (
        !this.moved &&
        !board.state(square.file, square.rank + 2 * direction)
      ) {
        possible.push(board.find(square.file, square.rank + 2 * direction));
      }
    }
    const left = board.state(square.file - 1, square.rank + direction);
    const right = board.state(square.file + 1, square.rank + direction);
    if (left && left != this.colour) {
      possible.push(board.find(square.file - 1, square.rank + direction));
    }
    if (right && right != this.colour) {
      possible.push(board.find(square.file + 1, square.rank + direction));
    }

    return possible;
  }
}
