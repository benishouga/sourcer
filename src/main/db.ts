import * as mongoose from 'mongoose';

import User from './models/User';
import Match from './models/Match';
console.log(typeof User, typeof Match);

export default function(dbURI: string) {
  mongoose.disconnect();
  mongoose.connect(dbURI);
  mongoose.connection.on('connected', () => console.log('Mongoose> connected: ' + dbURI));
  mongoose.connection.on('error', (err: any) => console.log('Mongoose> error: ' + err));
  mongoose.connection.on('disconnected', () => console.log('Mongoose> disconnected'));
  process.on('SIGINT', () => {
    mongoose.connection.close(function() {
      console.log('Mongoose> SIGINT - terminating...');
      process.exit(0);
    });
  });
}
