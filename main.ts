import { Board } from "./board";

const board = new Board()

const main = async () => {
    board.move();
    main();
}

main();


