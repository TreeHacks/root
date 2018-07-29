import CognitoExpress from "cognito-express";
import express from "express";

const authenticatedRoute = express.Router();

//Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
  region: "us-east-1",
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});



//Our middleware that authenticates all APIs under our 'authenticatedRoute' Router
authenticatedRoute.use(function(req, res, next) {
  
  //I'm passing in the access token in header under key accessToken
  let accessTokenFromClient = req.headers.accesstoken;

  //Fail if token not present in header. 
  if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");

  cognitoExpress.validate(accessTokenFromClient, function(err, response) {
      
      //If API is not authenticated, Return 401 with error message. 
      if (err) return res.status(401).send(err);
      
      //Else API has been authenticated. Proceed.
      res.locals.user = response;
      next();
  });
});


export default authenticatedRoute;
