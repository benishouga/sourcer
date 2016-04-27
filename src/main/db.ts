import * as mongoose from 'mongoose';

import User from './models/User';
import Match from './models/Match';
console.log(typeof User, typeof Match);

export default function(dbURI: string): Promise<{}> {
  mongoose.disconnect();

  return new Promise<{}>((resolve, reject) => {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose> connected: ' + dbURI);
      resolve();
    });
    mongoose.connection.on('error', (err: any) => {
      console.log('Mongoose> error: ' + err);
      reject(err);
    });
    mongoose.connection.on('disconnected', () => console.log('Mongoose> disconnected'));
    console.log('Mongoose> connect: ' + dbURI);
    mongoose.connect(dbURI);

    process.on('SIGINT', () => {
      mongoose.connection.close(function() {
        console.log('Mongoose> SIGINT - terminating...');
        process.exit(0);
      });
    });
  });
}
