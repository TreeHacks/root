import MongodbMemoryServer from 'mongodb-memory-server';

const mongoServer = new MongodbMemoryServer({ binary: { version: "latest" } });

beforeAll(() => {
  // mongoose.Promise = Promise;
  return mongoServer.getConnectionString().then((mongoUri: string) => {
    process.env.MONGODB_CONN_STR = mongoUri;

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
});
