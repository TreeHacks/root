require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const { Token } = require("../../models/Token.ts");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(function(reason) {
    console.log("Unable to connect to the mongodb instance. Error: ", reason);
  });
// mongoose.plugin(filePlugin);

const NUM_INVITES = 10;

// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const createToken = (claims) => jwt.sign(claims, process.env.JWT_SECRET, {});

const createLink = async () => {
  const company_id = uuid();
  const JWT = createToken({ company_id });

  await Token.create({ company_id });
  return `https://meet.treehacks.com/admin?tkn=${JWT}`;
};

(async () => {
  const links = await Promise.all([...new Array(NUM_INVITES)].map(() => createLink()));

  console.log(links.join("\n"));
})();
