import { Square, Board } from '../board';
import { Bishop } from './bishop';
import { Colour, Piece } from './piece';
import { Rook } from './rook';

export class King extends Piece {
  constructor(colour: Colour) {
    super(colour, '\u2654', 900);
  }

  duplicate() {
    const dup = new King(this.colour);
    dup.alive = this.alive;
    dup.moved = this.moved;
    return dup;
  }

  validSquares(square: Square, board: Board) {
    let possible = [];
    const bishopCheck = new Bishop(this.colour);
    const rookCheck = new Rook(this.colour);
    possible = possible.concat(bishopCheck.validSquares(square, board, 1));
    possible = possible.concat(rookCheck.validSquares(square, board, 1));
    
    // castling

    return possible;
  }
}
