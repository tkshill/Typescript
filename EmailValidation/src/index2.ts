import sendtoserver from "./mockbackend";

type Credentials = {
  email: Email;
  password: Password;
};

type Email = { type: "email"; value: string };

type Password = { type: "password"; value: string };

type ParseError = "TooShort" | "NoCapitals" | "NoNumbers";

type Result<a> = ParseError[] | a;

const ok = <T>(r: Result<T>): r is T => "value" in r;
const err = (r: Result<any>): r is ParseError[] => "length" in r;

const tryEmail = (input: string): Result<Email> => ({
  type: "email",
  value: input
});

const tryPassword = (input: string): Result<Password> => {
  const errors: ParseError[] = [];

  if (input.length < 8) {
    errors.push("TooShort");
  }

  if (input.toLowerCase() === input) {
    errors.push("NoCapitals");
  }

  if (!/\d/.test(input)) {
    errors.push("NoNumbers");
  }

  if (!errors) {
    return { type: "password", value: input };
  } else {
    return errors;
  }
};

const tryCredentials = (
  emailinput: string,
  passwordinput: string
): Result<Credentials> => {
  const emailResult = tryEmail(emailinput);
  const passwordResult = tryPassword(passwordinput);

  if (ok(emailResult) && ok(passwordResult)) {
    return { email: emailResult, password: passwordResult };
  } else if (err(emailResult) && err(passwordResult)) {
    return emailResult.concat(passwordResult);
  } else if (err(emailResult)) {
    return emailResult;
  } else if (err(passwordResult)) {
    return passwordResult;
  } else {
    throw Error;
  }
};

const errorToString = (err: ParseError): string => {
  switch (err) {
    case "TooShort":
      return "Password is too short.";
    case "NoCapitals":
      return "Password needs at least one uppercase character.";
    case "NoNumbers":
      return "Password needs at least one number";
  }
};

const errorToHtml = (err: ParseError): HTMLLIElement => {
  const li = document.createElement("li");
  li.innerHTML += errorToString(err);
  return li;
};

const createErrorsHTML = (errors: ParseError[]): HTMLUListElement => {
  const ul = document.createElement("ul");
  const lis = errors.map(errorToHtml);
  lis.forEach((h) => ul.appendChild(h));

  return ul;
};

const updateServer = (creds: Credentials) =>
  sendtoserver(creds.email.value, creds.password.value);

const validateForm = (e: Event) => {
  e.preventDefault(); // turn off default sumbit behaviour

  // get input field values
  const unvalidatedEmail = (document.getElementById(
    "email-field"
  )! as HTMLInputElement).value;

  const unvalidatedPassword = (document.getElementById(
    "password-field"
  )! as HTMLInputElement).value;

  const result = tryCredentials(unvalidatedEmail, unvalidatedPassword);

  if (ok(result)) {
    updateServer(result);
  } else if (err(result)) {
    const newErrorsHtml = createErrorsHTML(result);
    newErrorsHtml.setAttribute("id", "error-list");
    document.getElementById("error-list")!.replaceWith(newErrorsHtml);
  }
};

document
  .getElementById("new-user-form")
  ?.addEventListener("submit", validateForm);
