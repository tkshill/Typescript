import "./styles.css";
import Game from "./GameClass";
import { useState } from "react";

const initialGame = () => ({ game: new Game() });

export default function App() {
  const [state, setState] = useState(initialGame());

  const update = (value: number | "Restart") => {
    if (value !== "Restart") {
      state.game.setCell(value);
      setState({ ...state });
    } else setState(initialGame());
  };

  const Cell = (name: number) => (
    <button key={name} id={name.toString()} onClick={() => update(name)}>
      {state.game.getCell(name) ?? ""}
    </button>
  );

  const statusMessage = () => {
    if (state.game.winner) return `${state.game.winner} won the game!`;
    else if (state.game.isFull) return "The game is a draw!";
    else return `${state.game.turn}'s turn to play!`;
  };

  return (
    <div className="App">
      <h1>Reac Tac Toe</h1>
      <div id="gamebox">{state.game.cellNames.map(Cell)}</div>
      <div id="status">{statusMessage()}</div>
      <button onClick={() => update("Restart")}>Restart</button>
    </div>
  );
}
