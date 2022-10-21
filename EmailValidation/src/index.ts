import sendtoserver from "./mockbackend";

const getPasswordErrors = (input: string) => {
  const errors = [];

  if (input.length < 8) {
    errors.push("Password is too short.");
  }

  if (input.toLowerCase() === input) {
    errors.push("Password needs at least one uppercase character.");
  }

  if (!/\d/.test(input)) {
    errors.push("Password needs at least one number.");
  }

  return errors;
};

const updateErrors = (errors: string[]) => {
  const ul = document.createElement("ul");
  ul.setAttribute("id", "error-list");

  const errorToHtml = (err: string) => {
    const li = document.createElement("li");
    li.innerHTML += err;
    ul.appendChild(li);
  };

  errors.forEach(errorToHtml);

  document.getElementById("error-list")!.replaceWith(ul);
};

const validateForm = (e: Event) => {
  e.preventDefault(); // turn off default submit behaviour

  // get input field values
  const emailInput = (document.getElementById(
    "email-field"
  )! as HTMLInputElement).value;

  const passwordInput = (document.getElementById(
    "password-field"
  )! as HTMLInputElement).value;

  // check password for errors
  const errors = getPasswordErrors(passwordInput);

  // send to db if no errors
  if (!errors) {
    sendtoserver(emailInput, passwordInput);
  }

  updateErrors(errors);
};

document
  .getElementById("new-user-form")
  ?.addEventListener("submit", validateForm);
