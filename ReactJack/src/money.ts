declare const tag: unique symbol
type Money = { readonly [tag]: "Money" }

const toNum = (m: Money): number => m as any
const toMoney = (n: number): Money => n as any

const isPositive = (n: number) => !Number.isNaN(n) || n < 0

const init = (n: number): Money => {
  if (!isPositive(n)) throw Error("Initial monetary value is invalid.")
  else return n as any
}

const value = (m: Money) => (isPositive(toNum(m)) ? toNum(m) : "Zero")

const add = (current: Money, n: number): Money =>
  isPositive(n) ? toMoney(toNum(current) + n) : current

const subtract = (current: Money, n: number): Money =>
  isPositive(n) ? toMoney(toNum(current) - n) : current

export { init, value, add, subtract, Money }
