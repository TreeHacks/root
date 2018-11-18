const express = require('express');
const bodyParser = require('body-parser');
const forceSsl = require('force-ssl-heroku');
const compression = require('compression');

// Set up the Express app
const app = express();
app.use(forceSsl);
app.use(compression());

// Set up static files
app.use("/dist", express.static('dist'));

// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err); // To see properties of message in our console
    res.status(422).send({error: err.message});
});

var port = process.env.PORT || 9000;

// Starts the Express server, which will run locally @ localhost:3000
app.listen(port, () => {
    console.log('App listening on port 9000!');
});

// Serves the index.html file (our basic frontend)
app.get('*',(req, res) => {
	res.sendFile('index.html', {root: __dirname});
});