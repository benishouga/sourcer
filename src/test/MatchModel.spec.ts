import * as assert from 'assert';
import config from '../main/server/config';
import db from '../main/server/db';
import * as mongoose from 'mongoose';

import UserModel, { UserDocument, UserService } from '../main/server/models/UserModel'; assert.ok(UserModel); // import文が最適化により省略されないように
import MatchModel, { MatchService } from '../main/server/models/MatchModel'; assert.ok(MatchModel); // import文が最適化により省略されないように

import TestUtils from './TestUtils';

describe('Match', () => {
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

  it('find', () => {
    const match = new MatchModel();
    if (!user) {
      throw new Error();
    }
    match.winner = user;
    match.players = [user];
    return match.save().then(() => {
      console.log('match save resolved');
      return UserService.loadWithMatchees('account');
    }).then((savedUser) => {
      console.log('savedUser ', savedUser);
    });
  });
});