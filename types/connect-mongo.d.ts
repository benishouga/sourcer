import { Store } from 'express-session';
import { MongoClient } from 'mongodb';

declare namespace connectMongo {
  interface ConnectMongoOptions {
    client?: MongoClient;
    clientPromise?: Promise<MongoClient>;
    mongoUrl?: string;
    collectionName?: string;
    dbName?: string;
    ttl?: number;
    touchAfter?: number;
    autoRemove?: 'native' | 'interval' | 'disabled';
  }

  interface MongoStore extends Store {}

  interface MongoStoreConstructor {
    new (options: ConnectMongoOptions): MongoStore;
    create(options: ConnectMongoOptions): MongoStore;
  }
}

declare const connectMongo: connectMongo.MongoStoreConstructor;

export = connectMongo;
