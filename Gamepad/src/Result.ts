/*

Create a simple result interface to wrap values which may or may
not be returned from a function that could fail. Either you have
an Ok of some vlaue, or an Error which is a string


*/

export type Ok<T> = { isOk: true; value: T }

export type Error = { isOk: false; error: string }

export type Result<T> = Ok<T> | Error

// helper functions for creating our OK and Error types
export function ok<T>(value: T): Ok<T> {
  return { isOk: true, value: value }
}

export function error(message: string): Error {
  return { isOk: false, error: message }
}
