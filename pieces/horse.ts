import { Board, Square } from '../board';
import { Colour, Piece } from './piece';

export class Horse extends Piece {
  constructor(colour: Colour) {
    super(colour, '\u2658', 30);
  }

  duplicate(){
    const dup = new Horse(this.colour);
    dup.alive = this.alive;
    dup.moved = this.moved;
    return dup;
  }

  validSquares(square: Square, board: Board) {
    let possible = [];
    possible = possible.concat(
      this.validSquaresIterator(
        square.file,
        square.rank,
        board,
        2,
        1,
        1
      )
    );
    possible = possible.concat(
      this.validSquaresIterator(
        square.file + 2,
        square.rank - 1,
        board,
        0,
        0,
        1
      )
    );
    possible = possible.concat(
      this.validSquaresIterator(
        square.file - 2,
        square.rank + 1,
        board,
        0,
        0,
        1
      )
    );
    possible = possible.concat(
      this.validSquaresIterator(
        square.file - 2,
        square.rank - 1,
        board,
        0,
        0,
        1
      )
    );
    possible = possible.concat(
      this.validSquaresIterator(
        square.file + 1,
        square.rank + 2,
        board,
        0,
        0,
        1
      )
    );
    possible = possible.concat(
      this.validSquaresIterator(
        square.file - 1,
        square.rank + 2,
        board,
        0,
        0,
        1
      )
    );
    possible = possible.concat(
      this.validSquaresIterator(
        square.file - 1,
        square.rank - 2,
        board,
        0,
        0,
        1
      )
    );
    possible = possible.concat(
      this.validSquaresIterator(
        square.file + 1,
        square.rank - 2,
        board,
        0,
        0,
        1
      )
    );
    return possible;
  }
}
