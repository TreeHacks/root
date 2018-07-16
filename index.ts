const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CognitoExpress = require("cognito-express");
var path = require("path");
var request = require('request');
import morgan from "morgan";
const port = process.env.PORT || 3000;
import { Router, Request, Response, NextFunction } from 'express';
import authenticatedRoute from "./src/router/authenticatedRoute";
import { getAdditionalInfo, setAdditionalInfo } from "./src/routes/additional_info";
import {getApplicationInfo} from "./src/routes/application_info";
import {getUserDetail} from "./src/routes/user_detail";
import {getApplicationStatus} from "./src/routes/user_status";

// Set up the Express app
const app = express();

const userId = "test_user_id";


// If you want to connect to MongoDB - should be running locally
mongoose.connect(process.env.MONGO_CONN_STR || "mongodb://localhost:65210/test").catch(function (reason: string) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});
// mongoose.Promise = global.Promise;

// Set up static files
app.use(express.static('public'));

// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(morgan('combined'))

// Error handling middleware
// app.use((err: Error, req: Request, res: Response, next: Next) => {
//     console.log(err); // To see properties of message in our console
//     res.status(422).send({error: err.message});
// });



// Starts the Express server, which will run locally @ localhost:3000
if (!module.parent) {
    app.listen(port, () => {
        console.log('App listening on port 3000!');
    });
}

// Serves the index.html file (our basic frontend)
app.get('/', (req: Request, res: Response) => {
    // res.sendFile('index.html', {root: __dirname});
    res.status(200).send('Welcome to treehacks.');
});

app.get('/users/:userId/forms/additional_info', getAdditionalInfo);
app.get('/users/:userId/forms/application_info', getApplicationInfo);
app.get('/users/:userId', getUserDetail);
app.get('/users/:userId/status', getApplicationStatus);



//Define your routes that need authentication check
authenticatedRoute.get("/myfirstapi", function (req, res, next) {
    res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});

export default app;