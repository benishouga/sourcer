import mongoose from 'mongoose';

import './models/UserModel';
import './models/MatchModel';

export default async function initDb(uri: string): Promise<mongoose.Connection> {
  if (!uri) {
    throw new Error('MongoDB uri is undefined');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error('MongoDB connection error. Please make sure MongoDB is running.', error);
    throw error;
  }

  if (mongoose.connection.listeners('error').length === 0) {
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error.', err);
    });
  }

  console.log('MongoDB connected', mongoose.connection.db?.databaseName ?? 'unknown');
  return mongoose.connection;
}
