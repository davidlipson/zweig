import { Colour, Piece } from '../pieces';
import { Board } from './board';

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export const files = 'abcdefgh';
export class Square {
  rank: number;
  file: number;
  piece: Piece;

  constructor(rank: number, file: number, piece?: Piece) {
    this.file = file;
    this.rank = rank;
    this.piece = piece;
  }

  canMove(board: Board, square: Square) {
    if (this.piece) {
      const validNextPosition = this.piece.colour !== square.piece?.colour;
      const validPath = this.piece
        .validSquares(this, board)
        .includes(board.find(square.file, square.rank));
      return validNextPosition && validPath;
    }
    return false;
  }

  capture(piece: Piece) {
    if (piece) {
      if (this.piece) {
        this.piece.alive = false;
      }
      this.piece = piece;
      this.piece.moved = true;
    }
  }

  clear() {
    this.piece = null;
  }

  print(showAsValid?: boolean) {
    return this.piece ? this.piece.print(showAsValid) : showAsValid ? '•' : '_';
  }
}
