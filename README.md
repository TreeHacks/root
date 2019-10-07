# Root

Hackathon registration framework. Used in TreeHacks since 2019. See it in action at https://root.treehacks.com

## Local setup
1. Make sure you have MongoDB installed (so `mongod` is in your PATH), on MacOS make sure that the `data/db` directory exists.
1. Download the appropriate `.env` file with the proper environment variables set, and put it in your working directory.
1. Run `npm install`
1. Run `npm start`
1. Open http://localhost:9000 in your browser.

## Running tests
Application will deploy to Heroku only if tests pass.
Run `npm test` to run tests.

Run `npm test -- -- -u` to update snapshots.
