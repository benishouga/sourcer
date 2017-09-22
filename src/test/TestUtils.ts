import * as mongoose from 'mongoose';

export default class TestUtils {
  public static clearCollection(collection: mongoose.Collection) {
    console.log('clear collection: ' + collection.collectionName);
    return collection.deleteMany({});
  }

  public static clearDb(): Promise<void> {
    const promises = Object.keys(mongoose.connection.collections).map((key) => {
      return TestUtils.clearCollection(mongoose.connection.collections[key]);
    });
    return Promise.all(promises).then(() => {
      console.log('mongodb all cleard');
      return Promise.resolve();
    });
  }

  public static reset(config: { mongodb: { test: string; }; }) {
    if (mongoose.connection.readyState === 0) {
      return TestUtils.connect(config.mongodb.test).then(() => {
        return TestUtils.clearDb();
      });
    } else {
      return TestUtils.clearDb();
    }
  }

  public static connect(dbUri: string) {
    return new Promise<mongoose.Connection>((resolve, reject) => {
      const connection = mongoose.createConnection(dbUri, {
        useMongoClient: true
      });

      connection.on('connected', () => {
        console.log('Mongoose> connected: ' + dbUri);
        resolve(connection);
      });
      connection.on('error', (err: any) => {
        console.log('Mongoose> error: ' + err);
        reject(err);
      });
      connection.on('disconnected', () => console.log('Mongoose> disconnected'));
      console.log('Mongoose> connect: ' + dbUri);
      process.on('SIGINT', () => {
        connection.close(() => {
          console.log('Mongoose> SIGINT - terminating...');
          process.exit(0);
        });
      });
    });
  }
}
