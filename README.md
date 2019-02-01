# Project Portfolio

System to log, analyze and showcase your project work history.

## Development

This project was created using [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html), and [AWS Amplify](https://aws-amplify.github.io/).

To get started, run `npm install` to grab the dependencies.
React commands:

- `npm start` will start the react development server
- `npm test` to start jest tests
- `npm run build` to produce production builds

AWS Amplify commands:

- `amplify push` will push any changes made to the server and update local content accordingly
- `amplify publish` to run a production build and upload hosted content to AWS S3

### Environment variables

Create a .env file at the root of the project. The following variables are used in the project

REACT_APP_TEST_USER=test # this override your AWS SAM id with "test"
REACT_APP_USE_LOCAL_DATA=true # this will read in local test data and not do any AWS interaction
REACT_APP_USE_WHY_DID_YOU_UPDATE=true # this will use [why-did-you-update](https://github.com/maicki/why-did-you-update)
