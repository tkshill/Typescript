import "./styles.css";
import Game from "./GameClass";
import { useState } from "react";

const initialGame = () => ({ game: new Game() });

export default function App() {
  const [state, setState] = useState(initialGame());

  // this is where we update the state of our application
  const update = (value: number | "Restart") => {
    switch (value) {
      case "Restart":
        setState(initialGame());
        break;
      default:
        state.game.setCell(value);
        setState({ ...state });
    }
  };

  // our tiny little cell component
  const Cell = (key: number) => (
    <button key={key} id={`cell${key}`} onClick={() => update(key)}>
      {state.game.getCell(key) ?? ""}
    </button>
  );

  // I really dislike curly braces
  const statusMessage = (() => {
    if (state.game.winner) return `${state.game.winner} won the game!`;
    else if (state.game.isFull) return "The game is a draw!";
    else return `${state.game.turn}'s turn to play!`;
  })();

  // Putting it all together
  return (
    <div className="App">
      <h1>ReacTacToe</h1>
      <div id="gamebox">{state.game.cellNames.map(Cell)}</div>
      <div id="status">{statusMessage}</div>
      <button onClick={() => update("Restart")}>Restart</button>
    </div>
  );
}
