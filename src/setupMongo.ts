import MongodbMemoryServer from 'mongodb-memory-server';
import Application from "./models/Application";
import mongoose from "mongoose";
import pow_mongodb_fixtures from "pow-mongodb-fixtures";
import fixtureContent from "./fixtures";

const mongoServer = new MongodbMemoryServer({
  binary: { version: "latest" },
  instance: {port: 65210, dbName: "test"}
});

var mongoUri: string;
  // mongoose.Promise = Promise;
  console.warn("Setting up mongodb server...");
  mongoServer.getConnectionString().then((uri: string) => {
    process.env.MONGODB_CONN_STR = uri;
    mongoUri = uri;
    let fixtures = pow_mongodb_fixtures.connect('test', {'host': 'localhost', 'port': 65210});
    fixtures.load(fixtureContent, (e: any) => {
      console.warn("Fixtures imported", e);
      console.warn("Finished setting up mongodb server at uri", mongoUri);
    })
    // mongoose.connect(mongoUri, mongooseOpts);

    // mongoose.connection.on('error', (e) => {
    //   if (e.message.code === 'ETIMEDOUT') {
    //     console.log(e);
    //     mongoose.connect(mongoUri, mongooseOpts);
    //   }
    //   console.log(e);
    // });

    // mongoose.connection.once('open', () => {
    //   console.log(`MongoDB successfully connected to ${mongoUri}`);
    // });
  });