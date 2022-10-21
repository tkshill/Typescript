# Overview

This is a sample project using Type Driven Development in TypeScript. The project is a small React App that uses websockets to connect to an open port, listen to and receive json data from said port, and displays that data to the user.

## Tools Used

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

We make use of the [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) as well as the MVU style [reducer pattern](https://blog.logrocket.com/guide-to-react-usereducer-hook/) in React.

## Future Goals:

- Do property-based testing with the [fastcheck](https://github.com/dubzzz/fast-check) testing framework to ensure json conversion is working correctly
- Make styling that doesn't suck. Design is *not* my forte. I'm very slow and steady.
- Better accessibility


## How to Run

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
