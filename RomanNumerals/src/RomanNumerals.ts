import { Result, ok, err } from "./Result";

type ErrorName = "NanError" | "FloatError" | "RangeError" | "ParseError";

type IError = {
  name: ErrorName;
};

type NanError = IError & { name: "NanError" };
type FloatError = IError & { name: "FloatError" };
type RangeError = IError & { name: "RangeError" };
type ParseError = IError & { name: "ParseError" };

type Message = { message: string };

type Error =
  | (NanError & Message)
  | (FloatError & Message)
  | (RangeError & Message)
  | (ParseError & Message);

const nanError: Error = {
  name: "NanError",
  message: "Value is not a number.",
};
const floatError: Error = {
  name: "FloatError",
  message: "Value is not an integer.",
};
const rangeError: Error = {
  name: "RangeError",
  message: "Value must be between 1 and 3999",
};
const parseError: Error = {
  name: "ParseError",
  message: "Value is not a valid Roman Numeral",
};

const romanDigits = [
  "MMM",
  "MM",
  "M",
  "CM",
  "CD",
  "D",
  "CCCC",
  "CCC",
  "CC",
  "C",
  "XC",
  "XL",
  "L",
  "XXXX",
  "XXX",
  "XX",
  "X",
  "IX",
  "IV",
  "V",
  "IIII",
  "III",
  "II",
  "I",
] as const;

type RomanDigit = typeof romanDigits[number];

const romanDigitToInt = (r: RomanDigit): number => {
  switch (r) {
    case "I":
      return 1;
    case "II":
      return 2;
    case "III":
      return 3;
    case "IIII":
    case "IV":
      return 4;
    case "V":
      return 5;
    case "IX":
      return 9;
    case "X":
      return 10;
    case "XX":
      return 20;
    case "XXX":
      return 30;
    case "XXXX":
    case "XL":
      return 40;
    case "L":
      return 50;
    case "XC":
      return 90;
    case "C":
      return 100;
    case "CC":
      return 200;
    case "CCC":
      return 300;
    case "CCCC":
    case "CD":
      return 400;
    case "D":
      return 500;
    case "CM":
      return 900;
    case "M":
      return 1000;
    case "MM":
      return 2000;
    case "MMM":
      return 3000;
  }
};

const stringToRomanDigits = (input: string): RomanDigit[] => {
  // using reduce, this function iterates through the full list of roman digits,
  // adding them to an accumulating list if they can be found in the input string

  type Accumulator = [RomanDigit[], string];

  const reducer = (acc: Accumulator, rd: RomanDigit): Accumulator => {
    const [foundDigits, remainingString] = acc;
    const digitLength = rd.length;

    //if the start of the string matches the roman numeral digit
    if (remainingString.slice(0, digitLength) === rd) {
      // add the digit to the list of found digits. remove the digit from the string
      return [foundDigits.concat([rd]), remainingString.slice(digitLength)];;
    } else {
      return acc;
    }
  };

  return romanDigits.reduce(reducer, [[], input])[0];
};

// cant use replaceall apparently. incompatible with some javascript versions
const toString = (input: RomanNumeral): string =>
  // makes an array of ones("I") the length of the input value, then uses replace to "divide" down to the correct representation.
  Array(input.value)
    .fill("I")
    .join("")
    .replace(/IIIII/gi, "V")
    .replace(/VV/gi, "X")
    .replace(/XXXXX/gi, "L")
    .replace(/LL/gi, "C")
    .replace(/CCCCC/gi, "D")
    .replace(/DD/gi, "M")
    .replace(/IIII/gi, "IV")
    .replace(/XXXX/gi, "XL")
    .replace(/CCCC/gi, "CD")
    .replace(/VIV/gi, "IX")
    .replace(/LXL/gi, "XC")
    .replace(/DCD/gi, "CM");

const ROMANREGEX = /^M{0,3}(CM|CD|D?C{0,4})(XC|XL|L?X{0,4})(IX|IV|V?I{0,4})$/;

export default class RomanNumeral {
  // public interface for the module.

  // constructor is private because we want instantiation to only happen through the
  // fromInt and fromString functions.
  private constructor(readonly value: number) {}

  asInt = () => this.value;
  asString = () => toString(this);

  static init = new RomanNumeral(1);

  static fromInt = (input: number): Result<RomanNumeral, Error[]> => {
    const nanErr = isNaN(input) ? [nanError] : [];
    const floatErr = !Number.isInteger(input) ? [floatError] : [];
    const rangeErr = input < 1 || input > 3999 ? [rangeError] : [];

    const errors = nanErr.concat(floatErr.concat(rangeErr));

    return errors.length === 0 ? ok(new RomanNumeral(input)) : err(errors);
  };

  static fromString = (input: string): Result<RomanNumeral, Error[]> => {
    if (input.match(ROMANREGEX) && input !== "") {
      const int = stringToRomanDigits(input)
        .map(romanDigitToInt)
        .reduce((a, b) => a + b);

      return ok(new RomanNumeral(int));
    } else {
      return err([parseError]);
    }
  };
}
