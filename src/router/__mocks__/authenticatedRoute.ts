import express from "express";
import { CognitoUser } from "../../models/cognitoUser";

const authenticatedRoute = express.Router();
authenticatedRoute.use((req, res, next) => {
    res.locals.user = { sub: "SUB123123", email: "test@treehacks.com" } as CognitoUser;
    next();
});

export default authenticatedRoute;