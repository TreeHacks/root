const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const swaggerUi = require("swagger-ui-express");
const forceSsl = require("force-ssl-heroku");
const compression = require("compression");
const cors = require("cors");
const multer = require('multer');

import swaggerDocument from "./swagger";
import filePlugin from "./utils/file_plugin";
const port = process.env.PORT || 9000;

import {
  authenticatedRoute,
  adminRoute,
  reviewerRoute,
  judgeRoute,
  sponsorRoute,
  anonymousRoute,
  applicantRoute,
} from "./router/authenticatedRoute";
import {
  getApplicationInfo,
  setApplicationInfo,
  submitApplicationInfo,
} from "./routes/application_info";
import { getMeetInfo, setMeetInfo } from "./routes/meet_info";
import { getUsedMeals, setUsedMeals } from "./routes/used_meals";
import { getWorkshopList, setWorkshopList } from "./routes/workshop_info";
import { getCheckIn, setCheckIn } from "./routes/check_in";
import { addTeammate, getTeamInfo, removeTeammate, setTeamInfo } from "./routes/team_info";
import { getSubmitInfo, setSubmitInfo } from "./routes/submit_info";
import { getUserDetail } from "./routes/user_detail";
import { getUserList, getUserStats, getMeetList } from "./routes/user_list";
import {
  getApplicationStatus,
  getUserProfile,
  setApplicationStatus,
  confirmAdmission,
  declineAdmission,
} from "./routes/user_status";
import { setAdminInfo } from "./routes/admin_info";
import {
  getLeaderboard,
  getReviewStats,
  rateReview,
  reviewNextApplication,
} from "./routes/user_review";
import { bulkChangeUsers } from "./routes/user_bulk_change";
import { bulkCreateUsers } from "./routes/user_bulk_create";
import {
  setTransportationInfo,
  submitTransportationInfo,
  getTransportationInfo,
} from "./routes/transportation_info";
import { getUserResumes } from "./routes/user_resumes";
import { importHacks } from "./routes/hacks/hacks_import";
import {
  reviewNextHack,
  getJudgeLeaderboard,
  getJudgeStats,
  rateHack,
} from "./routes/hacks/judging";
import { getHackList, editHack } from "./routes/hacks/hacks_list";
import { getJudgeList, editJudge } from "./routes/hacks/judges";
import { getAnnouncements } from "./routes/announcements";
import { userContact } from "./routes/user_contact";
import {
  getRooms,
  reserveRoom,
  dropCurrentRoom,
  getPublicRoomStatus,
} from "./routes/rooms";
import { mentorCreate } from "./routes/mentor_create";
import { leaderboard } from "./routes/leaderboard";
import {
  createTeam,
  setTeamData,
  joinTeam,
  leaveTeam,
  getUserTeamData,
} from "./routes/teams";
import {
  uploadSponsorLogo,
  updateSponsor,
  createSponsor,
  getSponsors,
  getSponsorByAdminEmail,
  addHackerToSponsor,
  removeHackerFromSponsor,
  getHackersByAdminEmail,
  getSponsorDetail,
  createAdmin
} from "./routes/sponsors"

// Set up the Express app
const app = express();
app.use(forceSsl);
app.use(compression());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(function(reason: string) {
    console.log("Unable to connect to the mongodb instance. Error: ", reason);
  });
mongoose.plugin(filePlugin);

// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Starts the Express server, which will run locally @ localhost:9000
if (!module.parent) {
  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  // file size limitation in bytes
  limits: { fileSize: 52428800 },
});

const apiRouter = express.Router();

apiRouter.use(
  "/doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

apiRouter.get("/", (req, res) => res.redirect("/doc"));

// Public routes
apiRouter.get("/hacks", [anonymousRoute], getHackList);
apiRouter.get("/announcements", [anonymousRoute], getAnnouncements);
apiRouter.get("/rooms/status", [anonymousRoute], getPublicRoomStatus);
apiRouter.get("/users/:userId/contact", [anonymousRoute], userContact);
apiRouter.get("/leaderboard", [anonymousRoute], leaderboard);
apiRouter.post("/mentor_create", [anonymousRoute], mentorCreate);
apiRouter.post("/sponsor/admin", createAdmin);

apiRouter.use("/", authenticatedRoute);

// Auth - user must be signed in:
authenticatedRoute.get(
  "/users/:userId/forms/transportation",
  getTransportationInfo
);
authenticatedRoute.put(
  "/users/:userId/forms/transportation",
  setTransportationInfo
);
authenticatedRoute.post(
  "/users/:userId/forms/transportation/submit",
  submitTransportationInfo
);
authenticatedRoute.get(
  "/users/:userId/forms/application_info",
  getApplicationInfo
);
authenticatedRoute.put(
  "/users/:userId/forms/application_info",
  setApplicationInfo
);
authenticatedRoute.post(
  "/users/:userId/forms/application_info/submit",
  submitApplicationInfo
);
authenticatedRoute.get("/users/:userId/forms/meet_info", getMeetInfo);
authenticatedRoute.put("/users/:userId/forms/meet_info", setMeetInfo);
authenticatedRoute.get("/users/:userId/forms/used_meals", getUsedMeals);
authenticatedRoute.put("/users/:userId/forms/used_meals", setUsedMeals);
authenticatedRoute.get("/users/:userId/forms/check_in", getCheckIn);
authenticatedRoute.put("/users/:userId/forms/check_in", setCheckIn);
authenticatedRoute.get("/users/:userId/forms/submit_info", getSubmitInfo);
authenticatedRoute.put("/users/:userId/forms/submit_info", setSubmitInfo);
authenticatedRoute.get("/users/:userId/forms/team_info", getTeamInfo);
authenticatedRoute.put("/users/:userId/forms/team_info", setTeamInfo);
authenticatedRoute.get("/users/:userId/forms/workshop_info", getWorkshopList);
authenticatedRoute.put("/users/:userId/forms/workshop_info", setWorkshopList);
authenticatedRoute.put("/users/:userId/forms/add_teammate", addTeammate);
authenticatedRoute.put("/users/:userId/forms/remove_teammate", removeTeammate);

// What permission should this one be?
authenticatedRoute.get("/users/:userId/status", getApplicationStatus);
authenticatedRoute.get("/users/:userId", getUserDetail);

// Room reservations
authenticatedRoute.get("/rooms", getRooms);
authenticatedRoute.post("/rooms", reserveRoom);
authenticatedRoute.delete("/rooms", dropCurrentRoom);

// Team management
authenticatedRoute.post("/users/:userId/teams/create", createTeam);
authenticatedRoute.post("/users/:userId/teams/join", joinTeam);
authenticatedRoute.get("/users/:userId/teams/team", getUserTeamData);
authenticatedRoute.put("/users/:userId/teams/team", setTeamData);
authenticatedRoute.post("/users/:userId/teams/leave", leaveTeam);
authenticatedRoute.get("/users/teams/list");

// Admin protected functions.
authenticatedRoute.put(
  "/users/:userId/status",
  [adminRoute],
  setApplicationStatus
);
authenticatedRoute.post("/users/:userId/status/confirm", confirmAdmission);
authenticatedRoute.post("/users/:userId/status/decline", declineAdmission);
// This one is not admin-protected.
authenticatedRoute.get("/users", [sponsorRoute], getUserList);
authenticatedRoute.get("/users_meet", [applicantRoute], getMeetList);
authenticatedRoute.get("/user_profile", [applicantRoute], getUserProfile);
// Admin protected
authenticatedRoute.post("/users_resumes", [sponsorRoute], getUserResumes);
authenticatedRoute.get("/users_stats", [adminRoute], getUserStats);
authenticatedRoute.post("/users_bulkchange", [adminRoute], bulkChangeUsers);
authenticatedRoute.post("/users_bulkcreate", [adminRoute], bulkCreateUsers);
authenticatedRoute.post("/hacks_import", [adminRoute], importHacks);
authenticatedRoute.get("/judges", [adminRoute], getJudgeList);
authenticatedRoute.patch("/judges/:judgeId", [adminRoute], editJudge);
authenticatedRoute.patch("/hacks/:hackId", [adminRoute], editHack);
// edit hacks

// Need custom auth:
authenticatedRoute.put("/users/:userId/admin_info", [adminRoute], setAdminInfo);

// Sponsor routes:
authenticatedRoute.get("/sponsors", getSponsors);
authenticatedRoute.get("/sponsors/:sponsorId", getSponsorDetail);
authenticatedRoute.put("/sponsor/:sponsorId/hacker", addHackerToSponsor);
authenticatedRoute.delete("/sponsor/:sponsorId/hacker", removeHackerFromSponsor);
authenticatedRoute.get("/sponsor", getSponsorByAdminEmail);

authenticatedRoute.get("/sponsor/hackers", [sponsorRoute], getHackersByAdminEmail);
authenticatedRoute.post("/sponsors/", [sponsorRoute], createSponsor);
// @ts-ignore
authenticatedRoute.post("/sponsor/logo", upload.single('file'), uploadSponsorLogo);
authenticatedRoute.put("/sponsor", [sponsorRoute], updateSponsor);

// Review routes:
authenticatedRoute.get("/review/leaderboard", [reviewerRoute], getLeaderboard);
authenticatedRoute.get("/review/stats", [reviewerRoute], getReviewStats);
authenticatedRoute.post("/review/rate", [reviewerRoute], rateReview);
authenticatedRoute.get(
  "/review/next_application",
  [reviewerRoute],
  reviewNextApplication
);

// Judging routes:
authenticatedRoute.get(
  "/judging/leaderboard",
  [judgeRoute],
  getJudgeLeaderboard
);
authenticatedRoute.get("/judging/stats", [judgeRoute], getJudgeStats);
authenticatedRoute.post("/judging/rate", [judgeRoute], rateHack);
authenticatedRoute.get("/judging/next_hack", [judgeRoute], reviewNextHack);

app.use("/api", apiRouter);

if (process.env.NODE_ENV === "test") {
  // Don't serve files when testing
} else if (process.env.MODE === "PROD") {
  // Set up static files
  app.use("/dist", express.static("build/dist"));

  // Serves the index.html file (our basic frontend)
  app.get("*", (req, res) => {
    res.sendFile("dist/index.html", { root: __dirname });
  });
} else {
  // Dev mode
  const history = require("connect-history-api-fallback");
  const path = require("path");
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const devConfig = require("../webpack.dev.js");

  devConfig.output.path = path.resolve("./build");
  devConfig.output.publicPath = "/";
  devConfig.entry.app.unshift(
    "webpack-hot-middleware/client?reload=true&timeout=1000"
  );
  devConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  devConfig.module.rules.forEach((r) => {
    r.use.forEach((u) => {
      if (u.options && u.options.publicPath) {
        u.options.publicPath = "/";
      }
    });
  });

  const compiler = webpack(devConfig);

  app.use(history());

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: devConfig.output.publicPath,
      historyApiFallback: true,
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

export default app;
