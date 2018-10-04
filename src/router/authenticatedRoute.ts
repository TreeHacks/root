import CognitoExpress from "cognito-express";
import express from "express";

const authenticatedRoute = express.Router();

//Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
  region: "us-east-1",
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

authenticatedRoute.use(function(req, res, next) {
  let accessTokenFromClient = req.headers.authorization;
  if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");

  cognitoExpress.validate(accessTokenFromClient, function(err, response) {
      if (err) return res.status(401).send(err);  
      // TODO: check permissions here.
      res.locals.user = response;
      next();
  });
});


export default authenticatedRoute;
