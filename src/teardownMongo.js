var mongoose = require("mongoose");
module.exports = async function() {
    console.log("Tearing down mongodb server...");
    await mongoose.disconnect();
    await global.__MONGOD__.stop();
};