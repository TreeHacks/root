const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CognitoExpress = require("cognito-express");
var path = require("path");
var request = require('request');
const port = process.env.PORT || 3000;
import { Router, Request, Response } from 'express';
import authenticatedRoute from "./src/router/authenticatedRoute";


// Set up the Express app
const app = express();

const userId = "test_user_id";


// If you want to connect to MongoDB - should be running locally
mongoose.connect(process.env.MONGO_CONN_STR);
// mongoose.Promise = global.Promise;

// Set up static files
app.use(express.static('public'));

// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Error handling middleware
// app.use((err: Error, req: Request, res: Response, next: Next) => {
//     console.log(err); // To see properties of message in our console
//     res.status(422).send({error: err.message});
// });



// Starts the Express server, which will run locally @ localhost:3000
app.server = app.listen(port, () => {
    console.log('App listening on port 3000!');
});

// Serves the index.html file (our basic frontend)
app.get('/',(req: Request, res: Response) => {   
    // res.sendFile('index.html', {root: __dirname});
    res.status(200).send('Welcome to treehacks.');
}); 


//Define your routes that need authentication check
authenticatedRoute.get("/myfirstapi", function(req, res, next) {
    res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});

export default app;