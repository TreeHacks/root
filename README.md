# TreeHacks application portal frontend

Treehacks application portal frontend for 2019. See it at https://apply.treehacks.com

## Local setup
1. Download the appropriate `.env` file with the proper environment variables set, and put it in your working directory.
2. Run `npm install`
3. Run `npm start`

## Running tests
Application will deploy to Heroku only if tests pass.
Run `npm test` to run tests.
Run `npm test -- -- -u` to update snapshots.

## Environment variables in the .env file
```
COGNITO_USER_POOL_ID=...
COGNITO_CLIENT_ID=...
ENDPOINT_URL= http://localhost:3000 (for local server), or https://api.dev.treehacks.com (dev)
COGNITO_ENDPOINT_URL: https://treehacks-dev.auth.us-east-1.amazoncognito.com (dev) and https://treehacks-prod.auth.us-east-1.amazoncognito.com (prod)
MODE=DEV
```
