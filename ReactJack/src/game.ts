import { Money } from "./money"
import * as M from "./money"
import {
  Card,
  allCards,
  toNumbers as toNums,
  turnUp,
  string as cardString
} from "./card"

// DOMAIN

type Deck = Card[]

type Dealer = { name: "Dealer"; hand: Card[] }
type Player = { name: "Player"; hand: Card[]; moneyRemaining: Money }

type Turn =
  | "Pregame"
  | "InitialDeal"
  | "PlayerTurn"
  | "DealerTurn"
  | "PlayerWin"
  | "DealerWin"
  | "Draw"

type GameState = {
  deck: Deck
  dealer: Dealer
  player: Player
  bet: Money
  turn: Turn
}

const messages = ["Hit", "Stand", "Start", "Reset"] as const
type Message = typeof messages[number]

declare const tag: unique symbol
type Game = { readonly [tag]: "Game" }

// INITIAL VALUES

const initialDeck: Deck = allCards

const initialPlayer: Player = {
  name: "Player",
  hand: [],
  moneyRemaining: M.init(100)
}

const initialDealer: Dealer = {
  name: "Dealer",
  hand: []
}

const initialBet = M.init(50)

const initialGame: GameState = {
  deck: initialDeck,
  player: initialPlayer,
  dealer: initialDealer,
  bet: initialBet,
  turn: "Pregame"
}

// HELPERS

const shuffleArray = <t>(arr: t[]): t[] => {
  let result = [...arr]
  let indexes = [...Array(arr.length).keys()].reverse()

  indexes.forEach(i => {
    const randIdx = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[randIdx]
    result[randIdx] = temp
  })
  return result
}

const max = (arr: number[]) => arr.reduce((n1, n2) => (n1 > n2 ? n1 : n2))

// OPERATIONS

const shuffleAndDeal = (): GameState => {
  const game = initialGame
  const newDeck = shuffleArray(game.deck)

  const dealerCardOne = turnUp(newDeck.shift()!)
  const dealerCardTwo = newDeck.shift()!
  const playerCardOne = turnUp(newDeck.shift()!)
  const playerCardTwo = turnUp(newDeck.shift()!)

  return {
    ...game,
    deck: newDeck,
    player: { ...game.player, hand: [playerCardOne, playerCardTwo] },
    dealer: { ...game.dealer, hand: [dealerCardOne, dealerCardTwo] },
    turn: "InitialDeal"
  }
}

const getScores = (hand: Card[]): number[] =>
  hand.reduce(
    (sums, card) => sums.flatMap(n1 => toNums(card).map(n2 => n1 + n2)),
    [0] as number[]
  )

const tryWin = (g: GameState): GameState => {
  const pScores = getScores(g.player.hand)
  const dScores = getScores(g.dealer.hand)

  if (pScores.every(score => score > 21) && dScores.every(score => score > 21))
    return { ...g, turn: "Draw" }
  if (pScores.every(score => score > 21)) return { ...g, turn: "DealerWin" }
  if (dScores.every(score => score > 21)) return { ...g, turn: "PlayerWin" }

  const fpScores = pScores.filter(score => score <= 21)
  const fdScores = dScores.filter(score => score <= 21)

  if (
    fpScores.some(score => score === 21) &&
    fdScores.some(score => score === 21)
  )
    return { ...g, turn: "Draw" }
  if (fpScores.some(score => score === 21)) return { ...g, turn: "PlayerWin" }
  if (fdScores.some(score => score === 21)) return { ...g, turn: "DealerWin" }
  if (g.turn === "DealerTurn" && max(fpScores) === max(fdScores))
    return { ...g, turn: "Draw" }
  if (g.turn === "DealerTurn")
    return max(fpScores) > max(fdScores)
      ? { ...g, turn: "PlayerWin" }
      : { ...g, turn: "DealerWin" }
  else return g
}

const applyHit = (g: GameState): GameState => {
  const card = turnUp(g.deck.shift()!)
  if (g.turn === "PlayerTurn") {
    const newHand = [...g.player.hand, card]
    const newPlayer = { ...g.player, hand: newHand }
    return { ...g, player: newPlayer }
  } else {
    const newHand = [...g.dealer.hand, card]
    const newDealer = { ...g.dealer, hand: newHand }
    return { ...g, dealer: newDealer }
  }
}

const flipAll = (g: GameState): GameState => ({
  ...g,
  dealer: { ...g.dealer, hand: g.dealer.hand.map(turnUp) }
})

const dealerPlays = (g: GameState): GameState =>
  getScores(g.dealer.hand).every(score => score > 21) ||
  getScores(g.dealer.hand).some(score => score > 16 && score <= 21)
    ? g
    : dealerPlays(applyHit(g))

const toGameState = (g: Game): GameState => g as any
const toGame = (g: GameState): Game => g as any

// API

const update = (g: Game, message: Message): Game => {
  let game = toGameState(g)
  switch (message) {
    case "Start": {
      game = tryWin(shuffleAndDeal())
      if (game.turn === "InitialDeal")
        return toGame({ ...game, turn: "PlayerTurn" })
      else return toGame(flipAll(game))
    }
    case "Hit":
      return toGame(tryWin(applyHit(game)))
    case "Stand":
      return toGame(
        tryWin(dealerPlays(flipAll({ ...game, turn: "DealerTurn" })))
      )
    case "Reset":
      return toGame(initialGame)
  }
}
const deck = (g: Game) => toGameState(g).deck
const player = (g: Game) => toGameState(g).player
const dealer = (g: Game) => toGameState(g).dealer
const bet = (g: Game) => toGameState(g).bet
const turn = (g: Game) => toGameState(g).turn
const funds = (g: Game) => M.value(toGameState(g).player.moneyRemaining)
const init: Game = toGame(initialGame)

export {
  Game,
  deck,
  player,
  dealer,
  turn,
  update,
  bet,
  init,
  cardString,
  funds
}
