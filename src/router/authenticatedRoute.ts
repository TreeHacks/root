import CognitoExpress from "cognito-express";
import express from "express";

//Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
  region: "us-east-1",
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

export const authenticatedRoute = express.Router();
authenticatedRoute.use(function (req, res, next) {
  let accessTokenFromClient = req.headers.authorization;
  if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {
    if (err) return res.status(401).send(err);
    // TODO: check permissions here.
    res.locals.user = response;
    // console.log(res.locals.user['cognito:groups'].indexOf('admin'));
    next();
  });
});
authenticatedRoute.param('userId', (req, res, next, userId) => {
  if (res["cognito:username"] !== userId &&
    !(res.locals.user['cognito:groups'] && ~res.locals.user['cognito:groups'].indexOf('admin'))) {
    return res.status(401).send("User does not have access to user ID: " + userId);
  }
  next();
});

export const adminRoute = express.Router();
adminRoute.use(function (req, res, next) {
  let accessTokenFromClient = req.headers.authorization;
  if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {
    if (err) return res.status(401).send(err);
    // TODO: check permissions here.
    res.locals.user = response;
    if (res.locals.user['cognito:groups'] && ~res.locals.user['cognito:groups'].indexOf('admin')) {
      next();
    }
    else {
      return res.status(401).send("Unauthorized; user is not an admin. " + res.locals.user['cognito:groups']);
    }
  });
});
