import React, { DependencyList, useEffect, useReducer } from "react"
import "./App.css"
import Controller from "./Controller"
import * as C from "./Controller"
import { Result } from "./Result"
import * as R from "./Result"
import { WSconnection } from "./WebSocket"

/*

Main Application model for the Gamepad project. Contains the core app view and
state management logic.

*/

/* DOMAIN */

type State = {
  url: string
  controller: Controller
  socket: Socket
  status: string
}

type Socket = Closed | Awaiting | Connected | Closing | Errored
type Awaiting = { status: "Awaiting"; connection?: WebSocket }
type Closed = { status: "ClosedSocket" }
type Connected = { status: "Connected"; connection: WebSocket }
type Closing = { status: "Closing"; connection: WebSocket }
type Errored = { status: "SocketError"; error: string }

type StateParams = { state: State; dispatch: (_: Action) => void }

/* InitialState */

const initialState: State = {
  url: "",
  socket: { status: "ClosedSocket" },
  controller: C.initController,
  status: "No connection currently",
}

/* ACTIONS */

type ConnectButtonClicked = { type: "ConnectButtonClicked" }
type ReceivedPayload = { type: "PayloadReceived"; value: Result<Controller> }
type InputUpdated = { type: "InputUpdated"; value: string }
type SuccessfulConnection = { type: "SuccessfulConnection"; value: WebSocket }
type FailedConnection = { type: "FailedConnection"; value: string }
type DisconnectButtonClicked = { type: "DisconnectButtonClicked" }
type SocketClosed = { type: "SocketClosed" }

type Action =
  | ReceivedPayload
  | InputUpdated
  | ConnectButtonClicked
  | DisconnectButtonClicked
  | SuccessfulConnection
  | FailedConnection
  | SocketClosed

/* UPDATES */

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "InputUpdated":
      return { ...state, url: action.value }
    case "ConnectButtonClicked":
      switch (state.socket.status) {
        case "ClosedSocket":
        case "SocketError":
          return {
            ...state,
            socket: { status: "Awaiting" },
            status: "Attempting to connect to socket.",
          }
        default:
          return { ...state, status: "Cannot connect to socket right now." }
      }
    case "SuccessfulConnection":
      return {
        ...state,
        socket: { status: "Connected", connection: action.value },
        status: "Socket connected, listening for controller data.",
      }
    case "FailedConnection":
      return {
        ...state,
        socket: { status: "ClosedSocket" },
        status: "Failed to connect to socket.",
      }
    case "DisconnectButtonClicked":
      switch (state.socket.status) {
        case "Connected":
          return {
            ...state,
            socket: { status: "Closing", connection: state.socket.connection },
            status: "Disconnecting from socket.",
          }
        default:
          return state
      }
    case "PayloadReceived":
      switch (action.value.isOk) {
        case true:
          return { ...state, controller: action.value.value }
        case false:
          return state
      }
      break
    case "SocketClosed":
      return {
        ...state,
        socket: { status: "ClosedSocket" },
        status: "Socket closed. No socket connected.",
      }
  }
}

/* VIEWS */

const MainView = (props: StateParams): JSX.Element => {
  const buttons = props.state.controller.buttons.map(ControllerButtonView)
  const sticks = props.state.controller.sticks.map(ControllerStickView)

  return (
    <div id="main-container">
      <header>
        <h1>React GamePad Example</h1>
      </header>
      <main id="main-content">
        <FormView state={props.state} dispatch={props.dispatch} />
        <div id="controller">
          <div id="sticks">{sticks}</div>
          <div id="buttons">{buttons}</div>
        </div>
      </main>
      <footer>Created by Kirk Shillingford</footer>
    </div>
  )
}

const FormView = (props: StateParams): JSX.Element => (
  <form id="form-content" action="">
    <label htmlFor="SocketUrlInput">Enter Websocket Url Here</label>
    <input
      type="text"
      id="SocketUrlInput"
      value={props.state.url}
      placeholder="wss://homework.rain.gg:8765"
      onChange={e => props.dispatch({ type: "InputUpdated", value: e.target.value })}
    />
    <div>{props.state.status}</div>

    <div id="form-buttons">
      <button type="button" onClick={_ => props.dispatch({ type: "ConnectButtonClicked" })}>
        Connect
      </button>
      <button type="button" onClick={_ => props.dispatch({ type: "DisconnectButtonClicked" })}>
        Disconnect
      </button>
    </div>
  </form>
)

const ControllerButtonView = (cbutton: C.Button) => (
  <div id={cbutton.name} className={`contbutton ${cbutton.status}`}>
    {cbutton.name}
  </div>
)

const ControllerStickView = (stick: C.Stick) => {
  const xshift = `${stick.position.x.value * 100}%`
  const yshift = `${stick.position.y.value * 100}%`

  const divStyle = { transform: `translate(${xshift}, ${yshift})` }
  return (
    <div id={stick.name} className="stick" style={divStyle}>
      {stick.name}
    </div>
  )
}

/* EFFECTS */

const socketPayloadEffect = (
  state: State,
  dispatch: (_: Action) => void
): [React.EffectCallback, DependencyList] => {
  const effect = () => {
    switch (state.socket.status) {
      case "Awaiting":
        const result = tryCreateSocket(state.url, dispatch)
        switch (result.isOk) {
          case true:
            dispatch({
              type: "SuccessfulConnection",
              value: result.value,
            })
            break
          case false:
            dispatch({ type: "FailedConnection", value: result.error })
        }
        break
      case "Closing":
        state.socket.connection.close()
        dispatch({ type: "SocketClosed" })
    }
  }

  const dependencyList = [state.socket]

  return [effect, dependencyList]
}

/* APPLICATION */

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [receivePayload, dependencyList] = socketPayloadEffect(state, dispatch)

  useEffect(receivePayload, dependencyList)

  return <MainView state={state} dispatch={dispatch} />
}

/* HELPER FUNCS */

const tryCreateSocket = (url: string, dispatch: (_: Action) => void): Result<WebSocket> => {
  try {
    const connection = WSconnection.getInstance(url)
    connection.onopen = function (e: Event) {
      console.log("Opened")
    }
    connection.onmessage = function (e: MessageEvent<string>) {
      dispatch({
        type: "PayloadReceived",
        value: C.parseJSON(JSON.parse(e.data)),
      })
    }
    return R.ok(connection)
  } catch (e) {
    console.log(e)
    return R.error(e)
  }
}

export default App
