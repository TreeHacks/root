import express from "express";
import { CognitoUser } from "../../models/cognitoUser";

export const authenticatedRoute = express.Router();
authenticatedRoute.use((req, res, next) => {
    res.locals.user = { sub: "SUB123123", email: "test@treehacks.com" } as CognitoUser;
    next();
});

export const adminRoute = express.Router();
adminRoute.use((req, res, next) => {
    res.locals.user = { sub: "SUB123124", email: "admin@treehacks.com" } as CognitoUser;
    next();
});