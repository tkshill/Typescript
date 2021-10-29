// shortcut for making fields from CellNames. Thanks, Typescript!
type Grid = { [key: string]: "X" | "O" | null };

const hasWinner = (grid: Grid) => {
  const winningComboNames: string[][] = [
    ["top-left", "top-middle", "top-right"], // top row
    ["center-left", "center-middle", "center-right"], // middle row
    ["bottom-left", "bottom-middle", "bottom-right"], // bottom row
    ["top-left", "center-left", "bottom-left"], // left column
    ["top-middle", "center-middle", "bottom-middle"], // middle column
    ["top-right", "center-right", "bottom-right"], // right column
    ["top-left", "center-middle", "bottom-right"], // descending diagonal
    ["bottom-left", "center-middle", "top-right"] // ascending diagonal
  ];

  return !!winningComboNames
    // get grid values for each combo
    .map((comboNames) => comboNames.map((name) => grid[name]))
    // try to find a groups that is all Xs or all Os. That's a winner!
    .find(
      (comboValues) =>
        comboValues.every((v) => v === "X") ||
        comboValues.every((v) => v === "O")
    );
};

export default class Game {
  private _grid: Grid;

  constructor() {
    this._grid = {
      "top-left": null,
      "top-middle": null,
      "top-right": null,
      "center-left": null,
      "center-middle": null,
      "center-right": null,
      "bottom-left": null,
      "bottom-middle": null,
      "bottom-right": null
    };
  }

  get turn() {
    const count = Object.values(this._grid) // get the grid items
      // count all the Xs and Os
      .reduce(
        (counter, value) => {
          if (value === "X") counter.x += 1;
          else if (value === "O") counter.o += 1;
          return counter;
        },
        { x: 0, o: 0 }
      );
    // if there are more Xs on the board, it's O's turn.
    return count.x > count.o ? "O" : "X";
  }

  get winner() {
    // if there's a winner and it's X's turn, that means O just won
    if (hasWinner(this._grid) && this.turn === "X") return "O";
    // if there's a winner and it's O's turn, that means X just won
    else if (hasWinner(this._grid) && this.turn === "O") return "X";
    else return null;
  }

  get isFull() {
    // no null values in the grid? full board
    return Object.entries(this._grid).every(([_, value]) => !!value);
  }

  getCell = (name: string) => (name in this._grid ? this._grid[name] : null);

  setCell = (name: string) => {
    // no winner, a valid name and an empty cell? Set the value.
    if (!this.winner && name in this._grid && !this._grid[name])
      this._grid[name] = this.turn;
  };

  get cellNames(): string[] {
    return Object.keys(this._grid);
  }
}
