import { useEffect, useReducer } from "react";
import "./styles.css";

function getRandomId() {
  return Math.floor(Math.random() * 251) + 1;
}

const initialState = {
  pokemonId: getRandomId(),
  isLoading: false,
  data: null
};

async function fetchPokemon(id: number) {
  const res = await fetch(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  )
    .then((r) => r.arrayBuffer())
    .then((ab) => URL.createObjectURL(new Blob([ab], { type: "image/jpeg" })));
  return await res;
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "start":
      return {
        ...state,
        isLoading: true
      };
    case "finish":
      return {
        ...state,
        isLoading: false,
        data: action.data
      };
    case "randomize":
      return {
        ...state,
        pokemonId: getRandomId()
      };
    default:
      throw new Error("unkonwn action");
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function run(id: any) {
      dispatch({
        type: "start"
      });

      const data = await fetchPokemon(id);

      dispatch({
        type: "finish",
        data
      });
    }

    run(state.pokemonId);
  }, [state.pokemonId]);
  return (
    <div className="App">
      <h1>Who's that pokemon?!</h1>
      <button
        onClick={() => {
          dispatch({ type: "randomize" });
        }}
      >
        Randomize
      </button>
      <h2>Click the button to get a new one.</h2>
      {state.isLoading && <div>Loading</div>}
      {state.data && (
        <div>
          <img src={state.data} alt="random pokemon"></img>
        </div>
      )}
    </div>
  );
}
