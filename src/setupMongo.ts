import MongodbMemoryServer from 'mongodb-memory-server';

const mongoServer = new MongodbMemoryServer({
  binary: { version: "latest" },
  instance: {port: 65210, dbName: "test"}
});

  // mongoose.Promise = Promise;
  console.warn("Setting up mongodb server...");
  mongoServer.getConnectionString().then((uri: string) => {
    process.env.MONGODB_CONN_STR = uri;
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