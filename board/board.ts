import { Colour, King, Pawn, Piece } from '../pieces';
import { Bishop } from '../pieces/bishop';
import { Horse } from '../pieces/horse';
import { Queen } from '../pieces/queen';
import { Rook } from '../pieces/rook';
import { File, files, Square } from './square';
const prompt = require('prompt-sync')();

const r0 = [Rook, Horse, Bishop, Queen, King, Bishop, Horse, Rook];

export type BoardPiece = Rook | Horse | Bishop | Queen | King | Pawn;

export class Board {
  squares: Square[] = [];
  pieces: Piece[] = [];
  currentMove: Colour = 'White';
  constructor() {
    [...Array(8).keys()].forEach((f) => {
      [...Array(8).keys()].forEach((r) => {
        let piece: Piece;
        if (r === 0 || r === 7) {
          piece = new r0[f](r === 0 ? 'Black' : 'White');
        } else if (r === 1 || r === 6) {
          piece = new Pawn(r === 1 ? 'Black' : 'White');
        }
        if (piece) {
          this.pieces.push(piece);
        }
        this.squares.push(new Square(r, f, piece));
      });
    });
  }

  // returns if colour has check
  hasCheck(colour: Colour): boolean {
    // check if any of colour pieces can hit square with king in it
    const kingSquare = this.findSquareByPiece(
      colour === 'White' ? 'Black' : 'White',
      new King(colour)
    );
    const colourPieces = this.squares.filter((s) => s.piece?.colour === colour);
    return colourPieces.some((c) =>
      c.piece.validSquares(c, this).includes(kingSquare)
    );
  }

  inStale(colour: Colour) {
    const colourSquares = this.squares.filter(
      (s) => s.piece?.colour === colour
    );
    return !colourSquares.some((c) => {
      const validSquares = c.piece.validSquares(c, this);
      return validSquares.some((v) => {
        const checkBoard = this.simulateMove(c, v);
        return !checkBoard.hasCheck(colour === 'White' ? 'Black' : 'White');
      });
    });
  }

  hasMate(colour: Colour) {
    return (
      this.hasCheck(colour) &&
      this.inStale(colour === 'Black' ? 'White' : 'Black')
    );
  }

  findSquareByPiece(colour: Colour, piece: BoardPiece): Square {
    return this.squares.find(
      (s) => s.piece?.symbol === piece.symbol && s.piece?.colour === colour
    );
  }

  setState(board: Board) {
    this.currentMove = board.currentMove;
    this.pieces = []; // fix?
    board.squares.forEach((s) => {
      this.find(s.file, s.rank).piece = s.piece?.duplicate();
    });
  }

  simulateMove(s0: Square, s1: Square): Board {
    const checkBoard = new Board();
    checkBoard.setState(this);
    const checkS0 = checkBoard.find(s0.file, s0.rank);
    const checkS1 = checkBoard.find(s1.file, s1.rank);
    checkS1.capture(checkS0.piece);
    checkS0.clear();
    return checkBoard;
  }

  // need to incorporate white still so its back and forth moves!!!




  computerMove(level = 4): { score: number; start?: Square; move?: Square } {
    if (level > 0) {
      let squares = this.squares
        .filter((s) => s.piece?.colour === 'Black')
        .filter((s) => s.piece.validSquares(s, this).length > 0);
      let bestStart: Square = null;
      let bestMove: Square = null;
      let bestScore = 1000;
      squares.forEach((square) => {
        square.piece.validSquares(square, this).forEach((move) => {
          const simulatedMove = this.simulateMove(square, move);
          const nextLevel = simulatedMove.computerMove(level - 1);
          const simulatedMoveScore =
            simulatedMove.score()/level + nextLevel.score;
          if (simulatedMoveScore < bestScore) {
            bestStart = square;
            bestMove = move;
            bestScore = simulatedMoveScore;
          }
        });
      });
      return { score: bestScore, move: bestMove, start: bestStart };
    } else {
      return { score: 0 };
    }
  }

  score() {
    const livingPieces = this.squares.filter((s) => Boolean(s.piece));
    let score = 0;
    livingPieces.forEach((l) => {
      score += l.piece.score * (l.piece.colour === 'White' ? 1 : -1);
    });
    return score;
  }

  move(): void {
    if (this.currentMove === 'Black') {
      while (true) {
        const { score, start, move } = this.computerMove();
        const checkBoard = this.simulateMove(start, move);
        if (
          start &&
          start.piece?.validSquares(start, this) &&
          move &&
          start.canMove(this, move) &&
          !checkBoard.hasCheck('White')
        ) {
          console.log(score, start, move);
          move.capture(start.piece);
          start.clear();
          // promotion
          if (
            move.piece.symbol === new Pawn('Black').symbol &&
            move.rank === 7
          ) {
            console.log(`BLACK PAWN PROMOTED!`);
            const promotion = new Queen('Black');
            promotion.moved = true;
            this.pieces.push(promotion);
            move.piece = promotion;
          }

          this.currentMove = 'White';

          break;
        }
      }
    } else {
      this.print();
      const s0 = this.selectPiece();
      const validSquares = s0?.piece?.validSquares(s0, this);
      if (s0 && validSquares.length > 0) {
        this.print(validSquares);
        const s1 = this.selectMove(s0);
        if (s0 && s1 && s0.canMove(this, s1)) {
          const checkBoard = this.simulateMove(s0, s1);
          if (checkBoard.hasCheck('Black')) {
            console.log('INVALID MOVE (CHECK)');
          } else {
            s1.capture(s0.piece);
            s0.clear();
            // promotion
            if (s1.piece.symbol === new Pawn('White').symbol && s1.rank === 0) {
              console.log(`${s1.piece.colour.toUpperCase()} PAWN PROMOTED!`);
              const promotion = new Queen(s1.piece.colour);
              promotion.moved = true;
              this.pieces.push(promotion);
              s1.piece = promotion;
            }

            this.currentMove = 'Black';
          }
        } else {
          console.log('INVALID PIECE SELECTED');
        }
      } else {
        console.log('INVALID SELECTION');
      }
    }
  }

  selectPiece(): Square {
    const move = this.promptPiece('SELECT PIECE TO MOVE:  ');
    const s0: Square = this.lookup(move);
    if (s0?.piece?.colour === this.currentMove) {
      return s0;
    }
    return null;
  }

  selectMove(s0: Square) {
    const move = this.promptPiece('SELECT SQUARE TO CAPTURE:  ');
    return this.lookup(move);
  }

  promptPiece(query: string) {
    const move = prompt(query);
    const ptrn = '[a-z][1-8]';
    const pattern = RegExp(`^${ptrn}$`);
    if (move.match(pattern)) {
      return move;
    }
    return null;
  }

  label(file: number, rank: number) {
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      try {
        return `${files[file]}${rank + 1}`;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  searchPieces(alive: boolean, colour: Colour) {
    let cemetery = '';
    this.pieces.forEach((p) => {
      if (p.alive === alive && p.colour === colour) {
        cemetery += p.symbol;
      }
    });
    return cemetery;
  }

  state(file: number, rank: number) {
    return this.find(file, rank)?.piece?.colour;
  }

  lookup(name: string) {
    try {
      const file = this.fileToPosition(name[0] as File);
      const rank = parseInt(name[1]);
      return this.find(file - 1, rank - 1);
    } catch (e) {
      return null;
    }
  }

  fileToPosition(file: File): number {
    return files.indexOf(file) + 1;
  }

  find(file: number, rank: number): Square {
    try {
      const idx = rank + 8 * file;
      return this.squares[idx];
    } catch (e) {
      return null;
    }
  }

  print(validSquares = []): void {
    if (this.hasCheck(this.currentMove === 'White' ? 'Black' : 'White')) {
      console.log('YOU ARE NOW IN CHECK!');
    }
    console.log(`    ${files.split('').join(' '.repeat(2))}`);
    [...Array(8).keys()].forEach((r) => {
      let row = [`${r + 1} `];
      [...Array(8).keys()].forEach((f) => {
        const idx = r + 8 * f;
        row.push(
          this.squares[idx].print(validSquares.includes(this.find(f, r)))
        );
      });
      if (r === 0) {
        row.push(`   ${this.searchPieces(false, 'Black')}`);
      } else if (r === 7) {
        row.push(`   ${this.searchPieces(false, 'White')}`);
      }
      console.log(row.join(' '.repeat(2)));
    });
    console.log(`    ${files.split('').join(' '.repeat(2))}`);
    console.log(`${this.currentMove} TO MOVE`);
  }
}
