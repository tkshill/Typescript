import "./styles.css"
import {
  Game,
  bet,
  player,
  dealer,
  turn,
  init,
  update,
  cardString
} from "./game"
import { useState } from "react"

/* TODOS
- money logic
- add comments
- refactor win logic
- async update
*/

type State = Game

const initialState: State = init

export default function App() {
  const [game, setState] = useState(initialState)

  const PlayerButtons = () => {
    switch (turn(game)) {
      case "Pregame":
        return (
          <button onClick={() => setState(update(game, "Start"))}>
            Start Game
          </button>
        )
      case "PlayerTurn":
        return (
          <div>
            <button onClick={() => setState(update(game, "Hit"))}>Hit</button>
            <button onClick={() => setState(update(game, "Stand"))}>
              Stand
            </button>
          </div>
        )
      case "PlayerWin":
      case "DealerWin":
      case "Draw":
        return (
          <div>
            <button onClick={() => setState(update(game, "Reset"))}>
              Reset
            </button>
          </div>
        )
      default:
        return <div></div>
    }
  }

  const WinAnnouncement = () => {
    switch (turn(game)) {
      case "PlayerWin":
        return <p>Player Won this round!</p>
      case "DealerWin":
        return <p>Dealer won this round.</p>
      case "Draw":
        return <p>It's a draw!</p>
      default:
        return <p></p>
    }
  }

  return (
    <div className="App">
      <div className="side">
        <h2>Pot</h2>
        <p>{bet(game)}</p>
        <h2>Remaining Funds</h2>
        <p>{player(game).moneyRemaining}</p>
        <PlayerButtons />
      </div>
      <div className="main">
        <h2>Dealer</h2>
        <p className="hand">
          {dealer(game).hand.map(card => cardString(card))}
        </p>
        <h2>Player</h2>
        <p className="hand">
          {player(game).hand.map(card => cardString(card))}
        </p>
        <WinAnnouncement />
      </div>
    </div>
  )
}
