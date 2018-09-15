# application-portal
TreeHacks application portal for 2018.


## Run locally
Use a .env file.
```
npm i
npm start
```

## Run tests
```
npm run mongo
npm test # or npm run tdd
```

## Environment variables
MONGO_CONN_STR - connection string for mongodb (not needed for running it locally)
MODE - mode ("PROD" or "DEV")
COGNITO_USER_POOL_ID - user pool id
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

## Heroku custom domain names
https://devcenter.heroku.com/articles/custom-domains#add-a-custom-domain-with-a-subdomain
```
--org=treehacks 
heroku domains:add apply.dev.treehacks.com -a ap-frontend-test
heroku domains:add apply.treehacks.com -a ap-frontend-prod
heroku domains:add api.dev.treehacks.com -a application-portal-test
heroku domains:add api.treehacks.com -a application-portal-prod
```