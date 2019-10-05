# Root

Hackathon registration framework. Used in TreeHacks since 2019. See it in action at https://root.treehacks.com

## Local setup
1. Download the appropriate `.env` file with the proper environment variables set, and put it in your working directory.
1. Run `npm install`
1. Run `npm run mongo` in one terminal to run mongodb.
1. Run `npm start`

## Running tests
Application will deploy to Heroku only if tests pass.
Run `npm test` to run tests.

Run `npm test -- -- -u` to update snapshots.