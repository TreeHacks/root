import MongodbMemoryServer from 'mongodb-memory-server';
import Application from "./models/Application";
import {USER_ID} from "./constants";
import mongoose from "mongoose";

const mongoServer = new MongodbMemoryServer({
  binary: { version: "latest" },
  instance: {port: 65210, dbName: "test"}
});

  // mongoose.Promise = Promise;
  console.warn("Setting up mongodb server...");
  mongoServer.getConnectionString().then((mongoUri: string) => {
    process.env.MONGODB_CONN_STR = mongoUri;
    mongoose.connect("mongodb://localhost:65210/test").catch(function (reason: string) {
      console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });
    const application = new Application({
      user: USER_ID,
      forms: {
        additional_info: {"test": "hee"}
      }
    });
    console.warn("Finished setting up mongodb server at uri", mongoUri);
    return application.save();
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