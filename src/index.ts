const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const swaggerUi = require('swagger-ui-express');
const forceSsl = require('force-ssl-heroku');
import cors from "cors";
import swaggerDocument from "./swagger";
const port = process.env.PORT || 3000;


import {authenticatedRoute, adminRoute, reviewerRoute} from "./router/authenticatedRoute";
import { getAdditionalInfo, setAdditionalInfo } from "./routes/additional_info";
import { getApplicationInfo, setApplicationInfo, submitApplicationInfo } from "./routes/application_info";
import { getUserDetail } from "./routes/user_detail";
import { getUserList } from "./routes/user_list";
import { getApplicationStatus, setApplicationStatus } from "./routes/user_status";
import { setAdminInfo } from "./routes/admin_info";
import { MongoClient, ObjectId } from "mongodb";
import Application from "./models/Application";
import { getLeaderboard, getReviewStats, rateReview, reviewNextApplication } from "./routes/user_review";

// Set up the Express app
const app = express();
app.use(forceSsl);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:65210/test").catch(function (reason: string) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

// Set up static files
app.use(express.static('public'));

// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// HTTP request Logging
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
// app.get('/', (req: Request, res: Response) => {
//     // res.sendFile('index.html', {root: __dirname});
//     res.status(200).send('Welcome to treehacks.');
// });

const options = {
    customCss: '.swagger-ui .topbar { display: none }'
};
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.get("/", (req, res) => res.redirect("/doc"));

app.use("/", authenticatedRoute);
app.use("/", adminRoute);
app.use("/review/", reviewerRoute);

// Auth - user must be signed in:
authenticatedRoute.get('/users/:userId/forms/additional_info', getAdditionalInfo);
authenticatedRoute.put('/users/:userId/forms/additional_info', setAdditionalInfo);
authenticatedRoute.get('/users/:userId/forms/application_info', getApplicationInfo);
authenticatedRoute.put('/users/:userId/forms/application_info', setApplicationInfo);
authenticatedRoute.post('/users/:userId/forms/application_info/submit', submitApplicationInfo);
// What permission should this one be?
authenticatedRoute.get('/users/:userId/status', getApplicationStatus);

// Admin protected functions: TODO: protection.
adminRoute.put('/users/:userId/status', setApplicationStatus);
authenticatedRoute.get('/users/:userId', getUserDetail);
adminRoute.get('/users', getUserList);

// Need custom auth:
adminRoute.put('/users/:userId/admin_info', setAdminInfo);

// Review routes:
reviewerRoute.get('/leaderboard', getLeaderboard);
reviewerRoute.get('/stats', getReviewStats);
reviewerRoute.post('/rate', rateReview);
reviewerRoute.get('/next_application', reviewNextApplication);


export default app;