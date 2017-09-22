import * as assert from 'assert';
import config from '../main/server/config';
import db from '../main/server/db';
import * as mongoose from 'mongoose';

import UserModel, { UserDocument, UserService } from '../main/server/models/UserModel'; assert.ok(UserModel); // import文が最適化により省略されないように
import MatchModel, { MatchService } from '../main/server/models/MatchModel'; assert.ok(MatchModel); // import文が最適化により省略されないように

import TestUtils from './TestUtils';

describe('User', () => {
  let user: UserDocument | null = null;
  before(function () {
    this.timeout(5000);
    return db(config.mongodb.test);
  });

  beforeEach(() => {
    return TestUtils.reset(config).then(() => {
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

  it('findByOAuthAccount', () => {
    return UserService.findByOAuthAccount({ service: 'twitter', account: '1234' }).then((findedUser) => {
      if (!findedUser) {
        return Promise.reject('failed');
      }
      assert.ok(findedUser.account === 'account', 'account');
      assert.ok(findedUser.provider.service === 'twitter', 'oauthProvider');
      assert.ok(findedUser.provider.account === '1234', 'oauthAccount');
      return Promise.resolve();
    });
  });

  it('loadByAccount', () => {
    return UserService.loadByAccount('account').then((loadedUser) => {
      if (!loadedUser) {
        return Promise.reject('failed');
      }
      assert.ok(loadedUser.account === 'account', 'account');
      assert.ok(loadedUser.provider.service === 'twitter', 'oauthProvider');
      assert.ok(loadedUser.provider.account === '1234', 'oauthAccount');
      return Promise.resolve();
    });
  });

  it('loadWithMatchees', function () {
    this.timeout(10000);
    const match = new MatchModel();
    if (!user) {
      throw new Error();
    }
    match.winner = user;
    match.players = [user];
    console.log('createAndRegisterToUser start');
    return MatchService.createAndRegisterToUser(match).then((createdMatch) => {
      console.log('createAndRegisterToUser successful');
      console.log('loadWithMatchees start');
      return UserService.loadWithMatchees('account').then((loadedUser) => {
        console.log('loadWithMatchees successful');
        assert.ok(loadedUser.matches.length === 1, 'matches');
        assert.ok(loadedUser.matches[0].winner.account === 'account', 'winner account');
        assert.ok(loadedUser.matches[0].players.length === 1, 'players');
        assert.ok(loadedUser.matches[0].players[0].account === 'account', 'players');
        return Promise.resolve();
      });
    });
  });
});
