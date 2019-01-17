const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const swaggerUi = require('swagger-ui-express');
const forceSsl = require('force-ssl-heroku');
const compression = require('compression');
import cors from "cors";
import swaggerDocument from "./swagger";
import filePlugin from './utils/file_plugin';
const port = process.env.PORT || 3000;


import { authenticatedRoute, adminRoute, reviewerRoute, sponsorRoute } from "./router/authenticatedRoute";
import { getApplicationInfo, setApplicationInfo, submitApplicationInfo } from "./routes/application_info";
import { getUserDetail } from "./routes/user_detail";
import { getUserList, getUserStats } from "./routes/user_list";
import { getApplicationStatus, setApplicationStatus, confirmAdmission, declineAdmission } from "./routes/user_status";
import { setAdminInfo } from "./routes/admin_info";
import { getLeaderboard, getReviewStats, rateReview, reviewNextApplication } from "./routes/user_review";
import { bulkChangeUsers } from "./routes/user_bulk_change";
import { bulkCreateUsers } from "./routes/user_bulk_create";
import { setTransportationInfo, submitTransportationInfo, getTransportationInfo } from "./routes/transportation_info";
import { getUserResumes } from "./routes/user_resumes";
import { importHacks } from "./routes/hacks/hacks_import";

// Set up the Express app
const app = express();
app.use(forceSsl);
app.use(compression());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:65210/test", { useNewUrlParser: true }).catch(function (reason: string) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});
mongoose.plugin(filePlugin);

// Set up static files
app.use(express.static('public'));

// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json({ limit: '10mb' }));
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
        console.log(`App listening on port ${port}!`);
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

// Auth - user must be signed in:
authenticatedRoute.get('/users/:userId/forms/transportation', getTransportationInfo);
authenticatedRoute.put('/users/:userId/forms/transportation', setTransportationInfo);
authenticatedRoute.post('/users/:userId/forms/transportation/submit', submitTransportationInfo);
authenticatedRoute.get('/users/:userId/forms/application_info', getApplicationInfo);
authenticatedRoute.put('/users/:userId/forms/application_info', setApplicationInfo);
authenticatedRoute.post('/users/:userId/forms/application_info/submit', submitApplicationInfo);
// What permission should this one be?
authenticatedRoute.get('/users/:userId/status', getApplicationStatus);
authenticatedRoute.get('/users/:userId', getUserDetail);

// Admin protected functions.
authenticatedRoute.put('/users/:userId/status', [adminRoute], setApplicationStatus);
authenticatedRoute.post('/users/:userId/status/confirm', confirmAdmission);
authenticatedRoute.post('/users/:userId/status/decline', declineAdmission);
authenticatedRoute.get('/users', [sponsorRoute], getUserList);
authenticatedRoute.post('/users_resumes', [sponsorRoute], getUserResumes);
authenticatedRoute.get('/users_stats', [adminRoute], getUserStats);
authenticatedRoute.post('/users_bulkchange', [adminRoute], bulkChangeUsers);
authenticatedRoute.post('/users_bulkcreate', [adminRoute], bulkCreateUsers);
authenticatedRoute.post('/hacks_import', [adminRoute], importHacks);

// Need custom auth:
authenticatedRoute.put('/users/:userId/admin_info', [adminRoute], setAdminInfo);

// Review routes:
authenticatedRoute.get('/review/leaderboard', [reviewerRoute], getLeaderboard);
authenticatedRoute.get('/review/stats', [reviewerRoute], getReviewStats);
authenticatedRoute.post('/review/rate', [reviewerRoute], rateReview);
authenticatedRoute.get('/review/next_application', [reviewerRoute], reviewNextApplication);

export default app;