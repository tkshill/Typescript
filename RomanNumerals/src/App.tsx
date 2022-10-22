import React, { useReducer, ChangeEvent } from 'react';
import RomanNumeral from './RomanNumerals'
import './App.css';

// do research on accessibility based react testing (kent c dodds dataid)
// todo: shrink state
// replace strings with ints and other "real" values
// create boring regular unit tests in suite
// move fast check to suite
// create suite for unit tests

type ActionType =
  | 'ToRomanClicked'
  | 'ToIntClicked'
  | 'IntInputChanged'
  | 'RomanInputChanged'


interface IAction { type: ActionType }


interface ToRomanClicked extends IAction { type: 'ToRomanClicked' }
interface ToIntClicked extends IAction { type: 'ToIntClicked' }
interface InputIntChanged extends IAction { type: 'IntInputChanged' }
interface InputRomanChanged extends IAction { type: 'RomanInputChanged' }


type EventResponse = { value: string };


type Action =
  | ToRomanClicked
  | ToIntClicked
  | InputIntChanged & EventResponse
  | InputRomanChanged & EventResponse


const toRomanClicked = (): Action =>
  ({ type: 'ToRomanClicked' })
const toIntClicked = (): Action =>
  ({ type: 'ToIntClicked' })
const inputIntChanged = (input: string): Action =>
  ({ type: 'IntInputChanged', value: input })
const inputRomanChanged = (input: string): Action =>
  ({ type: 'RomanInputChanged', value: input })


type State = {
  numberInput: string,
  romanNumeralInput: string,
  numState: RomanNumeral
  numberResult: string,
  romanNumeralResult: string,
}


const initialState: State = {
  numberInput: "",
  numberResult: "",
  romanNumeralInput: " ",
  romanNumeralResult: " ",
  numState: RomanNumeral.init
}


const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'IntInputChanged': return { ...state, numberInput: action.value };
    case 'RomanInputChanged': return { ...state, romanNumeralInput: action.value };
    case 'ToRomanClicked': {
      const validationResult = RomanNumeral.fromInt(parseInt(state.numberInput))
      if (validationResult.isOk()) {
        const romanNumeral = validationResult.value
        return {
          ...state,
          numState: romanNumeral,
          numberResult: romanNumeral.asString()
        }
      } else
        return { ...state, numberResult: "Invalid Number Entered" };
    }
    case 'ToIntClicked': {
      const validationResult = RomanNumeral.fromString(state.romanNumeralInput.toUpperCase().trim())
      if (validationResult.isOk()) {
        const romanNumeral = validationResult.value
        return {
          ...state,
          numState: romanNumeral,
          romanNumeralResult: romanNumeral.asInt().toString()
        }
      }
      return { ...state, romanNumeralResult: "Invalid Roman Numeral Entered" };
    }
  }
}

interface InputProps {
  id: string,
  name: string,
  value: string,
  result: string,
  resultid: string,
  buttonid: string,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
}

const InputCom = ({ id, name, value, onChange, onClick, result, resultid, buttonid }: InputProps) => {
  return (<div className="inputComp">
    <label htmlFor={id}>{name}</label>
    <input data-testid={id}
      type="text"
      id={id}
      value={value}
      onChange={onChange}
    />
    <button type="submit" data-testid={buttonid} onClick={onClick}>Convert</button>
    <p data-testid={resultid}>{result}</p>
  </div >)
}


const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div id="main">
      <header id="header">Roman Numerals Converter</header>
      <form id="mainform" onSubmit={e => e.preventDefault()}>
        <InputCom
          id="intInput"
          name="Enter Integer Here"
          value={state.numberInput}
          result={state.numberResult}
          resultid="intResult"
          buttonid="intbutton"
          onChange={(e) => dispatch(inputIntChanged(e.target.value))}
          onClick={() => dispatch(toRomanClicked())}
        />
        <InputCom
          id="romanInput"
          name="Enter Roman Numeral Here"
          value={state.romanNumeralInput}
          result={state.romanNumeralResult}
          resultid="romanResult"
          buttonid="romanbutton"
          onChange={(e) => dispatch(inputRomanChanged(e.target.value))}
          onClick={() => dispatch(toIntClicked())}
        />
      </form>
    </div>
  )
}

export default App;
