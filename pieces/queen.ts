import { Board, Square } from '../board';
import { Bishop } from './bishop';
import { Colour, Piece } from './piece';
import { Rook } from './rook';

export class Queen extends Piece {
  constructor(colour: Colour) {
    super(colour, 'q');
  }

  duplicate(){
    const dup = new Queen(this.colour);
    dup.alive = this.alive;
    dup.moved = this.moved;
    return dup;
  }

  validSquares(square: Square, board: Board) {
    let possible = [];
    const bishopCheck = new Bishop(this.colour);
    const rookCheck = new Rook(this.colour);
    possible = possible.concat(bishopCheck.validSquares(square, board));
    possible = possible.concat(rookCheck.validSquares(square, board));
    return possible;
  }
}
