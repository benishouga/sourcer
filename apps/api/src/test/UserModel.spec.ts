import * as assert from 'assert';
import db from '../db';
import mongoose from 'mongoose';

import UserModel, { UserDocument, UserService } from '../models/UserModel';
import MatchModel, { MatchService } from '../models/MatchModel';

import TestUtils from './TestUtils';
import Env from '../Env';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

describe('User', () => {
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

  it('findByOAuthAccount', async () => {
    const findedUser = await UserService.findByOAuthAccount({ service: 'twitter', account: '1234' });
    if (!findedUser) {
      throw new Error('failed');
    }
    assert.ok(findedUser.account === 'account', 'account');
    assert.ok(findedUser.provider.service === 'twitter', 'oauthProvider');
    assert.ok(findedUser.provider.account === '1234', 'oauthAccount');
  });

  it('loadByAccount', async () => {
    const loadedUser = await UserService.loadByAccount('account', false);
    if (!loadedUser) {
      throw new Error('failed');
    }
    assert.ok(loadedUser.account === 'account', 'account');
    assert.ok(loadedUser.provider.service === 'twitter', 'oauthProvider');
    assert.ok(loadedUser.provider.account === '1234', 'oauthAccount');
  });

  it('loadWithMatchees', async () => {
    const match = new MatchModel();
    if (!user) {
      throw new Error();
    }
    match.winner = user;
    match.players = [user];
    console.log('createAndRegisterToUser start');
    await MatchService.createAndRegisterToUser(match);
    console.log('createAndRegisterToUser successful');
    console.log('loadWithMatchees start');
    const loadedUser = await UserService.loadWithMatches('account', true);
    if (!loadedUser) {
      throw new Error('failed');
    }
    console.log('loadWithMatchees successful');
    assert.ok(loadedUser.matches.length === 1, 'matches');
    console.log('loadedUser.matches[0].winner.account', loadedUser.matches[0].winner.account);
    assert.ok(loadedUser.matches[0].winner.account === 'account', 'winner account');
    assert.ok(loadedUser.matches[0].players.length === 1, 'players');
    assert.ok(loadedUser.matches[0].players[0].account === 'account', 'players');
  }, 10000);
});
