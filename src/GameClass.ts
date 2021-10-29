const players = ["X", "O"] as const;
type Player = typeof players[number];

const cellNames = [
  "top-left",
  "top-middle",
  "top-right",
  "center-left",
  "center-middle",
  "center-right",
  "bottom-left",
  "bottom-middle",
  "bottom-right"
] as const;
type CellName = typeof cellNames[number];

// shortcut for making fields from CellNames. Thanks, Typescript!
type Grid = { [key in CellName]: Player | null };

// a way of "proving" to ts that a string is actually a CellName
const isCellName = (x: string): x is CellName =>
  cellNames.includes(x as CellName);

const hasWinner = (grid: Grid) => {
  const winningComboNames: CellName[][] = [
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
    const count = Object.entries(this._grid)
      .map(([_, value]) => value) // get the grid items
      .reduce(
        // count all the Xs and Os
        (counter, value) => {
          if (value === "X") counter.x += 1;
          else if (value === "O") counter.o += 1;
          return counter;
        },
        { x: 0, o: 0 }
      );
    return count.x > count.o ? "O" : "X"; // if there are more Xs, it's O's turn.
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

  getCell = (name: string) => (isCellName(name) ? this._grid[name] : null);

  setCell = (name: string) => {
    // no winner, a valid name and an empty cell? Set the value.
    if (!this.winner && isCellName(name) && !this._grid[name])
      this._grid[name] = this.turn;
  };

  static get cellNames(): string[] {
    return cellNames.map((n) => n);
  }
}
