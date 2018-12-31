import CognitoExpress from "cognito-express";
import express from "express";
import {get} from "lodash";

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
    res.locals.user = response;
    next();
  });
});
authenticatedRoute.param('userId', (req, res, next, userId) => {
  if (res.locals.user.sub !== userId) {
    let groups = get(res.locals.user, "cognito:groups", []);
    let isViewingUser = req.route.path === "/users/:userId/forms/application_info" && req.method === "GET";
    if (groups.indexOf('admin') > -1) {
    }
    else if (groups.indexOf('sponsor') > -1 && isViewingUser) {
      // Sponsors are able to view users (with a filter implemented on the route itself).
    }
    else {
      return res.status(401).send("User does not have access to user ID: " + userId + "; user id is " + res.locals.user.sub);
    }
  }
  next();
});


const validateGroup = (group) => (req, res, next) => {
  // Allow either a single group or multiple valid groups passed as an array
  if (!Array.isArray(group)) { group = [group]; }

  let accessTokenFromClient = req.headers.authorization;
  if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {
    if (err) return res.status(401).send(err);
    // TODO: check permissions here.
    res.locals.user = response;
    if (res.locals.user['cognito:groups'] && group.some(g => res.locals.user['cognito:groups'].indexOf(g) !== -1)) {
      next();
    }
    else {
      return res.status(401).send("Unauthorized; user is not a " + group + ". User is in groups: " + res.locals.user['cognito:groups']);
    }
  });
}

export const adminRoute = express.Router();
adminRoute.use(validateGroup("admin"));

export const reviewerRoute = express.Router();
reviewerRoute.use(validateGroup("reviewer"));

export const sponsorRoute = express.Router();
sponsorRoute.use(validateGroup(["admin", "sponsor"]));
