const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
import cors from "cors";
// const swaggerDocument = YAML.load('./swagger.yaml');
import swaggerDocument from "./swagger";
const port = process.env.PORT || 3000;


import authenticatedRoute from "./router/authenticatedRoute";
import { getAdditionalInfo, setAdditionalInfo } from "./routes/additional_info";
import { getApplicationInfo, setApplicationInfo } from "./routes/application_info";
import { getUserDetail } from "./routes/user_detail";
import { getApplicationStatus, setApplicationStatus } from "./routes/user_status";
import { setAdminInfo } from "./routes/admin_info";

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

// Auth - user must be signed in:
authenticatedRoute.get('/users/:userId/forms/additional_info', getAdditionalInfo);
authenticatedRoute.put('/users/:userId/forms/additional_info', setAdditionalInfo);
authenticatedRoute.get('/users/:userId/forms/application_info', getApplicationInfo);
authenticatedRoute.put('/users/:userId/forms/application_info', setApplicationInfo);
// What permission should this one be?
authenticatedRoute.get('/users/:userId/status', getApplicationStatus);

// Admin protected functions:
authenticatedRoute.put('/users/:userId/status', setApplicationStatus);
authenticatedRoute.get('/users/:userId', getUserDetail);

// Need custom auth:
authenticatedRoute.put('/users/:userId/admin_info', setAdminInfo);

export default app;