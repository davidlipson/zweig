import { Square, Board } from '../board';
import { Colour, Piece } from './piece';

export class Rook extends Piece {
  constructor(colour: Colour) {
    super(colour, 'r');
  }

  duplicate(){
    const dup = new Rook(this.colour);
    dup.alive = this.alive;
    dup.moved = this.moved;
    return dup;
  }

  validSquares(square: Square, board: Board, limit = 8) {
    let possible = [];
    possible = possible.concat(this.validSquaresIterator(square.file, square.rank, board, 1, 0, limit))
    possible = possible.concat(this.validSquaresIterator(square.file, square.rank, board, -1, 0, limit))
    possible = possible.concat(this.validSquaresIterator(square.file, square.rank, board, 0, -1, limit))
    possible = possible.concat(this.validSquaresIterator(square.file, square.rank, board, 0, 1, limit))
    return possible;
  }
}
