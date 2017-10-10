import * as assert from 'assert';
import db from '../main/server/db';
import * as mongoose from 'mongoose';

import UserModel, { UserDocument, UserService } from '../main/server/models/UserModel';
import MatchModel, { MatchService } from '../main/server/models/MatchModel';

import TestUtils from './TestUtils';

describe('Match', () => {
  let user: UserDocument | null = null;
  before(async function () {
    this.timeout(5000);
    await db(process.env.MONGO_TEST);
  });

  beforeEach(() => {
    return TestUtils.clearDb().then(() => {
      console.log('UserModel save start');
      user = new UserModel();
      user.account = 'account';
      user.provider = {
        service: 'twitter', account: '1234'
      };
      return user.save();
    }).then(() => {
      console.log('UserModel save successful');
    });
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
    const savedUser = await UserService.loadWithMatchees('account');
    console.log('savedUser ', savedUser);
  });
});
