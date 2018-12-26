# application-portal

Treehacks application portal backend for 2019. See it at https://api.treehacks.com (Swagger documentation).

## Run locally

### Environment variables
Put the following variables in a `.env` file in the directory:
```MONGODB_URI - connection string for mongodb (not needed for running it locally)
MODE - mode ("PROD" or "DEV")
COGNITO_USER_POOL_ID - user pool id
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```
Example:
```
MONGODB_URI=abdefg
...
```

### Run
```
npm i
npm start
```

## Run tests
```
npm run mongo
npm test # or npm run tdd
```

## Cognito config instructions
- Add a SAML IdP to user pool with name "Stanford" and URL "https://idp.stanford.edu/metadata.xml"
- Create a lambda function and link it to the Custom Message Lambda Trigger for the Cognito User Pool
