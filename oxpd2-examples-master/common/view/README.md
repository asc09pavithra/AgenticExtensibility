# OXPd 2.0 Examples App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn install`

Install required packages before building/running.

### `yarn dev`

Runs the app in local development mode, using connect-api-mocker to serve up mock API data.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

The mock-api data is served from [http://localhost:5000/oxpd2-examples/api](http://localhost:5000/oxpd2-examples/api)

### `yarn serve`

Runs the app in the "server" development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Before running this script, you should first launch a corresponding OXPd 2.0 Examples host server to provide the back-end REST API. Note that the backend-server may also launch the most recently built version of the web-app in a separate browser window. But you don't want to interact with that one, you want to interact with "dev-mode" app loaded at the above location.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn coverage:cli`

Launches the test runner in the interactive watch mode with code coverage output.

### `yarn test:debug`

Allows debugging of unit tests. Once launched, navigate to Chrome to debug at `about:inspect`

### `yarn build`

Builds the app for production to the folder specified BUILD_PATH in '.env' file .\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn clean`

Clean all yarn caches
