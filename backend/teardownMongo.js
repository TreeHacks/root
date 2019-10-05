var mongoose = require("mongoose");	
module.exports = async function() {	
    await mongoose.disconnect();	
    await global.__MONGOD__.stop();	
}; 