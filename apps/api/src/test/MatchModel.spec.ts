import db from '../db';
import mongoose from 'mongoose';

import UserModel, { UserDocument, UserService } from '../models/UserModel';
import MatchModel, { MatchService } from '../models/MatchModel';

import TestUtils from './TestUtils';
import Env from '../Env';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

describe('Match', () => {
  let user: UserDocument | null = null;
  beforeAll(async () => {
    const mongoDbUri = Env.mongoTest;
    if (!mongoDbUri) {
      throw new Error('env.MONGO_TEST is not defined.');
    }
    await db(mongoDbUri);
  }, 10000);

  beforeEach(async () => {
    await TestUtils.clearDb();
    console.log('UserModel save start');
    user = new UserModel();
    user.account = 'account';
    user.provider = {
      service: 'twitter',
      account: '1234'
    };
    await user.save();
    console.log('UserModel save successful');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('createAndRegisterToUser', async () => {
    const match = new MatchModel();
    if (!user) {
      throw new Error();
    }
    match.winner = user;
    match.players = [user];
    await MatchService.createAndRegisterToUser(match);
    console.log('match save resolved');
    const savedUser = await UserService.loadWithMatches('account', true);
    console.log('savedUser ', savedUser);
  });
});
