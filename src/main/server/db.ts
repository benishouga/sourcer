import * as mongoose from 'mongoose';

import UserModel from './models/UserModel';
import MatchModel from './models/MatchModel';
console.log(typeof UserModel, typeof MatchModel);

(mongoose as any).Promise = Promise;

export default function (dbURI: string): Promise<mongoose.Connection> {

  return new Promise<mongoose.Connection>((resolve, reject) => {
    mongoose.connect(dbURI, {
      useMongoClient: true
    });

    mongoose.connection.on('error', () => {
      console.log('MongoDB connection error. Please make sure MongoDB is running.');
      process.exit();
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose> connected: ' + dbURI);
      resolve();
    });
  });
}
