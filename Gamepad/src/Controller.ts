import { Result } from "./Result"
import * as R from "./Result"

/* Module for Game Controller logic and API

// We'll start by define our Domain; making some semantic data structuresso we can have API guarantees at compile time and a language for describing what we need.

Then we define the base state for a controller.

Finally we provide an interface for attempting to create a controller from some JSON object.

*/

type Controller = { sticks: Sticks; buttons: Buttons }
type Buttons = [AButton, BButton, XButton, YButton]
type Sticks = [LeftStick, RightStick]

export type Button = AButton | BButton | XButton | YButton
export type Stick = LeftStick | RightStick

type IStick = { name: StickName; position: StickPosition }
type LeftStick = IStick & { name: "Left" }
type RightStick = IStick & { name: "Right" }

type IButton = { name: ButtonName; status: ButtonStatus }
type AButton = IButton & { name: "A" }
type BButton = IButton & { name: "B" }
type XButton = IButton & { name: "X" }
type YButton = IButton & { name: "Y" }

type StickName = "Left" | "Right"

type ButtonName = "A" | "B" | "X" | "Y"

type ButtonStatus = "Pressed" | "NotPressed"

type BoundedNum = { value: number }
type StickPosition = { x: BoundedNum; y: BoundedNum }

/*
Defining our initial values
*/
const initA: AButton = { name: "A", status: "NotPressed" }
const initB: BButton = { name: "B", status: "NotPressed" }
const initX: XButton = { name: "X", status: "NotPressed" }
const initY: YButton = { name: "Y", status: "NotPressed" }

const initPosition: BoundedNum = { value: 0 }
const initCoord: StickPosition = { x: initPosition, y: initPosition }
const initlstick: LeftStick = { name: "Left", position: initCoord }
const initrstick: RightStick = { name: "Right", position: initCoord }

// we export the complete initial controller setup
export const initController: Controller = {
  sticks: [initlstick, initrstick],
  buttons: [initA, initB, initX, initY],
}

/*
This parseJSON implementation is verbose, but type safe,
and verifies the json coming from the back end was appropriate.
*/
export const parseJSON = (input: any): Result<Controller> => {
  const toStatus = (b: boolean) => (b ? "Pressed" : "NotPressed")

  const toBounded = (n: number): BoundedNum => {
    /* For now we're just clipping any out of bound values but we may want
    having bounded values ensures we can never represent coordinates that
    don't make sense.
    */
    if (n <= 1 || n >= -1) {
      return { value: n }
    } else {
      throw new RangeError("control stick coordinates must be between -1 and 1")
    }
  }
  try {
    // try to get values from our json object
    const leftx = input.thumbsticks.left.x
    const lefty = input.thumbsticks.left.y
    const rightx = input.thumbsticks.left.x
    const righty = input.thumbsticks.left.y

    const a = input.buttons.a
    const b = input.buttons.b
    const x = input.buttons.x
    const y = input.buttons.y

    // if that fetch was successful we can construct our controller object
    const aButton: AButton = { name: "A", status: toStatus(a) }
    const bButton: BButton = { name: "B", status: toStatus(b) }
    const xButton: XButton = { name: "X", status: toStatus(x) }
    const yButton: YButton = { name: "Y", status: toStatus(y) }

    const left: LeftStick = {
      name: "Left",
      position: { x: toBounded(leftx), y: toBounded(lefty) },
    }
    const right: RightStick = {
      name: "Right",
      position: { x: toBounded(rightx), y: toBounded(righty) },
    }

    return R.ok({
      sticks: [left, right],
      buttons: [aButton, bButton, xButton, yButton],
    })
  } catch (error) {
    return R.error("Could not parse json: " + error)
  }
}

export default Controller
