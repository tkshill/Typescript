const suits = ["Hearts", "Spades", "Diamonds", "Clubs"] as const
type Suit = typeof suits[number]

const cardValues = [
  "Ace",
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  "Jack",
  "Queen",
  "King"
] as const
type CardValue = typeof cardValues[number]

type CardStatus = "FaceUp" | "FaceDown"

type Card = {
  suit: Suit
  value: CardValue
  status: CardStatus
}

const toNumbers = (c: Card): number[] => {
  switch (c.value) {
    case "Ace":
      return [1, 11]
    case "Jack":
    case "Queen":
    case "King":
      return [10]
    default:
      return [c.value]
  }
}

const allCards: Card[] = suits.flatMap(suit =>
  cardValues.map(value => ({
    suit: suit,
    value: value,
    status: "FaceDown"
  }))
)

const turnUp = (c: Card): Card => ({ ...c, status: "FaceUp" })

const string = (c: Card): string => {
  if (c.status === "FaceDown") return "🂠"
  if (c.suit === "Spades") {
    switch (c.value) {
      case "Ace":
        return "🂡"
      case 2:
        return "🂢"
      case 3:
        return "🂣"
      case 4:
        return "🂤"
      case 5:
        return "🂥"
      case 6:
        return "🂦"
      case 7:
        return "🂧"
      case 8:
        return "🂨"
      case 9:
        return "🂩"
      case 10:
        return "🂪"
      case "Jack":
        return "🂫"
      case "Queen":
        return "🂭"
      case "King":
        return "🂮"
    }
  } else if (c.suit === "Hearts") {
    switch (c.value) {
      case "Ace":
        return "🂱"
      case 2:
        return "🂲"
      case 3:
        return "🂳"
      case 4:
        return "🂴"
      case 5:
        return "🂵"
      case 6:
        return "🂶"
      case 7:
        return "🂷"
      case 8:
        return "🂸"
      case 9:
        return "🂹"
      case 10:
        return "🂺"
      case "Jack":
        return "🂻"
      case "Queen":
        return "🂽"
      case "King":
        return "🂾"
    }
  } else if (c.suit === "Diamonds") {
    switch (c.value) {
      case "Ace":
        return "🃁"
      case 2:
        return "🃂"
      case 3:
        return "🃃"
      case 4:
        return "🃄"
      case 5:
        return "🃅"
      case 6:
        return "🃆"
      case 7:
        return "🃇"
      case 8:
        return "🃈"
      case 9:
        return "🃉"
      case 10:
        return "🃊"
      case "Jack":
        return "🃋"
      case "Queen":
        return "🃍"
      case "King":
        return "🃎"
    }
  } else {
    switch (c.value) {
      case "Ace":
        return "🃑"
      case 2:
        return "🃒"
      case 3:
        return "🃓"
      case 4:
        return "🃔"
      case 5:
        return "🃕"
      case 6:
        return "🃖"
      case 7:
        return "🃗"
      case 8:
        return "🃘"
      case 9:
        return "🃙"
      case 10:
        return "🃚"
      case "Jack":
        return "🃛"
      case "Queen":
        return "🃝"
      case "King":
        return "🃞"
    }
  }
}
export { Card, allCards, string, toNumbers, turnUp }
