import { useEffect, useReducer } from "react";
import "./styles.css";

// Domain

type State = "Initial" | "Loading" | FetchedPokemon | ErrorFetching;
type FetchedPokemon = { type: "FetchedPokemon"; value: string };
type ErrorFetching = { type: "ErrorFetching"; error: string };

type Action = RandomPokemonRequested | PokemonReturned | ErrorReturned;
type RandomPokemonRequested = { type: "RandomPokemonRequested" };
type PokemonReturned = { type: "PokemonReturned"; value: string };
type ErrorReturned = { type: "ErrorReturned"; error: string };

// Helper funcs
function getRandomId() {
  return Math.floor(Math.random() * 551) + 1;
}

// Init
const initialState: State = "Initial";

async function fetchPokemon(): Promise<string> {
  const rand_id = getRandomId();
  if (Math.random() < 0.2) {
    throw new Error("error fetching");
  }
  const res = await fetch(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${rand_id}.png`
  )
    .then((r) => r.arrayBuffer())
    .then((ab) => URL.createObjectURL(new Blob([ab], { type: "image/jpeg" })));
  return res;
}

// update / controller
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "RandomPokemonRequested":
      return "Loading";
    case "PokemonReturned":
      return { type: "FetchedPokemon", value: action.value };
    case "ErrorReturned":
      return { type: "ErrorFetching", error: action.error };
  }
};

// components
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function run() {
      switch (state) {
        case "Initial":
        case "Loading": {
          try {
            const data = await fetchPokemon();
            dispatch({ type: "PokemonReturned", value: data });
          } catch (e) {
            dispatch({ type: "ErrorReturned", error: (e as Error).message });
          }
        }
      }
    }
    run();
  }, [state]);

  // views

  return (
    <div className="App">
      <h1>Who's that pokemon?!</h1>
      <button
        onClick={() => {
          dispatch({ type: "RandomPokemonRequested" });
        }}
      >
        Randomize
      </button>
      <h2>Click the button to get a new one.</h2>
      {state === "Initial" ? (
        <div>Initial!</div>
      ) : state === "Loading" ? (
        <div>Loading</div>
      ) : state.type === "FetchedPokemon" ? (
        <img src={state.value} alt="random pokemon" />
      ) : (
        <div>Error! {state.error}</div>
      )}
    </div>
  );
}
