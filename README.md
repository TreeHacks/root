# application-portal
TreeHacks application portal for 2018.

## Run locally
```
npm i
npm run mongo
npm start
```

## Run tests
```
npm run mongo
npm test # or npm run tdd
```

## Environment variables
MONGO_CONN_STR - connection string for mongodb
MODE - mode ("PROD" or "DEV")
COGNITO_USER_POOL_ID - user pool id
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

## Todo
- Authorization
- Use https://www.npmjs.com/package/mongoose-authorization