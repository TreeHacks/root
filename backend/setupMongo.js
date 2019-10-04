const MongodbMemoryServer = require('mongodb-memory-server');	

const mongoServer = new MongodbMemoryServer.MongoMemoryServer({	
  autoStart: false
});	

// mongoose.Promise = Promise;	
console.warn("Setting up mongodb server...");	
module.exports = async function () {	
    await mongoServer.start();
    process.env.MONGODB_URI = await mongoServer.getConnectionString();	
    // Set reference to mongod in order to close the server during teardown.	
    global.__MONGOD__ = mongoServer;	
}; 