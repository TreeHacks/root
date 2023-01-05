import CognitoExpress from "cognito-express";
import express from "express";
import {get} from "lodash";
import {ALLOWED_GROUPS} from "../constants";

//Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
  region: "us-east-1",
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id", //Possible Values: access | id
  tokenExpiration: 86400000 //Up to default expiration of 24 hours (86400000 ms)
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
      return res.status(403).send("User does not have access to user ID: " + userId + ".");
    }
  }
  next();
});


const validateGroup = (group, allowAnonymous = false, allowNoGroupMatching = false) => {
  // Allow either a single group or multiple valid groups passed as an array
  if (!Array.isArray(group)) { group = [group]; }

  group = group.filter(e => ALLOWED_GROUPS.indexOf(e) > -1);

  group.push("admin"); // admins have access to all routes.

  return (req, res, next) => {
    let accessTokenFromClient = req.headers.authorization;

    cognitoExpress.validate(accessTokenFromClient, function (err, response) {
      if (err) {
        if (allowAnonymous) {
          res.locals.user = {};
          next();
          return;
        }
        else {
          return res.status(401).send(err);
        }
      }
      res.locals.user = response;
      if (res.locals.user['cognito:groups'] && group.some(g => res.locals.user['cognito:groups'].indexOf(g) !== -1)) {
        next();
      }
      else {
        if (allowNoGroupMatching) {
          next();
          return;
        }
        if (allowAnonymous) {
          res.locals.user = {};
          next();
          return;
        }
        else {
          return res.status(403).send("Unauthorized; user is not in group " + group  + ".");
        }
      }
    });
  }
}

export const adminRoute = express.Router();
adminRoute.use(validateGroup("admin"));

export const reviewerRoute = express.Router();
reviewerRoute.use(validateGroup("reviewer"));

export const judgeRoute = express.Router();
judgeRoute.use(validateGroup("judge"));

export const sponsorRoute = express.Router();
sponsorRoute.use(validateGroup(["admin", "sponsor"]));

export const applicantRoute = express.Router();
applicantRoute.use(validateGroup([], false, true));

export const anonymousRoute = express.Router();
anonymousRoute.use(validateGroup(["admin"], true));
